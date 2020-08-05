import { useState, useEffect } from "react";
import tradeApi from "../services/tradeApiClient";
import useStoreSessionSelector from "./useStoreSessionSelector";
import useStoreSettingsSelector from "./useStoreSettingsSelector";
import useQuoteAssets from "./useQuoteAssets";
import useExchangesOptions from "./useExchangesOptions";
import { useIntl } from "react-intl";
import { uniqBy } from "lodash";
import {
  showErrorAlert,
  setConnectedCopytTimeframe,
  setConnectedSignalTimeframe,
  setCopytTimeframe,
  setSignalpTimeframe,
  setSignalpSort,
  setCopytSort,
} from "../store/actions/ui";
import { useDispatch } from "react-redux";
import useStoreUISelector from "./useStoreUISelector";
/**
 * @typedef {import("../store/initialState").DefaultState} DefaultStateType
 * @typedef {import("../store/initialState").DefaultStateSession} StateSessionType
 * @typedef {import("../services/tradeApiClient.types").ProvidersCollection} ProvidersCollection
 * @typedef {import("../services/tradeApiClient.types").ProviderEntity} ProviderEntity
 * @typedef {import("../services/tradeApiClient.types").ProvidersPayload} ProvidersPayload
 * @typedef {import("../components/CustomSelect/CustomSelect").OptionType} OptionType
 */

/**
 * @typedef {Object} ProvidersOptions
 * @property {boolean} copyTradersOnly
 * @property {boolean} connectedOnly
 */

/**
 * @typedef {Object} ProvidersData
 * @property {ProvidersCollection} providers
 * @property {number} timeFrame
 * @property {function} setTimeFrame
 * @property {OptionType} coin
 * @property {Array<OptionType>} coins
 * @property {function} setCoin
 * @property {string} exchange
 * @property {Array<OptionType>} exchanges
 * @property {string} exchangeType
 * @property {Array<OptionType>} exchangeTypes
 * @property {function} setExchange
 * @property {function} setExchangeType
 * @property {string} sort
 * @property {function} setSort
 * @property {function} clearFilters
 * @property {function} clearSort
 */

/**
 * Hook to generate the providers data fetching and filtering.
 *
 * @param {ProvidersOptions} options Hook options.
 * @returns {ProvidersData} Providers and filtering objects.
 */
const useProvidersList = (options) => {
  const intl = useIntl();
  const storeSettings = useStoreSettingsSelector();
  const internalExchangeId = storeSettings.selectedExchange.internalId;
  const storeSession = useStoreSessionSelector();
  const storeUI = useStoreUISelector();
  const dispatch = useDispatch();
  const { copyTradersOnly, connectedOnly } = options;

  /**
   * @type {{list: ProvidersCollection, filteredList: ProvidersCollection}} initialState
   */
  const initialState = { list: null, filteredList: null };
  const [providers, setProviders] = useState(initialState);

  const initTimeFrame = () => {
    if (copyTradersOnly && connectedOnly) {
      return storeUI.timeFrame.connectedCopyt;
    }
    if (!copyTradersOnly && connectedOnly) {
      return storeUI.timeFrame.connectedSignalp;
    }
    if (copyTradersOnly && !connectedOnly) {
      return storeUI.timeFrame.copyt;
    }
    if (!copyTradersOnly && !connectedOnly) {
      return storeUI.timeFrame.signalp;
    }
    return 90;
  };

  const [timeFrame, setTimeFrame] = useState(initTimeFrame());

  // Get Coins list unless connected providers only which don't need filters
  const quoteAssets = useQuoteAssets(!connectedOnly);
  const coins = [
    {
      val: "ALL",
      label: intl.formatMessage({ id: "fil.allcoins" }),
    },
  ].concat(
    Object.keys(quoteAssets).map((label) => ({
      val: label,
      label,
    })),
  );
  const [coin, setCoin] = useState(coins[0]);

  // Exchanges
  const exchanges = useExchangesOptions(true);
  const [exchange, setExchange] = useState("ALL");

  const exchangeTypes = [
    {
      val: "ALL",
      label: intl.formatMessage({ id: "fil.allexchangeTypes" }),
    },
    { val: "spot", label: "Spot" },
    { val: "futures", label: "Futures" },
  ];
  const [exchangeType, setExchangeType] = useState("ALL");

  const initSort = () => {
    let val;
    if (!connectedOnly) {
      val = copyTradersOnly ? storeUI.sort.copyt : storeUI.sort.signalp;
    }
    return val || "RETURNS_DESC";
  };
  const [sort, setSort] = useState(initSort);

  const clearFilters = () => {
    setCoin(coins[0]);
    setExchange("ALL");
    setExchangeType("ALL");
  };

  const clearSort = () => {
    setSort("RETURNS_DESC");
  };

  const saveTimeFrame = () => {
    if (copyTradersOnly && connectedOnly) {
      dispatch(setConnectedCopytTimeframe(timeFrame));
    }
    if (!copyTradersOnly && connectedOnly) {
      dispatch(setConnectedSignalTimeframe(timeFrame));
    }
    if (copyTradersOnly && !connectedOnly) {
      dispatch(setCopytTimeframe(timeFrame));
    }
    if (!copyTradersOnly && !connectedOnly) {
      dispatch(setSignalpTimeframe(timeFrame));
    }
  };

  useEffect(saveTimeFrame, [timeFrame]);

  /**
   * Sort providers by selected option
   *
   * @param {ProvidersCollection} list Providers collection.
   * @returns {void}
   */
  const sortProviders = (list) => {
    console.log(sort);
    const [key, direction] = sort.split("_");
    const listSorted = [...list].sort((a, b) => {
      let res = 0;
      switch (key) {
        case "RETURNS":
          res = a.returns + a.floating - (b.returns + b.floating);
          console.log(a.returns, b.returns);
          break;
        case "DATE":
          res = a.createdAt - b.createdAt;
          break;
        case "NAME":
          res = a.name.localeCompare(b.name);
          break;
        case "FEE":
          res = a.price - b.price;
          break;
        default:
          break;
      }
      return direction === "ASC" ? res : -res;
    });

    setProviders((s) => ({ ...s, filteredList: listSorted }));
  };
  const saveSort = () => {
    if (!connectedOnly) {
      if (copyTradersOnly) {
        dispatch(setCopytSort(sort));
      } else {
        dispatch(setSignalpSort(sort));
      }
    }
  };

  // Sort providers on sort option change
  useEffect(() => {
    if (providers.filteredList) {
      sortProviders(providers.filteredList);
    }
    saveSort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sort]);

  /**
   * Filter providers by selected options
   *
   * @param {ProvidersCollection} list Providers collection.
   * @returns {void}
   */
  const filterProviders = (list) => {
    const res = list.filter(
      (p) =>
        (coin.val === "ALL" || p.quote === coin.val) &&
        (exchange === "ALL" || p.exchanges.includes(exchange.toLowerCase())) &&
        (exchangeType === "ALL" || p.exchangeType.toLowerCase() === exchangeType.toLowerCase()),
    );
    sortProviders(res);
  };
  // Filter providers on filter change
  useEffect(() => {
    if (providers.list) {
      filterProviders(providers.list);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coin, exchange, exchangeType]);

  const loadProviders = () => {
    /**
     * @type {ProvidersPayload}
     */
    const payload = {
      token: storeSession.tradeApi.accessToken,
      type: connectedOnly ? "connected" : "all",
      ro: true,
      copyTradersOnly,
      timeFrame,
      internalExchangeId,
    };

    tradeApi
      .providersGet(payload)
      .then((responseData) => {
        const uniqueProviders = uniqBy(responseData, "id");
        setProviders((s) => ({ ...s, list: uniqueProviders }));
        filterProviders(uniqueProviders);
      })
      .catch((e) => {
        dispatch(showErrorAlert(e));
      });
  };
  // Load providers at init and on timeframe change.
  useEffect(loadProviders, [
    timeFrame,
    connectedOnly,
    copyTradersOnly,
    storeSession.tradeApi.accessToken,
    internalExchangeId,
  ]);

  return {
    providers: providers.filteredList,
    timeFrame,
    setTimeFrame,
    coin,
    coins,
    setCoin,
    exchange,
    exchanges,
    setExchange,
    exchangeType,
    setExchangeType,
    exchangeTypes,
    sort,
    setSort,
    clearFilters,
    clearSort,
  };
};

export default useProvidersList;

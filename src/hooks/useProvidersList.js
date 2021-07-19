import { useState, useEffect } from "react";
import tradeApi from "../services/tradeApiClient";
import useStoreSettingsSelector from "hooks/useStoreSettingsSelector";
import useSelectedExchange from "hooks/useSelectedExchange";
import useExchangesOptions from "./useExchangesOptions";
import useEffectSkipFirst from "./useEffectSkipFirst";
import { useIntl } from "react-intl";
import {
  setSort as setSortAction,
  setTimeFrame as setTimeFrameAction,
} from "../store/actions/settings";
import { showErrorAlert } from "../store/actions/ui";
import { useDispatch } from "react-redux";
import useFilters from "./useFilters";
import { forceCheck } from "react-lazyload";
import useExchangeQuotes from "./useExchangeQuotes";
import useConnectedProvidersList from "./useConnectedProvidersList";

/**
 * @typedef {import("../store/initialState").DefaultState} DefaultStateType
 * @typedef {import("../store/initialState").DefaultStateSession} StateSessionType
 * @typedef {import("../store/initialState").Filters} Filters
 * @typedef {import("../store/actions/settings").ProviderPageType} ProviderPageType
 * @typedef {import("../store/actions/settings").ConnectedProviderPageType} ConnectedProviderPageType
 * @typedef {import("../services/tradeApiClient.types").ProvidersCollection} ProvidersCollection
 * @typedef {import("../services/tradeApiClient.types").ProviderEntity} ProviderEntity
 * @typedef {import("../services/tradeApiClient.types").ProvidersPayload} ProvidersPayload
 * @typedef {import("../services/tradeApiClient.types").NewAPIProvidersPayload} NewAPIProvidersPayload
 * @typedef {import("../components/CustomSelect/CustomSelect").OptionType} OptionType
 * @typedef {import("./useFilters").FiltersData} FiltersData
 */

/**
 * @typedef {ProviderPageType|ConnectedProviderPageType} PageType
 */

/**
 * @typedef {Object} ProvidersOptions
 * @property {NewAPIProvidersPayload["type"]} type
 * @property {boolean} connectedOnly
 * @property {boolean} myServices
 */

/**
 * @typedef {Object} ProvidersData
 * @property {ProvidersCollection} providers
 * @property {number} timeFrame
 * @property {function} setTimeFrame
 * @property {Array<OptionType>} quotes
 * @property {Array<OptionType>} exchanges
 * @property {Array<OptionType>} exchangeTypes
 * @property {string} sort
 * @property {function} setSort
 * @property {function} clearFilters
 * @property {function} clearSort
 * @property {function} setFilters
 * @property {Filters[ProviderPageType]|{}} filters
 * @property {number} modifiedFilters
 */

/**
 * Hook to generate the providers data fetching and filtering.
 *
 * @param {ProvidersOptions} options Hook options.
 * @param {Number} updatedAt last updated time.
 * @returns {ProvidersData} Providers and filtering objects.
 */
const useProvidersList = (options, updatedAt = null) => {
  const intl = useIntl();
  const selectedExchange = useSelectedExchange();
  const storeSettings = useStoreSettingsSelector();
  const internalExchangeId = selectedExchange.internalId;
  const dispatch = useDispatch();
  const { type, connectedOnly, myServices } = options;
  const copyTraders = type === "copy_trading";
  const profitSharing = type === "profit_sharing";
  const CTorPS = copyTraders || profitSharing;
  const [providerQuotes, setProviderQuotes] = useState([]);

  /**
   * @type {{list: ProvidersCollection, filteredList: ProvidersCollection}} initialState
   */
  const initialState = { list: null, filteredList: null };
  const [providers, setProviders] = useState(initialState);
  const { providers: connectedProviders } = useConnectedProvidersList(
    "",
    [copyTraders ? "copyTrading" : profitSharing ? "profitSharing" : "signalProvider"],
    true,
  );

  /**
   * @type {PageType} Page shorthand
   */
  let page;
  if (connectedOnly) {
    page = copyTraders ? "connectedCopyt" : profitSharing ? "connectedProfit" : "connectedSignalp";
  } else {
    page = copyTraders ? "copyt" : profitSharing ? "profit" : "signalp";
  }

  // @ts-ignore
  const storeFilters = storeSettings.filters[page] || {};

  // Get quotes list unless connected providers only which don't need filters
  const { quoteAssets } = useExchangeQuotes(
    {
      exchangeId: selectedExchange.exchangeId,
      exchangeType: selectedExchange.exchangeType,
    },
    !CTorPS && !connectedOnly,
  );

  const quotes = [
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

  /**
   *
   * @param {ProvidersCollection} list providers collection
   * @returns {Array<OptionType>} quotes filter options
   */
  const prepareProviderQuotes = (list) => {
    let quoteList = list.map((provider) => provider.quote);
    quoteList = [...new Set(quoteList)];

    return [
      {
        val: "ALL",
        label: intl.formatMessage({ id: "fil.allcoins" }),
      },
    ].concat(
      quoteList.map((item) => ({
        val: item,
        label: item,
      })),
    );
  };

  const exchanges = useExchangesOptions(true);

  const exchangeTypes = [
    {
      val: "ALL",
      label: intl.formatMessage({
        id: "fil.allexchangeTypes",
      }),
    },
    { val: "spot", label: "Spot" },
    { val: "futures", label: "Futures" },
  ];

  const optionsFilters = {
    exchange: exchanges,
    exchangeType: exchangeTypes,
    // wait until the options have been retreived before using them for comparison
    ...(quotes.length > 1 && { quote: quotes }),
  };

  const defaultFilters = {
    ...(!connectedOnly && {
      ...((copyTraders || profitSharing) && {
        quote: "ALL",
        exchange: "ALL",
        exchangeType: "ALL",
      }),
      profitSharing: false,
    }),
  };

  const filtersData = useFilters(defaultFilters, storeFilters, optionsFilters, page);
  const { setFilters, clearFilters, modifiedFilters } = filtersData;
  /**
   * @type {typeof defaultFilters}
   */
  // @ts-ignore
  const filters = filtersData.filters;

  const defaultSort = copyTraders || profitSharing ? "RETURNS_DESC" : "NEWFOLLOWERS_DESC";

  // Sort
  const initSort = () => {
    let val;
    if (!connectedOnly) {
      val = copyTraders || profitSharing ? storeSettings.sort.copyt : storeSettings.sort.signalp;
    }
    return val || defaultSort;
  };
  const [sort, setSort] = useState(initSort);

  const clearSort = () => {
    setSort(defaultSort);
  };

  // TimeFrame
  const defaultTimeFrame = copyTraders || profitSharing ? 90 : 7;
  const initTimeFrame =
    ((copyTraders || profitSharing) && storeSettings.timeFrame[page]) || defaultTimeFrame;
  const [timeFrame, setTimeFrame] = useState(initTimeFrame);

  // Save timeFrame to store once changed
  const saveTimeFrame = () => {
    dispatch(setTimeFrameAction({ timeFrame, page }));
  };
  useEffectSkipFirst(saveTimeFrame, [timeFrame]);

  /**
   * Sort providers by selected option
   *
   * @param {ProvidersCollection} list Providers collection.
   * @returns {void}
   */
  const sortProviders = (list) => {
    const [key, direction] = sort.split("_");
    const listSorted = [...list].sort((a, b) => {
      let res = 0;
      switch (key) {
        case "RETURNS":
          res = a.globalReturn - b.globalReturn;
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
        case "SIGNALS":
          res = a.totalSignals - b.totalSignals;
          break;
        case "FOLLOWERS":
          res = a.followers - b.followers;
          break;
        case "NEWFOLLOWERS":
          res = a.newFollowers - b.newFollowers;
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
      // @ts-ignore
      dispatch(setSortAction({ sort, page }));
    }
  };

  // Sort providers on sort option change
  useEffectSkipFirst(() => {
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
    if (!myServices) {
      const matches = list.filter(
        (p) =>
          (!filters.quote || filters.quote === "ALL" || p.quote === filters.quote) &&
          (!filters.exchange ||
            filters.exchange === "ALL" ||
            p.exchanges.includes(filters.exchange.toLowerCase())) &&
          (!filters.exchangeType ||
            filters.exchangeType === "ALL" ||
            p.exchangeType.toLowerCase() === filters.exchangeType.toLowerCase()),
      );
      sortProviders(matches);
    } else {
      sortProviders(list);
    }
  };

  // Filter providers on filter change
  useEffect(() => {
    if (providers.list) {
      filterProviders(providers.list);
      // Triger lazyloading check
      setTimeout(() => {
        forceCheck();
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const loadProviders = () => {
    /**
     * @type {NewAPIProvidersPayload}
     */
    const payload = {
      type,
      timeFrame,
      ...(connectedOnly && { internalExchangeId: internalExchangeId }),
    };

    const method = myServices
      ? tradeApi.providersOwnedGet(payload)
      : tradeApi.providersGetNew(payload);

    method
      .then((responseData) => {
        if (CTorPS) {
          setProviderQuotes(prepareProviderQuotes(responseData));
        }
        setProviders((s) => ({
          ...s,
          list: responseData,
        }));
        filterProviders(responseData);
      })
      .catch((e) => {
        dispatch(showErrorAlert(e));
      });
  };
  // Load providers at init, on timeframe/exchange account change
  useEffect(loadProviders, [timeFrame, internalExchangeId, updatedAt]);

  /**
   * Combine user providers data with provider list
   * @param {ProvidersCollection} list Providers list
   * @returns {ProvidersCollection} Providers list
   */
  const augmentProviders = (list) => {
    if (!list || !connectedProviders) return null;

    return list.map((provider) => {
      const connectedProvider = connectedProviders.find((item) => item.id === provider.id);
      if (connectedProvider) {
        return {
          ...provider,
          disable: !connectedProvider.connected,
          exchangeInternalId: connectedProvider.exchangeInternalId,
          exchangeInternalIds: connectedProvider.exchangeInternalIds,
        };
      }
      return provider;
    });
  };

  return {
    providers: augmentProviders(providers.filteredList),
    timeFrame,
    setTimeFrame,
    quotes: CTorPS ? providerQuotes : quotes,
    exchangeTypes,
    filters,
    setFilters,
    sort,
    setSort,
    clearFilters,
    clearSort,
    modifiedFilters,
    exchanges,
  };
};

export default useProvidersList;

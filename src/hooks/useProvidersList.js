import { useState, useEffect, useCallback } from "react";
import tradeApi from "../services/tradeApiClient";
import useStoreSessionSelector from "./useStoreSessionSelector";
import useStoreSettingsSelector from "./useStoreSettingsSelector";

/**
 * @typedef {import("../store/initialState").DefaultState} DefaultStateType
 * @typedef {import("../store/initialState").DefaultStateSession} StateSessionType
 * @typedef {import("../services/tradeApiClient.types").ProvidersCollection} ProvidersCollection
 * @typedef {import("../services/tradeApiClient.types").ProviderEntity} ProviderEntity
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
 * @property {string} coin
 * @property {function} setCoin
 * @property {string} exchange
 * @property {function} setExchange
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
  const storeSettings = useStoreSettingsSelector();
  const internalExchangeId = storeSettings.selectedExchange.internalId;
  const storeSession = useStoreSessionSelector();
  const { copyTradersOnly, connectedOnly } = options;

  /**
   * @type {ProvidersCollection} initialState
   */
  const initialState = [];
  const [providers, setProviders] = useState(initialState);
  const [providersFiltered, setProvidersFiltered] = useState(initialState);
  const [timeFrame, setTimeFrame] = useState(90);
  const [coin, setCoin] = useState("");
  const [exchange, setExchange] = useState("");
  const [sort, setSort] = useState("RETURNS_DESC");

  const clearFilters = () => {
    setCoin("");
    setExchange("");
  };

  const clearSort = () => {
    setSort("");
  };

  /**
   * Sort providers by select option
   *
   * @param {ProvidersCollection} _providersFiltered Current providers collection.
   * @returns {void}
   */
  const sortProviders = (_providersFiltered) => {
    let providersSorted = _providersFiltered;
    if (sort) {
      const [key, direction] = sort.split("_");
      providersSorted = _providersFiltered.concat().sort((a, b) => {
        let res = 0;
        switch (key) {
          case "RETURNS":
            res = a.returns - b.returns;
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
    }
    setProvidersFiltered(providersSorted);
  };

  // Update providers sorting on sort change
  useEffect(() => {
    sortProviders(providersFiltered);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sort]);

  const filterProviders = useCallback(() => {
    const _providersFiltered = providers.filter(
      (p) =>
        (!coin || p.quote === coin) && (!exchange || p.exchanges.includes(exchange.toLowerCase())),
    );
    sortProviders(_providersFiltered);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coin, exchange, providers]);

  // Filter providers when providers loaded or filters changed
  useEffect(() => {
    filterProviders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterProviders]);

  // Load providers at init and on timeframe change.
  useEffect(() => {
    const loadProviders = async () => {
      const payload = {
        token: storeSession.tradeApi.accessToken,
        type: connectedOnly ? "connected" : "all",
        ro: true,
        copyTradersOnly,
        timeFrame,
        internalExchangeId,
      };

      try {
        const responseData = await tradeApi.providersGet(payload);
        setProviders(responseData);
      } catch (e) {
        setProviders([]);
      }
    };
    loadProviders();
  }, [
    timeFrame,
    connectedOnly,
    copyTradersOnly,
    storeSession.tradeApi.accessToken,
    internalExchangeId,
  ]);

  return {
    providers: providersFiltered,
    timeFrame,
    setTimeFrame,
    coin,
    setCoin,
    exchange,
    setExchange,
    sort,
    setSort,
    clearFilters,
    clearSort,
  };
};

export default useProvidersList;

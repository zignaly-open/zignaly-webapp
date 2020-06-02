import React, { useState, useEffect, useCallback } from "react";
import ProvidersFilters from "../components/Providers/ProvidersFilters";
import ProvidersSort from "../components/Providers/ProvidersSort";
import ProvidersList from "../components/Providers/ProvidersList";
import TimeFrameSelectRow from "../components/Providers/TimeFrameSelectRow";
import tradeApi from "../services/tradeApiClient";
import { useSelector } from "react-redux";

/**
 * @typedef {import("../store/initialState").DefaultState} DefaultStateType
 * @typedef {import("../store/initialState").DefaultStateSession} StateSessionType
 * @typedef {import("../services/tradeApiClient.types").ProvidersCollection} ProvidersCollection
 * @typedef {import("../services/tradeApiClient.types").ProviderEntity} ProviderEntity
 */

/**
 * @typedef {Object} ProvidersComponents
 * @property {function} ProvidersList
 * @property {function} ProvidersFilters
 * @property {function} ProvidersSort
 * @property {function} TimeFrameSelectRow
 */

/**
 * @typedef {Object} ProvidersOptions
 * @property {boolean} copyTradersOnly
 * @property {boolean} connectedOnly
 * @property {boolean} showSummary
 */

/**
 * @typedef {Object} ProvidersCallbacks
 * @property {React.MouseEventHandler} [toggleFilters]
 * @property {React.MouseEventHandler} [toggleSort]
 */

/**
 * Hook to generate the providers components including list, filters, and sort.
 *
 * @param {ProvidersOptions} options Hook options.
 * @param {ProvidersCallbacks} callbacks Hook callbacks.
 * @returns {[ProvidersCollection, ProvidersComponents]} Array with providers data and components.
 */
const useProvidersList = (options, callbacks) => {
  /**
   * Select store session data.
   *
   * @param {DefaultStateType} state Application store data.
   * @returns {StateSessionType} Store session data.
   */
  const selectStoreSession = (state) => state.session;
  const storeSession = useSelector(selectStoreSession);
  const { copyTradersOnly, connectedOnly, showSummary } = options;
  const { toggleFilters, toggleSort } = callbacks;

  /**
   * @type {ProvidersCollection} initialState
   */
  const initialState = [];
  const [providers, setProviders] = useState(initialState);
  const [providersFiltered, setProvidersFiltered] = useState(initialState);
  const [timeFrame, setTimeFrame] = useState(90);
  const [coin, setCoin] = useState("");
  const [exchange, setExchange] = useState("");
  const [sort, setSort] = useState("");

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
            res = a.returns < b.returns ? 1 : -1;
            break;
          case "DATE":
            res = a.createdAt < b.createdAt ? 1 : -1;
            break;
          case "NAME":
            res = a.name.localeCompare(b.name);
            break;
          case "FEE":
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
        (!coin || p.coin === coin) && (!exchange || p.exchanges.includes(exchange.toLowerCase())),
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
      };

      try {
        const responseData = await tradeApi.providersGet(payload);
        setProviders(responseData);
      } catch (e) {
        setProviders([]);
      }
    };
    loadProviders();
  }, [timeFrame, connectedOnly, copyTradersOnly, storeSession.tradeApi.accessToken]);

  const ProvidersListMaker = () => (
    <ProvidersList providers={providersFiltered} showSummary={showSummary} />
  );

  const ProvidersFiltersMaker = () => (
    <ProvidersFilters
      clearFilters={clearFilters}
      coin={coin}
      exchange={exchange}
      onClose={toggleFilters}
      onCoinChange={setCoin}
      onExchangeChange={setExchange}
    />
  );

  const ProvidersSortMaker = () => (
    <ProvidersSort clearFilters={clearSort} onChange={setSort} onClose={toggleSort} sort={sort} />
  );

  const TimeFrameSelectRowMaker = ({ title }) => (
    <TimeFrameSelectRow title={title} onChange={setTimeFrame} value={timeFrame} />
  );

  const components = {
    ProvidersList: ProvidersListMaker,
    ProvidersFilters: ProvidersFiltersMaker,
    ProvidersSort: ProvidersSortMaker,
    TimeFrameSelectRow: TimeFrameSelectRowMaker,
  };

  return [providersFiltered, components];
};

export default useProvidersList;

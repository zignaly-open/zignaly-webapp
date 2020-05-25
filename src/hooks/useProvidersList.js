import React, { useState, useEffect, useCallback } from "react";
import ProvidersFilters from "../components/Providers/ProvidersFilters";
import ProvidersSort from "../components/Providers/ProvidersSort";
import ProvidersList from "../components/Providers/ProvidersList";
import TimeFrameSelect from "../components/TimeFrameSelect";
import tradeApi from "../services/tradeApiClient";

/**
 * @typedef {import("../services/tradeApiClient.types").ProvidersCollection} ProvidersCollection
 * @typedef {import("../services/tradeApiClient.types").ProviderEntity} ProviderEntity
 */

/**
 * @typedef {Object} ProvidersComponents
 * @property {function} ProvidersList
 * @property {function} ProvidersFilters
 * @property {function} ProvidersSort
 * @property {function} TimeFrameSelect
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
      const [key, direction] = sort.split("-");
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

  const authenticateUser = async () => {
    const loginPayload = {
      email: "me@brbordallo.com",
      //   email: "mailhjmhtitjyc@example.test",
      //   password: "abracadabra",
      password: "09876aaA!",
    };

    return await tradeApi.userLogin(loginPayload);
  };

  // Load providers at init and on timeframe change.
  useEffect(() => {
    const loadProviders = async () => {
      const userEntity = await authenticateUser();
      const sessionPayload = {
        token: userEntity.token,
        type: connectedOnly ? "connected" : "all",
        // ro: true,
        copyTradersOnly,
        timeFrame,
      };

      try {
        const responseData = await tradeApi.providersGet(sessionPayload);
        setProviders(responseData);
      } catch (e) {
        setProviders([]);
      }
    };
    loadProviders();
  }, [timeFrame, connectedOnly, copyTradersOnly]);

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

  const TimeFrameSelectMaker = () => <TimeFrameSelect onChange={setTimeFrame} value={timeFrame} />;

  const components = {
    ProvidersList: ProvidersListMaker,
    ProvidersFilters: ProvidersFiltersMaker,
    ProvidersSort: ProvidersSortMaker,
    TimeFrameSelect: TimeFrameSelectMaker,
  };

  return [providersFiltered, components];
};

export default useProvidersList;

import React, { useState, useEffect, useCallback, useRef } from "react";
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
 * @property {function} [toggleFilters]
 * @property {function} [toggleSort]
 */

/**
 * Hook to generate the providers components including list, filters, and sort.
 *
 * @param {ProvidersOptions} options
 * @param {ProvidersCallbacks} callbacks
 * @returns {[ProvidersCollection, ProvidersComponents]}
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
   * @param {ProvidersCollection} _providersFiltered
   */
  const sortProviders = (_providersFiltered) => {
    let providersSorted = _providersFiltered;
    if (sort) {
      const [key, direction] = sort.split("-");
      providersSorted = _providersFiltered.concat().sort((a, b) => {
        let res = 0;
        switch (key) {
          case "returns":
          case "createdAt":
            res = a[key] < b[key] ? 1 : -1;
            break;
          case "name":
            res = a.name.localeCompare(b.name);
            break;
          case "fee":
            break;
          default:
            break;
        }
        return direction === "asc" ? res : -res;
      });
    }
    setProvidersFiltered(providersSorted);
  };

  // Update providers sorting on sort change
  useEffect(() => {
    sortProviders(providersFiltered);
  }, [sort]);

  // useCallback since it's a dependency of loadProviders()
  const filterProviders = useCallback(
    (_providers) => {
      const _providersFiltered = providers.filter(
        (p) =>
          (!coin || p.coin === coin) && (!exchange || p.exchanges.includes(exchange.toLowerCase())),
      );
      sortProviders(_providersFiltered);
    },
    [coin, exchange, providers],
  );

  //   Filter providers when providers loaded or filters changed
  useEffect(() => {
    filterProviders();
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
    <ProvidersSort onChange={setSort} onClose={toggleSort} sort={sort} clearFilters={clearSort} />
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

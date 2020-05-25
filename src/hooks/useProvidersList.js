import React, { useState, useEffect } from "react";
import ProvidersFilters from "../components/Providers/ProvidersFilters";
import ProvidersSort from "../components/Providers/ProvidersSort";
import ProvidersList from "../components/Providers/ProvidersList";
import TimeFrameSelect from "../components/TimeFrameSelect";
import tradeApi from "../services/tradeApiClient";

const useProvidersList = (
  copyTradersOnly,
  connectedOnly,
  showSummary,
  toggleFilters,
  toggleSort,
) => {
  /**
   * @typedef {import("../../../services/tradeApiClient.types").ProvidersCollection} ProvidersCollection
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

  // Memoized callback to satisfy exhaustive-deps
  //   const triggerChange = useCallback((...args) => {
  //     onChange(...args);
  //   }, []);

  //   useEffect(() => {
  //     triggerChange(coin, exchange);
  //   }, [coin, exchange, triggerChange]);

  const filterProviders = () => {
    const _providersFiltered = providers.filter(
      (p) =>
        (!coin || p.coin === coin) && (!exchange || p.exchanges.includes(exchange.toLowerCase())),
    );
    sortProviders(_providersFiltered);
  };

  const sortProviders = (_providersFiltered) => {
    const providersSorted = _providersFiltered.sort((a, b) => {
      return a.returns < b.returns;
    });
    setProvidersFiltered(providersSorted);
  };

  const authenticateUser = async () => {
    const loginPayload = {
      email: "mailhjmhtitjyc@example.test",
      password: "abracadabra",
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
  }, [timeFrame]);

  // Filter providers when providers loaded or filters changed
  useEffect(() => {
    filterProviders();
  }, [providers, coin, exchange]);

  // Update providers sorting on sort change
  useEffect(() => {
    sortProviders(providersFiltered);
  }, [sort]);

  const ProvidersListMaker = () => (
    <ProvidersList providers={providersFiltered} showSummary={showSummary} />
  );

  const ProvidersFiltersMaker = () => (
    <ProvidersFilters
      onClose={toggleFilters}
      onCoinChange={setCoin}
      onExchangeChange={setExchange}
      coin={coin}
      exchange={exchange}
      clearFilters={clearFilters}
    />
  );

  const ProvidersSortMaker = () => (
    <ProvidersSort onClose={toggleSort} sort={sort} onChange={setSort} />
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

import React, { useState, useEffect, useCallback, useRef } from "react";
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
  //   const [providers, setProviders] = useState(initialState);
  const [providersFiltered, setProvidersFiltered] = useState(initialState);
  const [timeFrame, setTimeFrame] = useState(90);
  const [coin, setCoin] = useState("");
  const [exchange, setExchange] = useState("");
  const [sort, setSort] = useState("");
  const providers = useRef();

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

  console.log("aaa");
  const filterProviders = useCallback((_providers) => {
    console.log("filterProviders");
    //    const filterProviders = (_providers) => {
    const _providersFiltered = _providers.filter(
      (p) =>
        (!coin || p.coin === coin) && (!exchange || p.exchanges.includes(exchange.toLowerCase())),
    );
    sortProviders(_providersFiltered);
    //    };
  }, []);

  //   const sortProviders = useCallback(() => {
  const sortProviders = (_providersFiltered) => {
    if (sort) {
      const [key, direction] = sort.split("-");
      _providersFiltered.sort((a, b) => {
        let res;
        switch (typeof a[key]) {
          case "number":
            res = a[key] < b[key];
            break;
          case "string":
            res = a[key].localeCompare(b[key]);
            break;
          default:
            break;
        }
        return direction === "asc" ? res : -res;
      });
    }
    setProvidersFiltered(_providersFiltered);
    //   }, []);
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
        // setProviders(responseData);
        providers.current = responseData;
      } catch (e) {
        // setProviders([]);
        providers.current = [];
      }
      filterProviders(providers.current);
    };
    loadProviders();
  }, [timeFrame, connectedOnly, copyTradersOnly, filterProviders]);

  //   Filter providers when providers loaded or filters changed
  //   useEffect(() => {
  //     const filterProviders = () => {
  //       const _providersFiltered = providers.current.filter(
  //         (p) =>
  //           (!coin || p.coin === coin) && (!exchange || p.exchanges.includes(exchange.toLowerCase())),
  //       );
  //       sortProviders();
  //     };
  //     console.log("filterProviders", providers);

  //     if (providers.current) {
  //       filterProviders();
  //     }
  //   }, [providers]);

  //   // Update providers sorting on sort change
  //   useEffect(() => {
  //     sortProviders();
  //   }, [sort, sortProviders, providersFiltered]);

  //   const handleTimeFrameChange = (timeFrame) => {
  //     setTimeFrame(timeFrame);
  //   };

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
    <ProvidersSort onChange={setSort} onClose={toggleSort} sort={sort} />
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

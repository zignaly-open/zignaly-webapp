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
  const [providers, setProviders] = useState(initialState);
  const initialState2 = [];

  const [providersFiltered, setProvidersFiltered] = useState(initialState2);
  const [timeFrame, setTimeFrame] = useState(90);
  const [coin, setCoin] = useState("");
  const [exchange, setExchange] = useState("");
  const [sort, setSort] = useState("");
  //   const providers = useRef();

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

  const sortProviders = useCallback(
    (_providersFiltered) => {
      //   const sortProviders = (_providersFiltered) => {
      let providersSorted = _providersFiltered;
      if (sort) {
        const [key, direction] = sort.split("-");
        providersSorted = _providersFiltered.concat().sort((a, b) => {
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
      setProvidersFiltered(providersSorted);
    },
    [sort],
  );
  //   };

  // useCallback since it's a dependency of loadProviders()
  const filterProviders = useCallback(
    (_providers) => {
      //   console.log("filterProviders", providers);
      //  const filterProviders = (_providers) => {
      const _providersFiltered = providers.filter(
        (p) =>
          (!coin || p.coin === coin) && (!exchange || p.exchanges.includes(exchange.toLowerCase())),
      );
      sortProviders(_providersFiltered);
      //  };
    },
    [sortProviders, coin, exchange, providers],
  );

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
        // setProviders(responseData);
        // providers.current = responseData;
        setProviders(responseData);
      } catch (e) {
        // setProviders([]);
        // providers.current = [];
        setProviders([]);
      }
      //   filterProviders(providers.current);
    };
    console.log("loadProviders");
    loadProviders();
  }, [timeFrame, connectedOnly, copyTradersOnly]);

  //   Filter providers when providers loaded or filters changed
  useEffect(() => {
    // const filterProviders = () => {
    //   const _providersFiltered = providers.current.filter(
    //     (p) =>
    //       (!coin || p.coin === coin) && (!exchange || p.exchanges.includes(exchange.toLowerCase())),
    //   );
    //   sortProviders();
    // };
    console.log("filterProviders useEffect", providers);

    // if (providers.current) {
    filterProviders();
    // }
  }, [filterProviders]);

  // Update providers sorting on sort change
  useEffect(() => {
    sortProviders(providersFiltered);
  }, [sort, sortProviders, providersFiltered]);

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

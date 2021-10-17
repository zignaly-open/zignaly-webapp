import { useEffect, useState } from "react";

/**
 * @typedef {import("../context/PrivateAreaContext").PrivateAreaContextObject} PrivateAreaContextObject
 * @typedef {import('../services/tradeApiClient.types').HasBeenUsedProviderEntity} HasBeenUsedProviderEntity
 */

/**
 * Handle un-persisted state management for the different parts of app using React context.
 *
 * @returns {PrivateAreaContextObject} App context object.
 */
const usePrivateAreaContext = () => {
  const [userProviders, setUserProviders] = useState(
    /** @type {Array<HasBeenUsedProviderEntity>} */ (null),
  );
  const connectedProviders = userProviders ? userProviders.filter((p) => p.connected) : null;
  const [balance, setBalance] = useState(null);
  const [quotesMap, setQuotesMapData] = useState({});
  const [exchangeList, setExchangeList] = useState([]);

  return {
    quotesMap,
    setQuotesMapData,
    exchangeList,
    setExchangeList,
    setBalance,
    balance,
    userProviders: userProviders,
    setUserProviders,
    connectedProviders,
  };
};

export default usePrivateAreaContext;

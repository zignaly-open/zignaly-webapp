import { useState } from "react";

/**
 * @typedef {import("../context/PrivateAreaContext").PrivateAreaContextObject} PrivateAreaContextObject
 */

/**
 * Handle un-persisted state management for the different parts of app using React context.
 *
 * @returns {PrivateAreaContextObject} App context object.
 */
const usePrivateAreaContext = () => {
  const [providerCount, setProviderCount] = useState(0);
  const [profitSharingCount, setProfitSharingCount] = useState(0);
  const [balance, setBalance] = useState(null);
  const [quotesMap, setQuotesMapData] = useState({});
  const [exchangeList, setExchangeList] = useState([]);

  return {
    providerCount,
    setProviderCount,
    profitSharingCount,
    setProfitSharingCount,
    quotesMap,
    setQuotesMapData,
    exchangeList,
    setExchangeList,
    setBalance,
    balance,
  };
};

export default usePrivateAreaContext;

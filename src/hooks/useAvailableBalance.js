import { useState, useEffect } from "react";
import useStoreSessionSelector from "./useStoreSessionSelector";
import tradeApi from "../services/tradeApiClient";

/**
 * @typedef {Object} HookData
 * @property {*} balance
 * @property {Boolean} loading
 */

/**
 * Provides balance summary for exchange.
 *
 * @param {string} internalId Internal exchange id.
 * @returns {HookData} Balance.
 */
const useAvailableBalance = (internalId) => {
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(false);

  const storeSession = useStoreSessionSelector();

  const loadData = () => {
    setLoading(true);
    const payload = {
      token: storeSession.tradeApi.accessToken,
      exchangeInternalId: internalId,
    };

    tradeApi
      .userAvailableBalanceGetGet(payload)
      .then((data) => {
        setBalance(data);
      })
      .catch(() => {})
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(loadData, [internalId, storeSession.tradeApi.accessToken]);

  return { balance, loading };
};

export default useAvailableBalance;

import { useState, useEffect } from "react";
import useStoreSessionSelector from "./useStoreSessionSelector";
import tradeApi from "../services/tradeApiClient";

/**
 * @typedef {import("../services/tradeApiClient.types").DefaultDailyBalanceEntity} DefaultDailyBalanceEntity
 */

/**
 * Provides historical equity data.
 *
 * @param {string} internalId Internal Exchange id.
 * @returns {DefaultDailyBalanceEntity} Daily balance.
 */
const useEquity = (internalId) => {
  const [equity, setEquity] = useState({
    balances: [],
    quotes: [],
    loading: false,
  });

  const storeSession = useStoreSessionSelector();

  useEffect(() => {
    const loadData = () => {
      const payload = {
        token: storeSession.tradeApi.accessToken,
        exchangeInternalId: internalId,
      };

      tradeApi
        .userEquityGet(payload)
        .then((data) => {
          setEquity(data);
        })
        .catch((e) => {
          alert(`ERROR: ${e.message}`);
        });
    };
    loadData();
  }, [internalId, storeSession.tradeApi.accessToken]);

  return equity;
};

export default useEquity;

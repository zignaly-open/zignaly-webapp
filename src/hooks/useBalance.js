import { useState, useEffect } from "react";
import useStoreSessionSelector from "./useStoreSessionSelector";
import tradeApi from "../services/tradeApiClient";
import { createEmptyUserBalanceEntity } from "../services/tradeApiClient.types";

/**
 * @typedef {import("../services/tradeApiClient.types").UserBalanceEntity} UserBalanceEntity
 */

/**
 * Provides balance summary for exchange.
 *
 * @param {string} internalId Internal exchange id.
 * @returns {UserBalanceEntity} Balance.
 */
const useBalance = (internalId) => {
  const [balance, setBalance] = useState(createEmptyUserBalanceEntity());

  const storeSession = useStoreSessionSelector();

  useEffect(() => {
    const loadData = () => {
      const payload = {
        token: storeSession.tradeApi.accessToken,
        exchangeInternalId: internalId,
      };

      tradeApi
        .userBalanceGet(payload)
        .then((data) => {
          setBalance(data);
        })
        .catch(() => {});
    };
    loadData();
  }, [internalId, storeSession.tradeApi.accessToken]);

  return balance;
};

export default useBalance;

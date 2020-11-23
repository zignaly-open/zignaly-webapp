import { useState, useEffect } from "react";
import useStoreSessionSelector from "./useStoreSessionSelector";
import tradeApi from "../services/tradeApiClient";
import { createEmptyUserBalanceEntity } from "../services/tradeApiClient.types";
import { useDispatch } from "react-redux";
import { showErrorAlert } from "store/actions/ui";

/**
 * @typedef {import("../services/tradeApiClient.types").UserBalanceEntity} UserBalanceEntity
 * @typedef {Object} BalanceHookData
 * @property {UserBalanceEntity} balance
 * @property {Boolean} balanceLoading
 */

/**
 * Provides balance summary for exchange.
 *
 * @param {string} internalId Internal exchange id.
 * @returns {BalanceHookData} Balance.
 */
const useBalance = (internalId) => {
  const [loading, setLoading] = useState(false);
  const [balance, setBalance] = useState(createEmptyUserBalanceEntity());
  const dispatch = useDispatch();

  const storeSession = useStoreSessionSelector();

  useEffect(() => {
    setLoading(true);
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
        .catch((e) => {
          dispatch(showErrorAlert(e));
        })
        .finally(() => {
          setLoading(false);
        });
    };
    loadData();
  }, [internalId, storeSession.tradeApi.accessToken]);

  return {
    balance: balance,
    balanceLoading: loading,
  };
};

export default useBalance;

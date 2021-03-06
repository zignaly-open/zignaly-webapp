import { useState, useEffect } from "react";
import tradeApi from "../services/tradeApiClient";
import { createEmptyUserBalanceEntity } from "../services/tradeApiClient.types";
import { useDispatch } from "react-redux";
import { showErrorAlert } from "store/actions/ui";

/**
 * @typedef {import("../services/tradeApiClient.types").UserBalanceEntity} UserBalanceEntity
 * @typedef {Object} BalanceHookData
 * @property {UserBalanceEntity} balance
 * @property {Boolean} balanceLoading
 * @property {Function} refreshBalance
 */

/**
 * Provides balance summary for exchange.
 *
 * @param {string} internalId Internal exchange id.
 * @returns {BalanceHookData} Balance.
 */
const useBalance = (internalId) => {
  const [loading, setLoading] = useState(false);
  const [updatedAt, setUpdatedAt] = useState(null);
  const [balance, setBalance] = useState(createEmptyUserBalanceEntity());
  const dispatch = useDispatch();

  const refreshBalance = () => {
    setUpdatedAt(new Date());
  };

  const loadData = () => {
    setLoading(true);

    const payload = {
      exchangeInternalId: internalId,
    };

    if (internalId) {
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
    }
  };

  useEffect(loadData, [internalId, updatedAt]);

  return {
    balance: balance,
    balanceLoading: loading,
    refreshBalance: refreshBalance,
  };
};

export default useBalance;

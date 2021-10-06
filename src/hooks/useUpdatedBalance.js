import { useState, useEffect } from "react";
import tradeApi from "../services/tradeApiClient";
import useInterval from "./useInterval";
import useSelectedExchange from "hooks/useSelectedExchange";
import { useDispatch } from "react-redux";
import { showErrorAlert, showBalanceLoader } from "../store/actions/ui";
import { createEmptyUserBalanceEntity } from "../services/tradeApiClient.types";

/**
 * @typedef {import("../services/tradeApiClient.types").UserBalanceEntity} UserBalanceEntity
 */

/**
 * Provides balance summary for exchange.
 *
 * @returns {UserBalanceEntity} Balance.
 */
const useUpdatedBalance = () => {
  const [balance, setBalance] = useState(createEmptyUserBalanceEntity());

  const selectedExchange = useSelectedExchange();
  // const storeBalanceLoader = useStoreUIBalanceLoader();
  const dispatch = useDispatch();

  const showLoader = () => {
    dispatch(showBalanceLoader(true));
    loadData();
  };

  useEffect(showLoader, [selectedExchange.internalId]);

  const loadData = () => {
    if (selectedExchange.internalId) {
      const payload = {
        exchangeInternalId: selectedExchange.internalId,
      };

      tradeApi
        .userBalanceGet(payload)
        .then((data) => {
          setBalance(data);
          // if (storeBalanceLoader) {
          dispatch(showBalanceLoader(false));
          // }
        })
        .catch((e) => {
          dispatch(showErrorAlert(e));
        });
    }
  };

  useInterval(loadData, 60000, true);

  return balance;
};

export default useUpdatedBalance;

import { useState, useEffect } from "react";
import useStoreSessionSelector from "./useStoreSessionSelector";
import tradeApi from "../services/tradeApiClient";
import { useDispatch } from "react-redux";
import { showErrorAlert } from "../store/actions/ui";

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
  const dispatch = useDispatch();

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
        dispatch(showErrorAlert(e));
      });
  };

  useEffect(loadData, [internalId, storeSession.tradeApi.accessToken]);

  return equity;
};

export default useEquity;

import { useState, useEffect } from "react";
import useStoreSessionSelector from "./useStoreSessionSelector";
import tradeApi from "../services/tradeApiClient";
import useStoreSettingsSelector from "./useStoreSettingsSelector";
import { useDispatch } from "react-redux";
import { showErrorAlert } from "../store/actions/ui";

/**
 * @typedef {Object} HookData
 * @property {*} balance
 * @property {Boolean} loading
 */

/**
 * Provides balance summary for exchange.
 *
 * @returns {HookData} Balance.
 */
const useAvailableBalance = () => {
  const [balance, setBalance] = useState({});
  const [loading, setLoading] = useState(false);
  const storeSettings = useStoreSettingsSelector();
  const storeSession = useStoreSessionSelector();
  const dispatch = useDispatch();

  const loadData = () => {
    // Skip balance fetch for paper trading exchanges.
    if (
      storeSession.tradeApi.accessToken &&
      storeSettings.selectedExchange.internalId &&
      !storeSettings.selectedExchange.paperTrading
    ) {
      setLoading(true);
      const payload = {
        token: storeSession.tradeApi.accessToken,
        exchangeInternalId: storeSettings.selectedExchange.internalId,
      };

      tradeApi
        .userAvailableBalanceGet(payload)
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

  useEffect(loadData, [
    storeSettings.selectedExchange.internalId,
    storeSession.tradeApi.accessToken,
  ]);

  return { balance, loading };
};

export default useAvailableBalance;

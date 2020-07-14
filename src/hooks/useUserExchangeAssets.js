import { useState, useEffect } from "react";
import useStoreSessionSelector from "./useStoreSessionSelector";
import tradeApi from "../services/tradeApiClient";
import useStoreSettingsSelector from "./useStoreSettingsSelector";
import { useDispatch } from "react-redux";
import { showErrorAlert } from "../store/actions/ui";

/**
 * @typedef {import("../services/tradeApiClient.types").UserExchangeAssetObject} UserExchangeAssetObject
 */

/**
 * @typedef {Object} HookData
 * @property {Array<UserExchangeAssetObject>} data
 * @property {Boolean} loading
 */

/**
 * Provides balance summary for exchange.
 *
 * @returns {HookData} Balance.
 */
const useUserExchangeAssets = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const storeSession = useStoreSessionSelector();
  const storeSettings = useStoreSettingsSelector();
  const dispatch = useDispatch();

  const loadData = () => {
    setLoading(true);
    const payload = {
      token: storeSession.tradeApi.accessToken,
      internalId: storeSettings.selectedExchange.internalId,
    };

    tradeApi
      .userExchangeAssetsGet(payload)
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((e) => {
        dispatch(showErrorAlert(e));
        setLoading(false);
      });
  };

  useEffect(loadData, [
    storeSettings.selectedExchange.internalId,
    storeSession.tradeApi.accessToken,
  ]);

  return {
    loading: loading,
    data: data,
  };
};

export default useUserExchangeAssets;

import { useState, useEffect } from "react";
import useStoreSessionSelector from "./useStoreSessionSelector";
import tradeApi from "../services/tradeApiClient";
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
 * @param {string} internalId ID of the exchange.
 * @returns {HookData} Balance.
 */
const useUserExchangeAssets = (internalId) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const storeSession = useStoreSessionSelector();
  const dispatch = useDispatch();

  const loadData = () => {
    setLoading(true);
    const payload = {
      token: storeSession.tradeApi.accessToken,
      internalId: internalId,
    };

    tradeApi
      .userExchangeAssetsGet(payload)
      .then((response) => {
        setData(response);
        setLoading(false);
      })
      .catch((e) => {
        dispatch(showErrorAlert(e));
        setLoading(false);
        setData([]);
      });
  };

  useEffect(loadData, [internalId, storeSession.tradeApi.accessToken]);

  return {
    loading: loading,
    data: data,
  };
};

export default useUserExchangeAssets;

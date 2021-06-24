import { useState, useEffect } from "react";
import useStoreSessionSelector from "./useStoreSessionSelector";
import tradeApi from "../services/tradeApiClient";
import { useDispatch } from "react-redux";
import { showErrorAlert } from "../store/actions/ui";
import { isArray } from "lodash";

/**
 * @typedef {import("../services/tradeApiClient.types").AssetsAndBalanceObject} AssetsAndBalanceObject
 * @typedef {Object} HookData
 * @property {AssetsAndBalanceObject} assets
 * @property {boolean} loading
 */

/**
 * Provides bases assets.
 *
 * @param {string} internalId Exchange account internal id.
 * @returns {HookData} Exchange Assets.
 */
const useAssetsAndBalance = (internalId) => {
  const [assets, setAssets] = useState({ spot: {}, futures: {} });
  const [loading, setLoading] = useState(false);

  const storeSession = useStoreSessionSelector();
  const dispatch = useDispatch();

  const loadData = () => {
    if (storeSession.tradeApi.accessToken && internalId) {
      setLoading(true);
      const payload = {
        exchangeInternalId: internalId,
      };

      tradeApi
        .getAssetsAndBalance(payload)
        .then((data) => {
          setAssets((prevData) => ({
            spot: !data.spot || isArray(data.spot) ? prevData.spot : data.spot,
            futures: data.futures,
          }));
        })
        .catch((e) => {
          dispatch(showErrorAlert(e));
        })
        .finally(() => setLoading(false));
    }
  };

  useEffect(loadData, [internalId, storeSession.tradeApi.accessToken]);

  return {
    assets,
    loading,
  };
};

export default useAssetsAndBalance;

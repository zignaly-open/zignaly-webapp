import { useState, useEffect } from "react";
import useStoreSessionSelector from "./useStoreSessionSelector";
import tradeApi from "../services/tradeApiClient";
import { useDispatch } from "react-redux";
import { showErrorAlert } from "../store/actions/ui";

/**
 * @typedef {import("../services/tradeApiClient.types").ExchangeAssetsDict} ExchangeAssetsDict
 */

/**
 * Provides bases assets.
 *
 * @param {string} exchangeInternalId Exchange account internal id.
 * @param {string} providerId Provider id.
 * @param {Date} updatedAt Last updated date to force data refresh.
 * @returns {ExchangeAssetsDict} Exchange Assets.
 */
const useProviderAssets = (exchangeInternalId, providerId, updatedAt = new Date()) => {
  const [assets, setAssets] = useState({});

  const storeSession = useStoreSessionSelector();
  const dispatch = useDispatch();

  const loadData = () => {
    if (exchangeInternalId && providerId) {
      const payload = {
        token: storeSession.tradeApi.accessToken,
        exchangeInternalId: exchangeInternalId,
        providerId: providerId,
      };

      tradeApi
        .providerAssetsGet(payload)
        .then((data) => {
          setAssets(data);
        })
        .catch((e) => {
          dispatch(showErrorAlert(e));
        });
    }
  };

  useEffect(loadData, [
    exchangeInternalId,
    providerId,
    storeSession.tradeApi.accessToken,
    updatedAt,
  ]);

  return assets;
};

export default useProviderAssets;

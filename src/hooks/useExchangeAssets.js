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
 * @param {string} internalId Exchange account internal id.
 * @param {Date} updatedAt Last updated date to force data refresh.
 * @returns {ExchangeAssetsDict} Exchange Assets.
 */
const useExchangeAssets = (internalId, updatedAt) => {
  const [assets, setAssets] = useState({});

  const storeSession = useStoreSessionSelector();
  const dispatch = useDispatch();

  const loadData = () => {
    if (internalId) {
      const payload = {
        token: storeSession.tradeApi.accessToken,
        internalId: internalId ? internalId : "",
      };

      if (storeSession.tradeApi.accessToken) {
        tradeApi
          .exchangeAssetsGet(payload)
          .then((data) => {
            setAssets(data);
          })
          .catch((e) => {
            dispatch(showErrorAlert(e));
          });
      }
    }
  };

  useEffect(loadData, [internalId, storeSession.tradeApi.accessToken, updatedAt]);

  return assets;
};

export default useExchangeAssets;

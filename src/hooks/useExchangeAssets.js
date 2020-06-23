import { useState, useEffect } from "react";
import useStoreSessionSelector from "./useStoreSessionSelector";
import tradeApi from "../services/tradeApiClient";

/**
 * @typedef {import("../services/tradeApiClient.types").ExchangeAssetsDict} ExchangeAssetsDict
 */

/**
 * Provides bases assets.
 *
 * @param {string} internalId Exchange account internal id.
 * @returns {ExchangeAssetsDict} Quote Assets.
 */
const useExchangeAssets = (internalId) => {
  const [assets, setAssets] = useState({});

  const storeSession = useStoreSessionSelector();

  const loadData = () => {
    const payload = {
      token: storeSession.tradeApi.accessToken,
      internalId,
    };

    tradeApi
      .exchangeAssetsGet(payload)
      .then((data) => {
        setAssets(data);
      })
      .catch((e) => {
        alert(`ERROR: ${e.message}`);
      });
  };

  useEffect(loadData, [internalId, storeSession.tradeApi.accessToken]);

  return assets;
};

export default useExchangeAssets;

import { useState, useEffect } from "react";
import useStoreSessionSelector from "./useStoreSessionSelector";
import tradeApi from "../services/tradeApiClient";

/**
 * @typedef {import("../services/tradeApiClient.types").BaseAssetsDict} BaseAssetsDict
 */

/**
 * Provides bases assets.
 *
 * @param {string} timeFrame Quote of the bases.
 * @returns {BaseAssetsDict} Quote Assets.
 */
const useConnectedProviders = (timeFrame, internalExchangeId) => {
  const [providers, setProviders] = useState([]);
  const storeSession = useStoreSessionSelector();

  useEffect(() => {
    const loadData = async () => {
      const payload = {
        token: storeSession.tradeApi.accessToken,
        ro: true,
        timeFrame,
        ...(internalExchangeId && { internalExchangeId }),
      };

      tradeApi
        .providersGet(payload)
        .then((data) => {
          setProviders(data);
        })
        .catch((e) => {
          alert(`ERROR: ${e.message}`);
        });
    };
    loadData();
  }, [storeSession.tradeApi.accessToken]);

  return providers;
};

export default useConnectedProviders;

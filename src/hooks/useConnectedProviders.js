import { useState, useEffect } from "react";
import useStoreSessionSelector from "./useStoreSessionSelector";
import tradeApi from "../services/tradeApiClient";

/**
 * @typedef {import("../services/tradeApiClient.types").ProvidersCollection} ProvidersCollection
 */

/**
 * Get list of connected providers.
 *
 * @param {number} timeFrame Quote of the bases.
 * @param {string} [internalExchangeId] Filter by internal exchange id.
 * @returns {ProvidersCollection} Quote Assets.
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
        copyTradersOnly: false,
        type: "connected",
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
  }, [storeSession.tradeApi.accessToken, internalExchangeId, timeFrame]);

  return providers;
};

export default useConnectedProviders;

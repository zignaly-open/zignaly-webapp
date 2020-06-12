import { useState, useEffect } from "react";
import useStoreSessionSelector from "./useStoreSessionSelector";
import tradeApi from "../services/tradeApiClient";

/**
 * @typedef {import("../services/tradeApiClient.types").BaseAssetsDict} BaseAssetsDict
 */

/**
 * Provides bases assets.
 *
 * @param {string} quote Quote of the bases.
 * @returns {BaseAssetsDict} Quote Assets.
 */
const useEquity = (internalId) => {
  const [equity, setEquity] = useState({
    balances: [],
    quotes: [],
  });

  const storeSession = useStoreSessionSelector();

  useEffect(() => {
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
          alert(`ERROR: ${e.message}`);
        });
    };
    loadData();
  }, [internalId, storeSession.tradeApi.accessToken]);

  return equity;
};

export default useEquity;

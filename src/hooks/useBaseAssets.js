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
const useBaseAssets = (quote) => {
  const [bases, setBases] = useState({});

  const storeSession = useStoreSessionSelector();

  const loadData = () => {
    const payload = {
      token: storeSession.tradeApi.accessToken,
      ro: true,
      quote,
    };

    tradeApi
      .baseAssetsGet(payload)
      .then((data) => {
        setBases(data);
      })
      .catch(() => {});
  };

  useEffect(loadData, [quote, storeSession.tradeApi.accessToken]);

  return bases;
};

export default useBaseAssets;

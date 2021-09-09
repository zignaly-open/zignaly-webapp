import { useState, useEffect } from "react";
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

  const loadData = () => {
    const payload = {
      quote,
    };

    tradeApi
      .baseAssetsGet(payload)
      .then((data) => {
        setBases(data);
      })
      .catch(() => {});
  };

  useEffect(loadData, [quote]);

  return bases;
};

export default useBaseAssets;

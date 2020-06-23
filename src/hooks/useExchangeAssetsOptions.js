import { useState, useEffect } from "react";
import useExchangeAssets from "./useExchangeAssets";

/**
 * @typedef {import("../services/tradeApiClient.types").ExchangeAssetsDict} ExchangeAssetsDict
 */

/**
 * Provides bases assets.
 *
 * @param {string} internalId Exchange account internal id.
 * @returns {ExchangeAssetsDict} Quote Assets.
 */
const useExchangeAssetsOptions = (internalId, defaultValue) => {
  const assets = useExchangeAssets(internalId);
  const [selectedAsset, setSelectedAsset] = useState(defaultValue);
  const assetsOptions = Object.keys(assets).sort();

  return { assetsOptions, selectedAsset };
};

export default useExchangeAssetsOptions;

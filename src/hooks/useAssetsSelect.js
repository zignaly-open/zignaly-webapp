import { useState, useEffect } from "react";
import useStoreSessionSelector from "./useStoreSessionSelector";
import tradeApi from "../services/tradeApiClient";
import useExchangeAssets from "./useExchangeAssets";

/**
 * @typedef {import("../services/tradeApiClient.types").BaseAssetsDict} BaseAssetsDict
 */

/**
 * Provides bases assets.
 *
 * @param {string} quote Quote of the bases.
 * @returns {BaseAssetsDict} Quote Assets.
 */
const useAssetsSelect = (internalId) => {
  const [selectedAssetName, setSelectedAsset] = useState("BTC");
  const assets = useExchangeAssets(internalId);
  const selectedAsset = assets[selectedAssetName];
  const assetsList = Object.keys(assets).sort();
  const [selectedNetwork, setSelectedNetwork] = useState(null);

  // Select default network
  useEffect(() => {
    if (selectedAsset) {
      setSelectedNetwork(selectedAsset.networks.find((n) => n.isDefault));
    }
  }, [selectedAsset]);

  return {
    selectedAssetName,
    setSelectedAsset,
    assetsList,
    selectedAsset,
    selectedNetwork,
    setSelectedNetwork,
  };
};

export default useAssetsSelect;

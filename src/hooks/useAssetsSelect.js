import { useState, useEffect } from "react";
import useStoreSessionSelector from "./useStoreSessionSelector";
import tradeApi from "../services/tradeApiClient";
import useExchangeAssets from "./useExchangeAssets";

/**
 * @typedef {import("../services/tradeApiClient.types").CoinNetwork} CoinNetwork
 * @typedef {import("../services/tradeApiClient.types").ExchangeAsset} ExchangeAsset
 */

/**
 * @typedef {Object} AssetsSelectType
 * @property {string} selectedAssetName
 * @property {Array<string>} assetsList
 * @property {ExchangeAsset} selectedAsset
 * @property {CoinNetwork} selectedNetwork
 * @property {function} setSelectedNetwork
 * @property {function} setSelectedAsset
 */

/**
 * Provides bases assets.
 *
 * @param {string} internalId Exchange internal id.
 * @returns {AssetsSelectType} Assets select object data.
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

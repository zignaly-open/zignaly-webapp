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
 * @param {string} internalId Exchange account internal id.
 * @param {string} type Exchange type
 * @returns {AssetsSelectType} Assets select object data.
 */
const useAssetsSelect = (internalId, type, updatedAt) => {
  const [selectedAssetName, setSelectedAsset] = useState("BTC");
  const assets = useExchangeAssets(internalId, updatedAt);

  const selectedAsset = assets[selectedAssetName];
  const assetsList = Object.keys(assets)
    .filter((a) => type !== "futures" || ["USDT", "BNB"].includes(a))
    .sort();
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

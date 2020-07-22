import { useState, useEffect } from "react";
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
 * Provides assets list and options to select an asset.
 *
 * @param {string} internalId Exchange account internal id.
 * @param {string} type Exchange type
 * @param {Date} [updatedAt] Last updated date to force data refresh.
 * @returns {AssetsSelectType} Assets select object data.
 */
const useAssetsSelect = (internalId, type, updatedAt) => {
  const [selectedAsset, setSelectedAsset] = useState({
    name: null,
    network: null,
  });

  const assets = useExchangeAssets(internalId, updatedAt);
  const assetsList = Object.keys(assets)
    .filter((a) => type !== "futures" || ["USDT", "BNB"].includes(a))
    .sort();
  const asset = assets[selectedAsset.name];

  /**
   * @param {string} name name
   * @returns {void}
   */
  const setSelectedAssetByName = (name) => {
    if (name && assets[name]) {
      setSelectedAsset({
        name,
        network: assets[name].networks.find((n) => n.isDefault),
      });
    }
  };

  /**
   * @param {CoinNetwork} network network
   * @returns {void}
   */
  const setSelectedNetwork = (network) => {
    if (network) {
      setSelectedAsset({
        ...selectedAsset,
        network,
      });
    }
  };

  useEffect(() => {
    if (assets && !asset) {
      // Select BTC by default
      setSelectedAssetByName(type !== "futures" ? "BTC" : "USDT");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assets]);

  return {
    selectedAssetName: selectedAsset.name,
    setSelectedAsset: setSelectedAssetByName,
    assetsList,
    selectedAsset: asset,
    selectedNetwork: selectedAsset.network,
    setSelectedNetwork,
  };
};

export default useAssetsSelect;

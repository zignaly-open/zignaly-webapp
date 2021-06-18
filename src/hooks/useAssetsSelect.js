import { useEffect, useState } from "react";
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
  const [selectedAssetData, setSelectedAsset] = useState({
    name: "BTC",
    network: null,
  });

  const assets = useExchangeAssets(internalId, updatedAt);
  const assetsList = Object.keys(assets)
    .filter((a) => type !== "futures" || ["USDT", "BNB", "BUSD"].includes(a))
    .sort();
  const selectedAsset = assets[selectedAssetData.name];

  useEffect(() => {
    if (assetsList && assetsList.length) {
      setSelectedAsset({
        name: assetsList[0],
        network: assets[assetsList[0]].networks.find((n) => n.isDefault),
      });
    }
  }, [assetsList.length]);

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
   * @param {string} name network name
   * @returns {void}
   */
  const setSelectedNetworkByName = (name) => {
    if (name) {
      setSelectedAsset({
        ...selectedAssetData,
        network: selectedAsset.networks.find((n) => n.name === name),
      });
    }
  };

  return {
    selectedAssetName: selectedAssetData.name,
    setSelectedAsset: setSelectedAssetByName,
    assetsList,
    selectedAsset: selectedAsset,
    selectedNetwork: selectedAssetData.network,
    setSelectedNetwork: setSelectedNetworkByName,
  };
};

export default useAssetsSelect;

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
 * @param {Boolean} initValues Flag to indicate whether to initialize values or not
 * @param {Date} [updatedAt] Last updated date to force data refresh.
 * @returns {AssetsSelectType} Assets select object data.
 */
const useAssetsSelect = (internalId, type, initValues, updatedAt) => {
  const [selectedAssetData, setSelectedAsset] = useState({
    name: null,
    network: null,
  });

  const assets = useExchangeAssets(internalId, updatedAt);
  const assetsList = Object.keys(assets)
    .filter((a) => type !== "futures" || ["USDT", "BNB", "BUSD"].includes(a))
    .sort();
  const selectedAsset = assets[selectedAssetData.name];

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

  useEffect(() => {
    if (initValues && assets && !selectedAsset) {
      setSelectedAssetByName(type !== "futures" ? "BTC" : "USDT");
    }
  }, [assets]);

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

import { useState, useEffect } from "react";
import tradeApi from "../services/tradeApiClient";
import { useDispatch } from "react-redux";
import { showErrorAlert } from "../store/actions/ui";

/**
 * @typedef {import("../services/tradeApiClient.types").ExchangeAssetsDict} ExchangeAssetsDict
 */

/**
 * Provides bases assets.
 *
 * @param {string} internalId Exchange account internal id.
 * @param {Date} updatedAt Last updated date to force data refresh.
 * @returns {ExchangeAssetsDict} Exchange Assets.
 */
const useExchangeAssets = (internalId, updatedAt) => {
  const [assets, setAssets] = useState({});
  const dispatch = useDispatch();

  const loadData = () => {
    if (internalId) {
      const payload = {
        internalId: internalId || "",
      };

      tradeApi
        .exchangeAssetsGet(payload)
        .then((data) => {
          setAssets(data);
        })
        .catch((e) => {
          dispatch(showErrorAlert(e));
        });
    }
  };

  useEffect(loadData, [internalId, updatedAt]);

  return assets;
};

export default useExchangeAssets;

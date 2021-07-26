import { useState, useEffect } from "react";
import tradeApi from "../services/tradeApiClient";
import { useDispatch } from "react-redux";
import { showErrorAlert } from "../store/actions/ui";

/**
 * @typedef {import("../services/tradeApiClient.types").ExchangeAssetsDict} ExchangeAssetsDict
 */

/**
 * Provides balance summary for exchange.
 *
 * @param {string} internalId ID of the exchange.
 * @returns {ExchangeAssetsDict} Balance.
 */
const useUserExchangeAssets = (internalId) => {
  const [assets, setAssets] = useState({});
  const dispatch = useDispatch();

  const loadData = () => {
    if (internalId) {
      const payload = {
        internalId: internalId,
      };

      tradeApi
        .exchangeAssetsGet(payload)
        .then((response) => {
          setAssets(response);
        })
        .catch((e) => {
          dispatch(showErrorAlert(e));
          setAssets({});
        });
    }
  };

  useEffect(loadData, [internalId]);

  return assets;
};

export default useUserExchangeAssets;

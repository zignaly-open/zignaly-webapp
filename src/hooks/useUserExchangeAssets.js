import { useState, useEffect } from "react";
import useStoreSessionSelector from "./useStoreSessionSelector";
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

  const storeSession = useStoreSessionSelector();
  const dispatch = useDispatch();

  const loadData = () => {
    const payload = {
      token: storeSession.tradeApi.accessToken,
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
  };

  useEffect(loadData, [internalId, storeSession.tradeApi.accessToken]);

  return assets;
};

export default useUserExchangeAssets;

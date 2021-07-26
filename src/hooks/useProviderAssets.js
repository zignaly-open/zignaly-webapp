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
 * @param {string} exchangeInternalId Exchange account internal id.
 * @param {string} providerId Provider id.
 * @returns {ExchangeAssetsDict} Exchange Assets.
 */
const useProviderAssets = (exchangeInternalId, providerId) => {
  const [assets, setAssets] = useState({});
  const dispatch = useDispatch();

  const loadData = () => {
    if (exchangeInternalId && providerId) {
      const payload = {
        exchangeInternalId: exchangeInternalId,
        providerId: providerId,
      };

      tradeApi
        .providerAssetsGet(payload)
        .then((data) => {
          setAssets(data);
        })
        .catch((e) => {
          dispatch(showErrorAlert(e));
        });
    }
  };

  useEffect(loadData, [exchangeInternalId, providerId]);

  return assets;
};

export default useProviderAssets;

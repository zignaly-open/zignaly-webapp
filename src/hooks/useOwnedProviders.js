import { useState, useEffect } from "react";
import useStoreSessionSelector from "./useStoreSessionSelector";
import tradeApi from "../services/tradeApiClient";
import { useDispatch } from "react-redux";
import { showErrorAlert } from "../store/actions/ui";
import useStoreSettingsSelector from "./useStoreSettingsSelector";

/**
 * @typedef {import('../services/tradeApiClient.types').ConnectedProviderUserInfo} ConnectedProviderUserInfo
 */

/**
 * Get user info for a connected provider.
 *
 * @param {string} providerId Quote of the bases.
 * @returns {{providerUserInfo: ConnectedProviderUserInfo, profitPerc: number}} Provider user info.
 */
const useOwnedProviders = (shouldExecute = true) => {
  const [providers, setProviders] = useState(null);
  const storeSession = useStoreSessionSelector();
  const dispatch = useDispatch();

  const loadData = () => {
    if (!shouldExecute) return;

    const payload = {
      token: storeSession.tradeApi.accessToken,
    };

    tradeApi
      .providersOwnedGet(payload)
      .then((data) => {
        setProviders(data);
      })
      .catch((e) => {
        dispatch(showErrorAlert(e));
      });
  };

  useEffect(loadData, [shouldExecute]);

  return providers;
};

export default useOwnedProviders;

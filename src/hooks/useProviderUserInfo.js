import { useState, useEffect } from "react";
import useStoreSessionSelector from "./useStoreSessionSelector";
import tradeApi from "../services/tradeApiClient";

/**
 * @typedef {import('../../../services/tradeApiClient.types').ConnectedProviderUserInfo} ConnectedProviderUserInfo
 */

/**
 * Provides bases assets.
 *
 * @param {string} providerId Quote of the bases.
 * @returns {BaseAssetsDict} Quote Assets.
 */
const useProviderUserInfo = (providerId) => {
  /**
   * @type {ConnectedProviderUserInfo}
   */
  const initialState = {
    currentAllocated: 0,
    profitsSinceCopying: 0,
  };
  const [providerUserInfo, setProviderUserInfo] = useState(initialState);

  const storeSession = useStoreSessionSelector();

  const loadData = () => {
    const payload = {
      token: storeSession.tradeApi.accessToken,
      ro: true,
      providerId,
    };

    tradeApi
      .connectedProviderUserInfoGet(payload)
      .then((data) => {
        setProviderUserInfo(data);
      })
      .catch((e) => {
        alert(`ERROR: ${e.message}`);
      });
  };

  useEffect(loadData, [storeSession.tradeApi.accessToken, providerId]);

  return providerUserInfo;
};

export default useProviderUserInfo;

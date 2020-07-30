import { useState, useEffect } from "react";
import useStoreSessionSelector from "./useStoreSessionSelector";
import tradeApi from "../services/tradeApiClient";
import { useDispatch } from "react-redux";
import { showErrorAlert } from "../store/actions/ui";

/**
 * @typedef {import('../services/tradeApiClient.types').ConnectedProviderUserInfo} ConnectedProviderUserInfo
 */

/**
 * Get user info for a connected provider.
 *
 * @param {string} providerId Quote of the bases.
 * @returns {ConnectedProviderUserInfo} Provider user info.
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
  const dispatch = useDispatch();

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
        dispatch(showErrorAlert(e));
      });
  };

  useEffect(loadData, [storeSession.tradeApi.accessToken, providerId]);

  return providerUserInfo;
};

export default useProviderUserInfo;

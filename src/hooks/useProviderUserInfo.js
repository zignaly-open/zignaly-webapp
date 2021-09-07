import { useState, useEffect } from "react";
import tradeApi from "../services/tradeApiClient";
import { useDispatch } from "react-redux";
import { showErrorAlert } from "../store/actions/ui";
import useSelectedExchange from "hooks/useSelectedExchange";

/**
 * @typedef {import('../services/tradeApiClient.types').ConnectedProviderUserInfo} ConnectedProviderUserInfo
 */

/**
 * Get user info for a connected provider.
 *
 * @param {string} providerId Quote of the bases.
 * @returns {{providerUserInfo: ConnectedProviderUserInfo, profitPerc: number}} Provider user info.
 */
const useProviderUserInfo = (providerId) => {
  const selectedExchange = useSelectedExchange();

  /**
   * @type {ConnectedProviderUserInfo}
   */
  const initialState = {
    currentAllocated: 0,
    allocatedBalance: 0,
    profitsSinceCopying: 0,
  };
  const [providerUserInfo, setProviderUserInfo] = useState(initialState);

  const dispatch = useDispatch();

  const loadData = () => {
    const payload = {
      providerId,
      exchangeInternalId: selectedExchange.internalId,
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

  useEffect(loadData, [providerId]);

  let profitPerc = 0;
  if (providerUserInfo.profitsSinceCopying && providerUserInfo.allocatedBalance) {
    profitPerc = providerUserInfo.allocatedBalance
      ? (providerUserInfo.profitsSinceCopying / providerUserInfo.allocatedBalance) * 100
      : 0;
  }

  return { profitPerc, providerUserInfo };
};

export default useProviderUserInfo;

import { useState, useEffect } from "react";
import tradeApi from "../services/tradeApiClient";
import useStoreSessionSelector from "./useStoreSessionSelector";
import { useDispatch } from "react-redux";
import { showErrorAlert } from "../store/actions/ui";
/**
 * @typedef {import('../services/tradeApiClient.types').ProviderFollowersEntity} ProviderFollowersEntity
 * @typedef {Object} HookData
 * @property {Boolean} loading
 * @property {Array<ProviderFollowersEntity>} list
 * @property {Function} loadFollowersList
 */

/**
 *
 * @param {String} providerId Provider ID.
 * @returns {HookData} Hook Data.
 */
const useProviderUsers = (providerId) => {
  const storeSession = useStoreSessionSelector();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const loadFollowersList = () => {
    setLoading(true);
    const payload = {
      token: storeSession.tradeApi.accessToken,
      providerId: providerId,
    };
    tradeApi
      .providerFollowersListGet(payload)
      .then((response) => {
        setList(response);
        setLoading(false);
      })
      .catch((e) => {
        dispatch(showErrorAlert(e));
        setLoading(false);
      });
  };

  useEffect(loadFollowersList, []);

  return { loading, list, loadFollowersList };
};

export default useProviderUsers;

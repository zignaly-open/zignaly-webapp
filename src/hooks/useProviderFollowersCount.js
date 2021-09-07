import { useEffect, useState } from "react";
import tradeApi from "../services/tradeApiClient";
import { useDispatch } from "react-redux";
import { showErrorAlert } from "../store/actions/ui";
import { creatProviderFollowersCountEntity } from "../services/tradeApiClient.types";

/**
 * @typedef {import("../services/tradeApiClient.types").ProviderFollowersCountEntity} ProviderFollowersCountEntity
 * @typedef {Object} HookData
 * @property {ProviderFollowersCountEntity} counts
 * @property {Boolean} countsLoading
 */

/**
 * Provides followers counts for a provider.
 *
 * @param {string} providerId ID of the provider.
 * @returns {HookData} .
 */
const useProviderFollowersCount = (providerId) => {
  const emptyObject = creatProviderFollowersCountEntity(null);
  const [counts, setCounts] = useState(emptyObject);
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();

  const loadSummary = () => {
    if (providerId) {
      const payload = {
        providerId: providerId,
      };
      tradeApi
        .providerFollowersCountGet(payload)
        .then((response) => {
          setCounts(response);
        })
        .catch((e) => {
          dispatch(showErrorAlert(e));
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  useEffect(loadSummary, [providerId]);

  return {
    countsLoading: loading,
    counts: counts,
  };
};

export default useProviderFollowersCount;

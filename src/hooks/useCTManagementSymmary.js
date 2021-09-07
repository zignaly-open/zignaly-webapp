import { useState } from "react";
import tradeApi from "../services/tradeApiClient";
import { useDispatch } from "react-redux";
import { showErrorAlert } from "../store/actions/ui";
import { creatProviderDataPointsEntity } from "../services/tradeApiClient.types";
import useInterval from "./useInterval";

/**
 * @typedef {import("../services/tradeApiClient.types").ProviderDataPointsEntity} ProviderDataPointsEntity
 * @typedef {Object} HookData
 * @property {ProviderDataPointsEntity} summary
 * @property {Boolean} summaryLoading
 */

/**
 * Provides balance summary CT service.
 *
 * @param {string} providerId ID of the provider.
 * @returns {HookData} Balance.
 */
const useCTManagementSymmary = (providerId) => {
  const emptyObject = creatProviderDataPointsEntity(null);
  const [summary, setSummary] = useState(emptyObject);
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();

  const loadSummary = () => {
    if (providerId) {
      const payload = {
        providerId: providerId,
      };
      tradeApi
        .providerCopyTradingDataPointsGet(payload)
        .then((response) => {
          setSummary(response);
        })
        .catch((e) => {
          dispatch(showErrorAlert(e));
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  useInterval(loadSummary, 5000, true);

  return {
    summaryLoading: loading,
    summary: summary,
  };
};

export default useCTManagementSymmary;

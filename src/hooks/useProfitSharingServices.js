import { useState, useEffect } from "react";
import tradeApi from "../services/tradeApiClient";
import useStoreSessionSelector from "./useStoreSessionSelector";
import { uniqBy } from "lodash";
import { useDispatch } from "react-redux";
import { showErrorAlert } from "../store/actions/ui";

/**
 * @typedef {import("../services/tradeApiClient.types").ProvidersPayload} ProvidersPayload
 * @typedef {import("../services/tradeApiClient.types").ProvidersCollection} ProvidersCollection
 */

/**
 * Hook to generate the profit sharing services list fetching and filtering.
 *
 * @param {String} internalExchangeId Internal ID of exchange.
 * @returns {ProvidersCollection} Profits Sharing Services List
 */
const useProfitSharingServices = (internalExchangeId) => {
  const [providers, setProviders] = useState([]);
  const storeSession = useStoreSessionSelector();
  const dispatch = useDispatch();

  const loadProviders = () => {
    /**
     * @type {ProvidersPayload}
     */
    const payload = {
      token: storeSession.tradeApi.accessToken,
      type: "connected",
      ro: true,
      provType: "profitsharing",
      timeFrame: 90,
      internalExchangeId,
    };

    tradeApi
      .providersGet(payload)
      .then((responseData) => {
        const uniqueProviders = uniqBy(responseData, "id");
        const profitSharingServices = uniqueProviders.filter((item) => item.profitSharing);
        setProviders(profitSharingServices);
      })
      .catch((e) => {
        dispatch(showErrorAlert(e));
      });
  };
  // Load providers at init and on timeframe change.
  useEffect(loadProviders, [storeSession.tradeApi.accessToken, internalExchangeId]);

  return providers;
};

export default useProfitSharingServices;

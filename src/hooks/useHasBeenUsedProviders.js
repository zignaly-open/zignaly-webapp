import { useState, useEffect } from "react";
import useStoreSessionSelector from "./useStoreSessionSelector";
import tradeApi from "../services/tradeApiClient";
import { useDispatch } from "react-redux";
import { showErrorAlert } from "../store/actions/ui";
import useStoreSettingsSelector from "./useStoreSettingsSelector";

/**
 * @typedef {import("../services/tradeApiClient.types").ProvidersCollection} ProvidersCollection
 * @typedef {Object} HookData
 * @property {ProvidersCollection} providers
 * @property {Boolean} providersLoading
 */

/**
 * Provides provider list.
 *
 * @param {boolean} [shouldExecute] Flag to indicate if we should execute the request.
 * @returns {HookData} Provider list.
 */
const useReadOnlyProviders = (shouldExecute = true) => {
  const [providersLoading, setProvidersLoading] = useState(true);
  const [list, setList] = useState([]);
  const dispatch = useDispatch();
  const storeSession = useStoreSessionSelector();
  const storeSettings = useStoreSettingsSelector();

  const loadData = () => {
    if (shouldExecute && storeSession.tradeApi.accessToken) {
      setProvidersLoading(true);
      const payload = {
        token: storeSession.tradeApi.accessToken,
        ro: true,
      };

      tradeApi
        .providersListGet(payload)
        .then((response) => {
          filterProviders(response);
        })
        .catch((e) => {
          dispatch(showErrorAlert(e));
        })
        .finally(() => {
          setProvidersLoading(false);
        });
    }
  };

  /**
   * Filter providers that have been used for the selected exchange.
   * @param {ProvidersCollection} response Providers Collection.
   * @returns {Void} None.
   */
  const filterProviders = (response) => {
    let providerAssets = response.filter(
      (item) =>
        item.hasBeenUsed && item.exchangeInternalId === storeSettings.selectedExchange.internalId,
    );
    setList(providerAssets);
  };

  useEffect(loadData, [
    storeSession.tradeApi.accessToken,
    storeSettings.selectedExchange.internalId,
    shouldExecute,
  ]);

  return { providers: list, providersLoading: providersLoading };
};

export default useReadOnlyProviders;

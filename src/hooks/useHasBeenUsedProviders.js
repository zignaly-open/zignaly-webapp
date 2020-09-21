import { useState, useEffect } from "react";
import useStoreSessionSelector from "./useStoreSessionSelector";
import tradeApi from "../services/tradeApiClient";
import { useDispatch } from "react-redux";
import { showErrorAlert } from "../store/actions/ui";
import useStoreSettingsSelector from "./useStoreSettingsSelector";

/**
 * @typedef {import("../services/tradeApiClient.types").ProvidersCollection} ProvidersCollection
 */

/**
 * Provides provider list.
 *
 * @param {boolean} [shouldExecute] Flag to indicate if we should execute the request.
 * @returns {ProvidersCollection} Provider list.
 */
const useReadOnlyProviders = (shouldExecute = true) => {
  const [list, setList] = useState([]);
  const dispatch = useDispatch();
  const storeSession = useStoreSessionSelector();
  const storeSettings = useStoreSettingsSelector();

  const loadData = () => {
    if (shouldExecute) {
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
        });
    }
  };

  /**
   *
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

  return list;
};

export default useReadOnlyProviders;

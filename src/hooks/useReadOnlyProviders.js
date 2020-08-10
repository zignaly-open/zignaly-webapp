import { useState, useEffect } from "react";
import useStoreSessionSelector from "./useStoreSessionSelector";
import tradeApi from "../services/tradeApiClient";
import { useDispatch } from "react-redux";
import { showErrorAlert } from "../store/actions/ui";

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

  const loadData = () => {
    if (shouldExecute) {
      const payload = {
        token: storeSession.tradeApi.accessToken,
        ro: true,
      };

      tradeApi
        .providersListGet(payload)
        .then((response) => {
          setList(response);
        })
        .catch((e) => {
          dispatch(showErrorAlert(e));
        });
    }
  };

  useEffect(loadData, [storeSession.tradeApi.accessToken, shouldExecute]);

  return list;
};

export default useReadOnlyProviders;

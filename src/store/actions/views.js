import tradeApi from "../../services/tradeApiClient";
import { showLoader, showErrorAlert } from "./ui";

export const GET_PROVIDER = "GET_PROVIDER_ACTION";
export const REMOVE_PROVIDER = "REMOVE_PROVIDER_ACTION";

/**
 * @typedef {import("../../services/tradeApiClient.types").GetProviderPayload} GetProviderPayload
 * @typedef {import('../../store/store').AppThunk} AppThunk
 */

/**
 * Get user balance store thunk action.
 *
 * @param {GetProviderPayload} payload Trade API user authorization.
 *
 * @returns {AppThunk} Thunk action function.
 */
export const setProvider = (payload) => {
  return async (dispatch) => {
    try {
      dispatch(showLoader(true));
      const responseData = await tradeApi.providerGet(payload);
      const action = {
        type: GET_PROVIDER,
        payload: responseData,
      };

      dispatch(action);
      dispatch(showLoader(false));
    } catch (e) {
      dispatch(showErrorAlert(e));
    }
  };
};

export const unsetProvider = () => {
  return {
    type: REMOVE_PROVIDER,
  };
};

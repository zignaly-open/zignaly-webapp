import tradeApi from "../../services/tradeApiClient";
import { showErrorAlert } from "./ui";

export const GET_PROVIDER = "GET_PROVIDER_ACTION";
export const REMOVE_PROVIDER = "REMOVE_PROVIDER_ACTION";
export const SHOW_PROFILE_LOADER = "SHOW_PROFILE_LOADER_ACTION";

/**
 * @typedef {import("../../services/tradeApiClient.types").GetProviderPayload} GetProviderPayload
 * @typedef {import('../../store/store').AppThunk} AppThunk
 */

/**
 * Get user balance store thunk action.
 *
 * @param {GetProviderPayload} payload Trade API user authorization.
 * @param {Boolean} [showLoader] Trade API user authorization.
 *
 * @returns {AppThunk} Thunk action function.
 */
export const getProvider = (payload, showLoader) => {
  return async (dispatch) => {
    try {
      if (showLoader) {
        dispatch(showProviderProfileLoader(true));
      }
      const responseData = await tradeApi.providerGet(payload);
      const action = {
        type: GET_PROVIDER,
        payload: responseData,
      };

      dispatch(action);
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

/**
 *
 * @param {Boolean} flag flag to show profile loader
 */

export const showProviderProfileLoader = (flag) => {
  return {
    type: SHOW_PROFILE_LOADER,
    payload: flag,
  };
};

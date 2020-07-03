import tradeApi from "../../services/tradeApiClient";
import { unsetSelectedExchange } from "./settings";
import { unsetUserExchanges } from "./user";
import { unsetProvider } from "./views";
import { showErrorAlert } from "./ui";

export const START_TRADE_API_SESSION = "START_TRADE_API_SESSION";
export const END_TRADE_API_SESSION = "END_TRADE_API_SESSION";
export const ASK_2FA = "ASK_2FA";

/**
 * @typedef {import("../../services/tradeApiClient.types").UserLoginPayload} UserLoginPayload
 * @typedef {import('../../store/store').AppThunk} AppThunk
 */

/**
 * Set user session.
 *
 * @param {UserLoginPayload} payload User login payload.
 * @returns {AppThunk} Thunk action function.
 */
export const startTradeApiSession = (payload) => {
  return async (dispatch) => {
    try {
      const responseData = await tradeApi.userLogin(payload);
      const action = {
        type: START_TRADE_API_SESSION,
        payload: responseData,
      };

      dispatch(action);

      // Prompt 2FA
      if (responseData.ask2FA) {
        dispatch({ type: ASK_2FA, payload: true });
      }
    } catch (e) {
      dispatch(showErrorAlert(e));
    }
  };
};

/**
 * @returns {AppThunk}
 */

export const endTradeApiSession = () => {
  return async (dispatch) => {
    try {
      const action = {
        type: END_TRADE_API_SESSION,
      };

      dispatch(action);
      dispatch(unsetSelectedExchange());
      dispatch(unsetUserExchanges());
      dispatch(unsetProvider());
    } catch (e) {
      dispatch(showErrorAlert(e));
    }
  };
};

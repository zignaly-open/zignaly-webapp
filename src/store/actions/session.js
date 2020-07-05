import { unsetSelectedExchange } from "./settings";
import { unsetUserExchanges } from "./user";
import { unsetProvider } from "./views";
import { showErrorAlert } from "./ui";

export const START_TRADE_API_SESSION = "START_TRADE_API_SESSION";
export const END_TRADE_API_SESSION = "END_TRADE_API_SESSION";

/**
 * @typedef {import("../../services/tradeApiClient.types").UserLoginResponse} UserLoginResponse
 * @typedef {import('../../store/store').AppThunk} AppThunk
 * @typedef {import('redux').AnyAction} AnyAction
 */

/**
 * @param {UserLoginResponse} payload User login payload.
 * @returns {AnyAction} return action object.
 */
export const startTradeApiSession = (payload) => {
  return {
    type: START_TRADE_API_SESSION,
    payload,
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

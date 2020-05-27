import tradeApi from "../../services/tradeApiClient";

export const START_TRADE_API_SESSION = "START_TRADE_API_SESSION";

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
    } catch (e) {
      alert(`ERROR: ${e.message}`);
    }
  };
};

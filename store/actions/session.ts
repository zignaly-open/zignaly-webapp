import { showErrorAlert } from "./ui";

export const START_TRADE_API_SESSION = "START_TRADE_API_SESSION";
export const END_TRADE_API_SESSION = "END_TRADE_API_SESSION";
export const REFRESH_SESSION_DATA = "REFRESH_SESSION_DATA_ACTION";
export const CLEAR_SESSION_DATA = "CLEAR_SESSION_DATA_ACTION";

/**
 * @param {LoginResponse} response User login payload.
 * @param {'login'|'signup'} eventType User event.
 * @returns {AppThunk} return action object.
 */
export const startTradeApiSession = (token) => {
  return async (dispatch) => {
    const action = {
      type: START_TRADE_API_SESSION,
      payload: token,
    };

    dispatch(action);
  };
};

/**
 * @returns {AppThunk} Thunk Action.
 */
export const endTradeApiSession = () => {
  return async (dispatch) => {
    try {
      const action = {
        type: END_TRADE_API_SESSION,
      };
      dispatch(action);
    } catch (e) {
      dispatch(showErrorAlert(e));
    }
  };
};

export const clearSessionData = () => {
  return {
    type: CLEAR_SESSION_DATA,
  };
};

export const setSessionData = (payload) => {
  return {
    type: REFRESH_SESSION_DATA,
    payload,
  };
};

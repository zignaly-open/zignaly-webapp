import { unsetUserExchanges, setUserExchanges, setUserData } from "./user";
import { unsetProvider } from "./views";
import { showErrorAlert, ask2FA } from "./ui";
import { isEmpty } from "lodash";
import { navigate } from "gatsby";
import tradeApi from "../../services/tradeApiClient";

export const START_TRADE_API_SESSION = "START_TRADE_API_SESSION";
export const END_TRADE_API_SESSION = "END_TRADE_API_SESSION";

/**
 * @typedef {import("../../services/tradeApiClient.types").UserLoginPayload} UserLoginPayload
 * @typedef {import("../../services/tradeApiClient.types").UserRegisterPayload} UserRegisterPayload
 * @typedef {import("../../services/tradeApiClient.types").UserLoginResponse} UserLoginResponse
 * @typedef {import("../../services/tradeApiClient.types").TwoFAPayload} TwoFAPayload
 * @typedef {import('../../store/store').AppThunk} AppThunk
 * @typedef {import('redux').AnyAction} AnyAction
 */

/**
 * @param {UserLoginPayload} payload User login payload.
 * @param {React.SetStateAction<*>} setLoading State action to hide loader.
 * @returns {AppThunk} return action object.
 */
export const startTradeApiSession = (payload, setLoading) => {
  return async (dispatch) => {
    try {
      const responseData = await tradeApi.userLogin(payload);
      const action = {
        type: START_TRADE_API_SESSION,
        payload: responseData,
      };

      dispatch(action);
      dispatch(check2FA(responseData));
      setLoading(false);
    } catch (e) {
      dispatch(showErrorAlert(e));
      setLoading(false);
    }
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
      dispatch(unsetUserExchanges());
      dispatch(unsetProvider());
    } catch (e) {
      dispatch(showErrorAlert(e));
    }
  };
};

/**
 * Set user session.
 *
 * @param {UserRegisterPayload} payload User login payload.
 * @param {React.SetStateAction<*>} setLoading State Action to hide loader.
 * @returns {AppThunk} Thunk action function.
 */
export const registerUser = (payload, setLoading) => {
  return async (dispatch) => {
    try {
      const responseData = await tradeApi.userRegister(payload);
      const action = {
        type: START_TRADE_API_SESSION,
        payload: responseData,
      };

      dispatch(action);
      setLoading(false);
      dispatch(check2FA(responseData));
    } catch (e) {
      dispatch(showErrorAlert(e));
      setLoading(false);
    }
  };
};

/**
 * Set user session.
 *
 * @param {TwoFAPayload} payload User login payload.
 * @param {React.SetStateAction<*>} setLoading State action to hide loader.
 * @returns {AppThunk} Thunk action function.
 */
export const authenticate2FA = (payload, setLoading) => {
  return async (dispatch) => {
    try {
      const responseData = await tradeApi.verify2FA(payload);
      if (responseData) {
        dispatch(ask2FA(false));
        dispatch(loadAppUserData(payload.token));
        setLoading(false);
      }
    } catch (e) {
      dispatch(showErrorAlert(e));
      setLoading(false);
    }
  };
};

/**
 * Function to preload user data.
 *
 * @param {String} token api token.
 * @returns {AppThunk} Thunk action.
 */
const loadAppUserData = (token) => {
  return async (dispatch) => {
    if (!isEmpty(token)) {
      const authorizationPayload = {
        token: token,
      };

      dispatch(setUserExchanges(authorizationPayload));
      dispatch(setUserData(authorizationPayload));
      navigate("/dashboard/positions");
    }
  };
};

/**
 *
 * @param {UserLoginResponse} response user login response data.
 * @returns {AppThunk} Thunk action
 */
const check2FA = (response) => {
  return async (dispatch) => {
    if (response.ask2FA) {
      dispatch(ask2FA(true));
    } else {
      dispatch(loadAppUserData(response.token));
    }
  };
};

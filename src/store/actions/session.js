import tradeApi from "../../services/tradeApiClient";
import { unsetSelectedExchange } from "./settings";
import { unsetUserExchanges, setUserExchanges, setUserData } from "./user";
import { unsetProvider } from "./views";
import { showErrorAlert } from "./ui";
import { isEmpty } from "lodash";
import { navigate } from "@reach/router";

export const START_TRADE_API_SESSION = "START_TRADE_API_SESSION";
export const END_TRADE_API_SESSION = "END_TRADE_API_SESSION";

/**
 * @typedef {import("../../services/tradeApiClient.types").UserLoginPayload} UserLoginPayload
 * @typedef {import("../../services/tradeApiClient.types").UserRegisterPayload} UserRegisterPayload
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
      loadAppUserData(responseData.token, dispatch);
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

/**
 * Set user session.
 *
 * @param {UserRegisterPayload} payload User login payload.
 * @param {React.SetStateAction<*>} setLoading
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
      loadAppUserData(responseData.token, dispatch);
    } catch (e) {
      dispatch(showErrorAlert(e));
      setLoading(false);
    }
  };
};

/**
 *
 * @param {String} token
 * @param {*} dispatch
 */
const loadAppUserData = (token, dispatch) => {
  if (!isEmpty(token)) {
    const authorizationPayload = {
      token: token,
    };

    dispatch(setUserExchanges(authorizationPayload));
    dispatch(setUserData(authorizationPayload));
    navigate("/dashboard/positions");
  }
};

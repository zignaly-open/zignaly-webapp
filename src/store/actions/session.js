import { unsetUserExchanges, setUserExchanges, setUserData } from "./user";
import { unsetProvider } from "./views";
import { showErrorAlert } from "./ui";
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
 * @param {UserLoginResponse} response User login payload.
 * @returns {AppThunk} return action object.
 */
export const startTradeApiSession = (response) => {
  return async (dispatch) => {
    const action = {
      type: START_TRADE_API_SESSION,
      payload: response,
    };

    dispatch(action);
    dispatch(loadAppUserData(response));
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
      dispatch(loadAppUserData(responseData));
      setLoading(false);
    } catch (e) {
      dispatch(showErrorAlert(e));
      setLoading(false);
    }
  };
};

/**
 * Function to preload user data.
 *
 * @param {UserLoginResponse} response api token.
 * @returns {AppThunk} Thunk action.
 */
export const loadAppUserData = (response) => {
  return async (dispatch) => {
    if (!isEmpty(response.token)) {
      const authorizationPayload = {
        token: response.token,
      };

      dispatch(setUserExchanges(authorizationPayload));
      dispatch(setUserData(authorizationPayload));

      // Navigate to return url or dashboard
      const params = new URLSearchParams(
        typeof window !== "undefined" ? window.location.search : "",
      );
      const path = params.get("ret") || "/dashboard/positions";
      const pathPrefix = process.env.GATSBY_BASE_PATH || "";
      const pathWithoutPrefix = path.replace(pathPrefix, "");
      navigate(pathWithoutPrefix);
    }
  };
};

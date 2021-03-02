import { unsetUser, getUserData } from "./user";
import { unsetProvider } from "./views";
import { showErrorAlert } from "./ui";
import { assign } from "lodash";
import tradeApi from "../../services/tradeApiClient";
import gtmPushApi from "../../utils/gtmPushApi";
import { endLiveSession, startLiveSession } from "../../utils/liveSessionApi";
// import { userPilotLogin } from "../../utils/userPilotApi";
// import { mixPanelTrigger } from "utils/mixpanelApi";
import { analyticsTrigger } from "utils/analyticsJsApi";

export const START_TRADE_API_SESSION = "START_TRADE_API_SESSION";
export const END_TRADE_API_SESSION = "END_TRADE_API_SESSION";
export const REFRESH_SESSION_DATA = "REFRESH_SESSION_DATA_ACTION";
export const CLEAR_SESSION_DATA = "CLEAR_SESSION_DATA_ACTION";
export const SET_APP_VERSION = "SET_APP_VERSION";

/**
 * @typedef {import("../../services/tradeApiClient.types").UserLoginPayload} UserLoginPayload
 * @typedef {import("../../services/tradeApiClient.types").UserRegisterPayload} UserRegisterPayload
 * @typedef {import("../../services/tradeApiClient.types").UserEntity} UserEntity
 * @typedef {import("../../services/tradeApiClient.types").TwoFAPayload} TwoFAPayload
 * @typedef {import('../../store/store').AppThunk} AppThunk
 * @typedef {import('redux').AnyAction} AnyAction
 */

/**
 * @param {UserEntity} response User login payload.
 * @returns {AppThunk} return action object.
 */
export const startTradeApiSession = (response) => {
  const { gtmEvent } = gtmPushApi();
  const eventType = {
    event: "login",
  };

  return async (dispatch) => {
    if (!response.token) return;

    const action = {
      type: START_TRADE_API_SESSION,
      payload: response,
    };

    dispatch(action);
    // Add event type with user entity properties.
    if (gtmEvent) {
      gtmEvent.push(assign(eventType, response));
    }
    // mixPanelTrigger(response, "login");
    analyticsTrigger(response, "login");
    // userPilotLogin(response);
    dispatch(refreshSessionData(response.token));
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
      endLiveSession();
      dispatch(action);
      dispatch(unsetUser());
      dispatch(unsetProvider());
      dispatch(clearSessionData());
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
  const { gtmEvent } = gtmPushApi();
  const eventType = {
    event: "signup",
  };

  return async (dispatch) => {
    try {
      const responseData = await tradeApi.userRegister(payload);
      // Add event type with user entity properties.
      if (gtmEvent) {
        gtmEvent.push(assign(eventType, responseData));
      }
      startLiveSession(responseData);
      // mixPanelTrigger(responseData, "signup");
      analyticsTrigger(responseData, "signup");
      // userPilotLogin(responseData);
      dispatch(startTradeApiSession(responseData));
    } catch (e) {
      dispatch(showErrorAlert(e));
      setLoading(false);
    }
  };
};

/**
 * Function to preload user data.
 *
 * @param {string} token api token.
 * @returns {AppThunk} Thunk action.
 */
export const loadAppUserData = (token) => {
  return async (dispatch) => {
    if (token) {
      const authorizationPayload = {
        token,
      };

      dispatch(getUserData(authorizationPayload));
    }
  };
};

/**
 * @param {string} token Access token.
 * @returns {AppThunk} Thunk Action.
 */
export const refreshSessionData = (token) => {
  return async (dispatch) => {
    try {
      const payload = {
        token: token,
      };
      const responseData = await tradeApi.sessionDataGet(payload);
      const action = {
        type: REFRESH_SESSION_DATA,
        payload: responseData,
      };

      dispatch(action);
    } catch (e) {
      dispatch(showErrorAlert(e));
    }
  };
};

/**
 * Set currently used app version.
 *
 * Triggers at the moment when app was loaded so we can identify which app
 * version is loaded in browser memory and perform automatic refresh when new
 * release was launched.
 *
 * @param {string} version Semantic version number.
 * @returns {*} Set version action object.
 */
export const setAppVersion = (version) => {
  return {
    type: SET_APP_VERSION,
    payload: version,
  };
};

export const clearSessionData = () => {
  return {
    type: CLEAR_SESSION_DATA,
  };
};

import { unsetUser, getUserData } from "./user";
import { unsetProvider } from "./views";
import { showErrorAlert } from "./ui";
import { assign } from "lodash";
import tradeApi from "../../services/tradeApiClient";
import gtmPushApi from "../../utils/gtmPushApi";
import { endLiveSession, startLiveSession } from "../../utils/liveSessionApi";
import { analyticsTrigger } from "utils/analyticsJsApi";
import { toggleBalanceBox } from "./settings";

export const START_TRADE_API_SESSION = "START_TRADE_API_SESSION";
export const END_TRADE_API_SESSION = "END_TRADE_API_SESSION";
export const REFRESH_SESSION_DATA = "REFRESH_SESSION_DATA_ACTION";
export const CLEAR_SESSION_DATA = "CLEAR_SESSION_DATA_ACTION";
export const SET_APP_VERSION = "SET_APP_VERSION";

/**
 * @typedef {import("../../services/tradeApiClient.types").UserLoginPayload} UserLoginPayload
 * @typedef {import("../../services/tradeApiClient.types").UserRegisterPayload} UserRegisterPayload
 * @typedef {import("../../services/tradeApiClient.types").LoginResponse} LoginResponse
 * @typedef {import("../../services/tradeApiClient.types").TwoFAPayload} TwoFAPayload
 * @typedef {import('../../store/store').AppThunk} AppThunk
 * @typedef {import('redux').AnyAction} AnyAction
 */

/**
 * @param {LoginResponse} response User login payload.
 * @param {'login'|'signup'} eventType User event.
 * @returns {AppThunk} return action object.
 */
export const startTradeApiSession = (response, eventType) => {
  return async (dispatch) => {
    if (!response.token) return;
    tradeApi.setToken(response.token);

    const action = {
      type: START_TRADE_API_SESSION,
      payload: response,
    };

    dispatch(action);
    dispatch(refreshSessionData(response.token));
    dispatch(getUserData(response.token, true, (data) => initExternalWidgets(data, eventType)));
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
      dispatch(toggleBalanceBox(false));
      tradeApi.setToken();
    } catch (e) {
      dispatch(showErrorAlert(e));
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
 * Function to initialize enternal widgets like GTM, AnalyticsJS etc
 *
 * @param {UserEntity} userData user data.
 * @param {'login'|'signup'} eventType event type.
 * @returns {void}
 */
export const initExternalWidgets = (userData, eventType) => {
  const { gtmEvent } = gtmPushApi();
  const gtmpEventType = {
    event: eventType,
  };

  // @ts-ignore
  if (gtmEvent) {
    gtmEvent.push(assign(gtmpEventType, userData));
  }

  analyticsTrigger(userData, eventType);

  if (eventType === "signup") {
    startLiveSession(userData);
  }
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

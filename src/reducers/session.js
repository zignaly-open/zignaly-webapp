import { assign } from "lodash";
import initialState from "../store/initialState";
import {
  SET_APP_VERSION,
  START_TRADE_API_SESSION,
  END_TRADE_API_SESSION,
  REFRESH_SESSION_DATA,
  CLEAR_SESSION_DATA,
} from "../store/actions/session";

/**
 * @typedef {import("../store/initialState").DefaultStateSession} StateSessionType
 */

/**
 * @typedef {Object} ActionObject
 * @property {String} type
 * @property {*} payload
 */

/**
 * Settings reducer.
 *
 * @param {StateSessionType} state Current session state.
 * @param {ActionObject} action Action to reduce.
 * @returns {StateSessionType} New session state.
 */
const settings = (state = initialState.session, action) => {
  const newState = assign({}, state);

  switch (action.type) {
    case START_TRADE_API_SESSION:
      newState.tradeApi = { accessToken: action.payload.token };
      break;
    case END_TRADE_API_SESSION:
      newState.tradeApi = { accessToken: "" };
      break;
    case REFRESH_SESSION_DATA:
      newState.sessionData = action.payload;
      break;
    case CLEAR_SESSION_DATA:
      newState.sessionData = initialState.session.sessionData;
      break;
    case SET_APP_VERSION:
      newState.appVersion = action.payload;
      break;

    default:
      return state;
  }

  return newState;
};

export default settings;

import { assign } from "lodash";
import initialState from "../store/initialState";
import { START_TRADE_API_SESSION, END_TRADE_API_SESSION, ASK_2FA } from "../store/actions/session";

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
const settings = (state, action) => {
  const newState = assign({}, initialState.session, state);

  switch (action.type) {
    case START_TRADE_API_SESSION:
      newState.tradeApi.accessToken = action.payload.token;
      break;
    case END_TRADE_API_SESSION:
      newState.tradeApi.accessToken = "";
      break;
    case ASK_2FA:
      newState.tradeApi.ask2FA = action.payload;
      break;

    default:
      break;
  }

  return newState;
};

export default settings;

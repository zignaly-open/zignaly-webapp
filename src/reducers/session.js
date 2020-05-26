import { assign } from "lodash";
import initialState from "../store/initialState";
import { START_TRADE_API_SESSION } from "../store/actions/session";

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
  const newState = assign(initialState.session, state);

  switch (action.type) {
    case START_TRADE_API_SESSION:
      state.tradeApi.accessToken = action.payload.token;
      break;

    default:
      break;
  }

  return newState;
};

export default settings;

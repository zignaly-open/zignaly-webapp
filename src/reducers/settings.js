import initialState from "../store/initialState";
import { assign } from "lodash";

const SELECT_LANGUAGE = "SELECT_LANGUAGE_ACTION";
const SELECT_THEME = "SELECT_THEME_ACTION";

/**
 * @typedef {import("../store/initialState").DefaultStateSession} StateSessionType
 */

/**
 * @typedef {Object} ActionObject
 * @property {String} type
 * @property {*} payload
 */

/**
 * @typedef {Object} StateObject
 * @property {boolean} darkStyle
 * @property {String} languageCode
 */

/**
 * @param {StateSessionType} state Current session state.
 * @param {ActionObject} action Action to reduce.
 * @returns {StateSessionType} New session state.
 */
const settings = (state, action) => {
  const newState = assign(initialState.settings, state);

  switch (action.type) {
    case SELECT_LANGUAGE:
      newState.languageCode = action.payload;
      break;

    case SELECT_THEME:
      newState.darkStyle = action.payload;
      break;

    default:
      break;
  }

  return newState;
};

export default settings;

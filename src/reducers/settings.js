import initialState from "../store/initialState";
import { assign } from "lodash";

const SELECT_LANGUAGE = "SELECT_LANGUAGE_ACTION";
const SELECT_THEME = "SELECT_THEME_ACTION";

/**
 * @typedef {import("../store/initialState").DefaultStateSettings} StateSettingsType
 */

/**
 * @typedef {Object} ActionObject
 * @property {String} type
 * @property {*} payload
 */

/**
 * @param {StateSettingsType} state Current session state.
 * @param {ActionObject} action Action to reduce.
 * @returns {StateSettingsType} New session state.
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

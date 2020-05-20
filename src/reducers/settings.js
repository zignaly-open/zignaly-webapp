import initialState from "../store/initialState";

const SELECT_LANGUAGE = "SELECT_LANGUAGE_ACTION";
const SELECT_THEME = "SELECT_THEME_ACTION";

/**
 *
 * @typedef {Object} ActionObject
 * @property {String} type
 * @property {*} payload
 */

/**
 *
 * @typedef {Object} StateObject
 * @property {boolean} darkStyle
 * @property {String} languageCode
 */

/**
 *
 * @param {StateObject} state
 * @param {ActionObject} action
 */

const settings = (state = initialState.settings, action) => {
  switch (action.type) {
    case SELECT_LANGUAGE:
      state.languageCode = action.payload;
      return { ...state };
    case SELECT_THEME:
      state.darkStyle = action.payload;
      return { ...state };
    default:
      return { ...state };
  }
};

export default settings;

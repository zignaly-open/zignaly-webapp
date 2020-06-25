export const SELECT_LANGUAGE = "SELECT_LANGUAGE_ACTION";
export const SELECT_THEME = "SELECT_THEME_ACTION";
export const SET_DISPLAY_COLUMN = "SET_DISPLAY_COLUMN";
export const SET_SELECTED_EXCHANGE = "SET_SELECTED_EXCHANGE";
export const UNSET_SELECTED_EXCHANGE = "UNSET_SELECTED_EXCHANGE";
/**
 * @typedef {import('redux').AnyAction} AnyAction
 */

/**
 * Dark style flag selected by user.
 *
 * @param {Boolean} darkStyle
 */

export const selectDarkTheme = (darkStyle) => {
  return {
    type: SELECT_THEME,
    payload: darkStyle,
  };
};

/**
 * User's selected language.
 *
 * @param {String} langCode
 */

export const changeLanguage = (langCode) => {
  return {
    type: SELECT_LANGUAGE,
    payload: langCode,
  };
};

/**
 *
 * @typedef {import("../initialState").ExchangeConnectionEntity} ExchangeConnectionEntity
 */

/**
 *
 * @param {ExchangeConnectionEntity} payload Exchange connections object.
 * @returns {AnyAction} return action object.
 */
export const setSelectedExchange = (payload) => {
  return {
    type: SET_SELECTED_EXCHANGE,
    payload,
  };
};

export const unsetSelectedExchange = () => {
  return {
    type: UNSET_SELECTED_EXCHANGE,
  };
};

/**
 * User's display columns selection.
 *
 * @param {Object} payload
 * @returns {AnyAction} return action object.
 */
export const setDisplayColumn = (payload) => {
  return {
    type: SET_DISPLAY_COLUMN,
    payload,
  };
};

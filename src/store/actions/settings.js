export const SELECT_LANGUAGE = "SELECT_LANGUAGE_ACTION";
export const SELECT_THEME = "SELECT_THEME_ACTION";
export const TOGGLE_BALANCE_BOX = "TOGGLE_BALANCE_BOX_ACTION";
export const SET_DISPLAY_COLUMN = "SET_DISPLAY_COLUMN";
export const SET_SELECTED_EXCHANGE = "SET_SELECTED_EXCHANGE";
export const UNSET_SELECTED_EXCHANGE = "UNSET_SELECTED_EXCHANGE";
export const SET_SHOW_BALANCE = "SET_SHOW_BALANCE";
export const SET_ROWS_PER_PAGE = "SET_ROWS_PER_PAGE";
export const CONNECTED_COPYT_TIMEFRAME = "CONNECTED_COPYT_TIMEFRAME_ACTION";
export const CONNECTED_SIGNALP_TIMEFRAME = "CONNECTED_SIGNALP_TIMEFRAME_ACTION";
export const COPYT_TIMEFRAME = "COPYT_TIMEFRAME_ACTION";
export const SIGNALP_TIMEFRAME = "SIGNALP_TIMEFRAME_ACTION";
export const SIGNALP_SORT = "SIGNALP_SORT";
export const COPYT_SORT = "COPYT_SORT";

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
 * Dark style flag selected by user.
 *
 * @param {Boolean} flag
 */

export const toggleBalanceBox = (flag) => {
  return {
    type: TOGGLE_BALANCE_BOX,
    payload: flag,
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
 * @param {Object} payload payload.
 * @returns {AnyAction} return action object.
 */
export const setDisplayColumn = (payload) => {
  return {
    type: SET_DISPLAY_COLUMN,
    payload,
  };
};

/**
 * User rows per page table selection.
 *
 * @param {Object} payload payload.
 * @returns {AnyAction} return action object.
 */
export const setRowsPerPage = (payload) => {
  return {
    type: SET_ROWS_PER_PAGE,
    payload,
  };
};

/**
 * @param {number} payload Timeframe for the connected ct page.
 * @returns {AnyAction} return action object.
 */
export const setConnectedCopytTimeframe = (payload) => {
  return {
    type: CONNECTED_COPYT_TIMEFRAME,
    payload,
  };
};

/**
 * @param {number} payload Timeframe for the connected sp page.
 * @returns {AnyAction} return action object.
 */
export const setConnectedSignalTimeframe = (payload) => {
  return {
    type: CONNECTED_SIGNALP_TIMEFRAME,
    payload,
  };
};

/**
 * @param {number} payload Timeframe for the ct page.
 * @returns {AnyAction} return action object.
 */
export const setCopytTimeframe = (payload) => {
  return {
    type: COPYT_TIMEFRAME,
    payload,
  };
};

/**
 * @param {number} payload Timeframe for the sp page.
 * @returns {AnyAction} return action object.
 */
export const setSignalpTimeframe = (payload) => {
  return {
    type: SIGNALP_TIMEFRAME,
    payload,
  };
};

/**
 * @param {string} payload Sort for the sp page.
 * @returns {AnyAction} return action object.
 */
export const setCopytSort = (payload) => {
  return {
    type: COPYT_SORT,
    payload,
  };
};

/**
 * @param {string} payload Sort for the sp page.
 * @returns {AnyAction} return action object.
 */
export const setSignalpSort = (payload) => {
  return {
    type: SIGNALP_SORT,
    payload,
  };
};

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
export const SET_TIMEFRAME = "SET_TIMEFRAME";
export const SIGNALP_SORT = "SIGNALP_SORT";
export const COPYT_SORT = "COPYT_SORT";
export const SET_TERMINAL_PAIR = "SET_TERMINAL_PAIR";
export const SET_SORT = "SET_SORT";
export const SET_BROWSE_EXCHANGE = "SET_BROWSE_EXCHANGE";
export const SET_BROWSE_QUOTE = "SET_BROWSE_QUOTE";
export const SET_BROWSE_EXCHANGE_TYPE = "SET_BROWSE_EXCHANGE_TYPE";
export const SET_ANALYTICS_TIMEFRAME = "SET_ANALYTICS_TIMEFRAME";
export const SET_ANALYTICS_QUOTE = "SET_ANALYTICS_QUOTE";
export const SET_ANALYTICS_PAIR = "SET_ANALYTICS_PAIR";

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
 * @param {Object} payload Sort for the sp page.
 * @returns {AnyAction} return action object.
 */
export const setSort = (payload) => {
  return {
    type: SET_SORT,
    payload,
  };
};

/**
 * @param {string} payload Sort for the sp page.
 * @returns {AnyAction} return action object.
 */
export const setBrowseExchange = (payload) => {
  return {
    type: SET_BROWSE_EXCHANGE,
    payload,
  };
};

/**
 * @param {string} payload Sort for the sp page.
 * @returns {AnyAction} return action object.
 */
export const setBrowseQuote = (payload) => {
  return {
    type: SET_BROWSE_QUOTE,
    payload,
  };
};

/**
 * @param {string} payload Sort for the sp page.
 * @returns {AnyAction} return action object.
 */
export const setBrowseExchangeType = (payload) => {
  return {
    type: SET_BROWSE_EXCHANGE_TYPE,
    payload,
  };
};

/**
 * @param {Object} payload Sort for the sp page.
 * @returns {AnyAction} return action object.
 */
export const setTimeFrame = (payload) => {
  return {
    type: SET_TIMEFRAME,
    payload,
  };
};

/**
 * @param {Object} payload Sort for the sp page.
 * @returns {AnyAction} return action object.
 */
export const setAnayticsQuote = (payload) => {
  return {
    type: SET_ANALYTICS_QUOTE,
    payload,
  };
};

/**
 * @param {Object} payload Sort for the sp page.
 * @returns {AnyAction} return action object.
 */
export const setAnayticsPair = (payload) => {
  return {
    type: SET_ANALYTICS_PAIR,
    payload,
  };
};

/**
 * @param {Object} payload Sort for the sp page.
 * @returns {AnyAction} return action object.
 */
export const setTerminalPair = (payload) => {
  return {
    type: SET_TERMINAL_PAIR,
    payload,
  };
};

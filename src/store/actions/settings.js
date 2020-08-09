export const SELECT_LANGUAGE = "SELECT_LANGUAGE";
export const SELECT_THEME = "SELECT_THEME";
export const TOGGLE_BALANCE_BOX = "TOGGLE_BALANCE_BOX";
export const SET_DISPLAY_COLUMN = "SET_DISPLAY_COLUMN";
export const SET_SELECTED_EXCHANGE = "SET_SELECTED_EXCHANGE";
export const UNSET_SELECTED_EXCHANGE = "UNSET_SELECTED_EXCHANGE";
export const SET_SHOW_BALANCE = "SET_SHOW_BALANCE";
export const SET_ROWS_PER_PAGE = "SET_ROWS_PER_PAGE";
export const CONNECTED_COPYT_TIMEFRAME = "CONNECTED_COPYT_TIMEFRAME";
export const CONNECTED_SIGNALP_TIMEFRAME = "CONNECTED_SIGNALP_TIMEFRAME";
export const COPYT_TIMEFRAME = "COPYT_TIMEFRAME";
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
export const SET_ANALYTICS_BASE = "SET_ANALYTICS_BASE";

/**
 * @typedef {import('redux').AnyAction} AnyAction
 */

/**
 * @typedef {'signalp'|'copyt'} ProviderPageType
 * @typedef {'connectedSignalp'|'connectedCopyt'} ConnectedProviderPageType
 * @typedef {'signalpAnalytics'|'copytAnalytics'} AnalyticsPageType
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
 * @typedef {Object} SetSortPayload
 * @property {ProviderPageType} page
 * @property {string} sort
 *
 * @typedef {Object} SetSortAction
 * @property {typeof SET_SORT} type
 * @property {SetSortPayload} payload
 */

/**
 * @param {SetSortPayload} payload Set sort payload
 * @returns {SetSortAction} Action object
 */
export const setSort = (payload) => {
  return {
    type: SET_SORT,
    payload,
  };
};

/**
 * @typedef {Object} SetBrowseExchangeAction
 * @property {typeof SET_BROWSE_EXCHANGE} type
 * @property {string} payload
 */

/**
 * @param {string} payload Exchange
 * @returns {SetBrowseExchangeAction} Action object
 */
export const setBrowseExchange = (payload) => {
  return {
    type: SET_BROWSE_EXCHANGE,
    payload,
  };
};

/**
 * @typedef {Object} SetBrowseQuoteAction
 * @property {typeof SET_BROWSE_QUOTE} type
 * @property {string} payload
 */

/**
 * @param {string} payload Quote
 * @returns {SetBrowseQuoteAction} Action object
 */
export const setBrowseQuote = (payload) => {
  return {
    type: SET_BROWSE_QUOTE,
    payload,
  };
};

/**
 * @typedef {Object} SetBrowseExchangeTypeAction
 * @property {typeof SET_BROWSE_EXCHANGE_TYPE} type
 * @property {string} payload
 */

/**
 * @param {string} payload Exchange Type
 * @returns {SetBrowseExchangeTypeAction} Action object.
 */
export const setBrowseExchangeType = (payload) => {
  return {
    type: SET_BROWSE_EXCHANGE_TYPE,
    payload,
  };
};

/**
 * @typedef {Object} SetTimeFramePayload
 * @property {ProviderPageType|ConnectedProviderPageType|AnalyticsPageType} page
 * @property {string|number} timeFrame
 *
 * @typedef {Object} SetTimeFrameAction
 * @property {typeof SET_TIMEFRAME} type
 * @property {SetTimeFramePayload} payload
 */

/**
 * @param {SetTimeFramePayload} payload Set timeFrame Payload
 * @returns {SetTimeFrameAction} Action
 */
export const setTimeFrame = (payload) => {
  return {
    type: SET_TIMEFRAME,
    payload,
  };
};

/**
 * @typedef {Object} SetAnalyticsQuotePayload
 * @property {ProviderPageType} page
 * @property {string} quote
 *
 * @typedef {Object} SetAnalyticsQuoteAction
 * @property {typeof SET_ANALYTICS_QUOTE} type
 * @property {SetAnalyticsQuotePayload} payload
 */

/**
 * @param {SetAnalyticsQuotePayload} payload Quote for the analytics
 * @returns {SetAnalyticsQuoteAction} return action object.
 */
export const setAnayticsQuote = (payload) => {
  return {
    type: SET_ANALYTICS_QUOTE,
    payload,
  };
};

/**
 * @typedef {{page: ProviderPageType, base: string}} SetAnalyticsBasePayload
 *
 * @typedef {Object} SetAnalyticsBaseAction
 * @property {typeof SET_ANALYTICS_BASE} type
 * @property {SetAnalyticsBasePayload} payload
 */

/**
 * @param {SetAnalyticsBasePayload} payload Pair for the analytics
 * @returns {SetAnalyticsBaseAction} return action object.
 */
export const setAnayticsBase = (payload) => {
  return {
    type: SET_ANALYTICS_BASE,
    payload,
  };
};

/**
 * @typedef {Object} SetTerminalPairPayload
 * @property {string} exchangeId
 * @property {string} pair
 *
 * @typedef {Object} SetTerminalPairAction
 * @property {typeof SET_TERMINAL_PAIR} type
 * @property {SetTerminalPairPayload} payload
 */

/**
 * @param {SetTerminalPairPayload} payload Payload.
 * @returns {SetTerminalPairAction} Action.
 */
export const setTerminalPair = (payload) => {
  return {
    type: SET_TERMINAL_PAIR,
    payload,
  };
};

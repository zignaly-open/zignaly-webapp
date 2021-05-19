export const SELECT_LANGUAGE = "SELECT_LANGUAGE";
export const SELECT_THEME = "SELECT_THEME";
export const TOGGLE_BALANCE_BOX = "TOGGLE_BALANCE_BOX";
export const SET_DISPLAY_COLUMN = "SET_DISPLAY_COLUMN";
export const SET_SORT_COLUMN = "SET_SORT_COLUMN";
export const SET_RESPONSIVE_TABLE = "SET_RESPONSIVE_TABLE";
export const SET_SELECTED_EXCHANGE = "SET_SELECTED_EXCHANGE";
export const UNSET_SELECTED_EXCHANGE = "UNSET_SELECTED_EXCHANGE";
export const SET_SHOW_BALANCE = "SET_SHOW_BALANCE";
export const SET_ROWS_PER_PAGE = "SET_ROWS_PER_PAGE";
export const SET_TIMEFRAME = "SET_TIMEFRAME";
export const SET_SORT = "SET_SORT";
export const SET_FILTERS = "SET_FILTERS";
export const SET_TERMINAL_PAIR = "SET_TERMINAL_PAIR";
export const SET_TERMINAL_PROVIDER = "SET_TERMINAL_PROVIDER";
export const SET_MARKETPLACE_CACHE_MODAL = "SET_MARKETPLACE_CACHE_MODAL";

/**
 * @typedef {import('redux').AnyAction} AnyAction
 * @typedef {import('../initialState').Filters} Filters
 */

/**
 * @typedef {'signalp'|'copyt'|'profit'} ProviderPageType
 * @typedef {'connectedSignalp'|'connectedCopyt'|'connectedProfit'} ConnectedProviderPageType
 * @typedef {'signalpAnalytics'|'copytAnalytics'|'dashboardAnalytics'} AnalyticsPageType
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

export const setMarketplaceCacheModal = (flag) => {
  return {
    type: SET_MARKETPLACE_CACHE_MODAL,
    payload: flag,
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
 * @typedef {Object} SetSortColumnPayload
 * @property {string} name
 * @property {'asc'|'desc'} direction
 * @property {string} table
 *
 * @typedef {Object} SetSortColumnAction
 * @property {typeof SET_SORT_COLUMN} type
 * @property {SetSortColumnPayload} payload
 */

/**
 * @param {SetSortColumnPayload} payload Selected column for sorting
 * @returns {SetSortColumnAction} Action object
 */
export const setSortColumn = (payload) => {
  return {
    type: SET_SORT_COLUMN,
    payload,
  };
};

/**
 * @typedef {Object} SetResponsiveTablePayload
 * @property {boolean} responsive
 * @property {string} table
 *
 * @typedef {Object} SetResponsiveTableAction
 * @property {typeof SET_RESPONSIVE_TABLE} type
 * @property {SetResponsiveTablePayload} payload
 */

/**
 * @param {SetResponsiveTablePayload} payload Payload
 * @returns {SetResponsiveTableAction} Action object
 */
export const setResponsiveTable = (payload) => {
  return {
    type: SET_RESPONSIVE_TABLE,
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
 * @typedef {"copyt"|"signalp"|"dashboardPositions"|AnalyticsPageType} FilterPage
 * @typedef {Filters["copyt"|"dashboardPositions"|AnalyticsPageType]} Filter
 */

/**
 * @typedef {Object} SetFiltersPayload
 * @property {FilterPage} page
 * @property {Filter} filters
 *
 * @typedef {Object} SetFiltersAction
 * @property {typeof SET_FILTERS} type
 * @property {SetFiltersPayload} payload
 */

/**
 * @param {SetFiltersPayload} payload Payload
 * @returns {SetFiltersAction} Action object
 */
export const setFilters = (payload) => {
  return {
    type: SET_FILTERS,
    payload,
  };
};

/**
 * @typedef {Object} SetTimeFramePayload
 * @property {ProviderPageType|ConnectedProviderPageType} page
 * @property {number} timeFrame
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

/**
 * @typedef {Object} SetTerminalProviderAction
 * @property {typeof SET_TERMINAL_PROVIDER} type
 * @property {string} payload
 */

/**
 * @param {string} payload Payload.
 * @returns {SetTerminalProviderAction} Action.
 */
export const setTerminalProvider = (payload) => {
  return {
    type: SET_TERMINAL_PROVIDER,
    payload,
  };
};

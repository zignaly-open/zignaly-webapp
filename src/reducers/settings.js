import initialState from "../store/initialState";
import {
  SELECT_LANGUAGE,
  SET_SELECTED_EXCHANGE,
  SET_DISPLAY_COLUMN,
  SELECT_THEME,
  UNSET_SELECTED_EXCHANGE,
  TOGGLE_BALANCE_BOX,
  SET_ROWS_PER_PAGE,
  SET_ANALYTICS_QUOTE,
  SET_BROWSE_EXCHANGE,
  SET_TIMEFRAME,
  SET_BROWSE_QUOTE,
  SET_SORT,
  SET_TERMINAL_PAIR,
  SET_ANALYTICS_BASE,
  SET_BROWSE_EXCHANGE_TYPE,
} from "../store/actions/settings";
import { createReducer } from "@reduxjs/toolkit";

/**
 * @typedef {import("../store/initialState").DefaultStateSettings} StateSettingsType
 * @typedef {import("../store/initialState").DisplayColumns} DisplayColumns
 * @typedef {import("../store/actions/settings").SetAnalyticsBaseAction} SetAnalyticsBaseAction
 * @typedef {import("../store/actions/settings").SetAnalyticsQuoteAction} SetAnalyticsQuoteAction
 * @typedef {import("../store/actions/settings").SetTerminalPairAction} SetTerminalPairAction
 * @typedef {import("../store/actions/settings").SetTimeFrameAction} SetTimeFrameAction
 * @typedef {import("../store/actions/settings").SetSortAction} SetSortAction
 * @typedef {import("../store/actions/settings").SetBrowseExchangeTypeAction} SetBrowseExchangeTypeAction
 * @typedef {import("../store/actions/settings").SetBrowseExchangeAction} SetBrowseExchangeAction
 * @typedef {import("../store/actions/settings").SetBrowseQuoteAction} SetBrowseQuoteAction
 */

/**
 * @typedef {Object} ActionObject
 * @property {String} type
 * @property {*} payload
 */

/**
 * @returns {StateSettingsType} New settings state.
 */
const settings = createReducer(initialState.settings, {
  [SELECT_LANGUAGE]: (state, action) => {
    state.languageCode = action.payload;
  },

  [SELECT_THEME]: (state, action) => {
    state.darkStyle = action.payload;
  },

  [TOGGLE_BALANCE_BOX]: (state, action) => {
    state.balanceBox = action.payload;
  },

  [SET_SELECTED_EXCHANGE]: (state, action) => {
    state.selectedExchange = action.payload;
  },

  [UNSET_SELECTED_EXCHANGE]: (state) => {
    state.selectedExchange = initialState.settings.selectedExchange;
  },

  [SET_DISPLAY_COLUMN]: (state, action) => {
    /**
     * @type {keyof DisplayColumns} table
     */
    const table = action.payload.table;
    const { changedColumn, action: userAction } = action.payload;

    if (userAction === "add") {
      // Add column to displayed list
      state.displayColumns[table].push(changedColumn);
    } else {
      // Remove column to displayed list
      state.displayColumns[table] = state.displayColumns[table].filter((c) => c !== changedColumn);
    }
  },

  [SET_ROWS_PER_PAGE]: (state, action) => {
    const { table, numberOfRows } = action.payload;
    state.rowsPerPage = { ...state.rowsPerPage, [table]: numberOfRows };
  },

  [SET_BROWSE_QUOTE]: (state, /** @type {SetBrowseQuoteAction} */ action) => {
    state.copyt.browse.quote = action.payload;
  },

  [SET_BROWSE_EXCHANGE]: (state, /** @type {SetBrowseExchangeAction} */ action) => {
    state.copyt.browse.exchange = action.payload;
  },

  [SET_BROWSE_EXCHANGE_TYPE]: (state, /** @type {SetBrowseExchangeTypeAction} */ action) => {
    state.copyt.browse.exchangeType = action.payload;
  },

  [SET_SORT]: (state, /** @type {SetSortAction} */ action) => {
    const { page, sort } = action.payload;
    state.sort[page] = sort;
  },

  [SET_TIMEFRAME]: (state, /** @type {SetTimeFrameAction} */ action) => {
    const { page, timeFrame } = action.payload;
    // @ts-ignore Analytics timeframes use string instead of numbers
    state.timeFrame[page] = timeFrame;
  },

  [SET_ANALYTICS_QUOTE]: (state, /** @type {SetAnalyticsQuoteAction} */ action) => {
    const { page, quote } = action.payload;
    state[page].analytics.quote = quote;
  },

  [SET_ANALYTICS_BASE]: (state, /** @type {SetAnalyticsBaseAction} */ action) => {
    const { page, base } = action.payload;
    state[page].analytics.base = base;
  },

  [SET_TERMINAL_PAIR]: (state, /** @type {SetTerminalPairAction} */ action) => {
    const { exchangeId, pair } = action.payload;
    state.tradingTerminal.pair[exchangeId] = pair;
  },
});

export default settings;

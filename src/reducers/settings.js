import initialState from "../store/initialState";
import { assign } from "lodash";
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
  SET_ANALYTICS_PAIR,
  SET_BROWSE_EXCHANGE_TYPE,
} from "../store/actions/settings";
import { createReducer } from "@reduxjs/toolkit";

/**
 * @typedef {import("../store/initialState").DefaultStateSettings} StateSettingsType
 * @typedef {import("../store/initialState").DisplayColumns} DisplayColumns
 */

/**
 * @typedef {Object} ActionObject
 * @property {String} type
 * @property {*} payload
 */

/**
 * @typedef {'signalp'|'copyt'} ProviderPageType
 */

/**
 * @typedef {Object} SetAnalyticsQuote0
 * @property {'SET_ANALYTICS_QUOTE'} type
 * @property {{page: 'signalp', quote: string}} payload
 */

/**
 * @typedef {Object} SetAnalyticsPair
 * @property {ProviderPageType} page
 * @property {string} pair
 */

/**
 * @typedef {Object} SetAnalyticsQuote
 * @property {ProviderPageType} page
 * @property {string} quote
 */

/**
 * @param {StateSettingsType} state Current settings state.
 * @param {SetAnalyticsQuote|ActionObject} action Action to reduce.
 * @returns {StateSettingsType} New settings state.
 */
const settings = createReducer(initialState.settings, {
  SELECT_LANGUAGE: (state, action) => {
    state.languageCode = action.payload;
  },

  SELECT_THEME: (state, action) => {
    state.darkStyle = action.payload;
  },
  TOGGLE_BALANCE_BOX: (state, action) => {
    state.balanceBox = action.payload;
  },
  SET_SELECTED_EXCHANGE: (state, action) => {
    state.selectedExchange = action.payload;
  },
  UNSET_SELECTED_EXCHANGE: (state, action) => {
    state.selectedExchange = initialState.settings.selectedExchange;
  },

  SET_DISPLAY_COLUMN: (state, action) => {
    /**
     * @type {keyof DisplayColumns} table
     */
    const table = action.payload.table;
    const { changedColumn, action: userAction } = action.payload;

    if (userAction === "add") {
      //   Add column to displayed list
      state.displayColumns = {
        ...state.displayColumns,
        [table]: [...state.displayColumns[table], changedColumn],
      };
    } else {
      //   Remove column to displayed list
      state.displayColumns = {
        ...state.displayColumns,
        [table]: state.displayColumns[table].filter((c) => c !== changedColumn),
      };
    }
  },

  SET_ROWS_PER_PAGE: (state, action) => {
    const { table, numberOfRows } = action.payload;
    state.rowsPerPage = { ...state.rowsPerPage, [table]: numberOfRows };
  },

  SET_BROWSE_QUOTE: (state, action) => {
    state.copyt = {
      ...state.copyt,
      browse: { ...state.copyt.browse, quote: action.payload },
    };
  },

  SET_BROWSE_EXCHANGE: (state, action) => {
    state.copyt = {
      ...state.copyt,
      browse: { ...state.copyt.browse, exchange: action.payload },
    };
  },

  SET_BROWSE_EXCHANGE_TYPE: (state, action) => {
    state.copyt = {
      ...state.copyt,
      browse: { ...state.copyt.browse, exchangeType: action.payload },
    };
  },

  SET_SORT: (state, action) => {
    const { page, sort } = action.payload;
    state.sort = {
      ...state.sort,
      [page]: sort,
    };
  },

  SET_TIMEFRAME: (state, action) => {
    const { page, timeFrame } = action.payload;
    state.timeFrame = {
      ...state.timeFrame,
      [page]: timeFrame,
    };
  },

  SET_ANALYTICS_QUOTE: (state, action) => {
    // /** @type {{page: ProviderPageType, quote: string }} */
    /** @type {SetAnalyticsQuote} */
    const { page, quote } = action.payload;
    state[page].analytics.quote = quote;
  },

  SET_ANALYTICS_PAIR: (state, action) => {
    // /** @type {{page: ProviderPageType, pair: string }} */
    /** @type {SetAnalyticsPair} */
    const { page, pair } = action.payload;
    state[page].analytics.pair = pair;
  },

  SET_TERMINAL_PAIR: (state, action) => {
    const { exchange, pair } = action.payload;
    state.tradingTerminal = {
      ...state.tradingTerminal,
      pair: { ...state.tradingTerminal.pair, [exchange]: pair },
    };
  },
});

export default settings;

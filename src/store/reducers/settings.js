import initialState from "../initialState";
import {
  SELECT_LANGUAGE,
  SET_SELECTED_EXCHANGE,
  SET_DISPLAY_COLUMN,
  SET_SORT_COLUMN,
  SELECT_THEME,
  UNSET_SELECTED_EXCHANGE,
  TOGGLE_BALANCE_BOX,
  SET_ROWS_PER_PAGE,
  SET_TIMEFRAME,
  SET_SORT,
  SET_FILTERS,
  SET_RESPONSIVE_TABLE,
  SET_TERMINAL_PAIR,
  SET_TERMINAL_PROVIDER,
  SET_MARKETPLACE_CACHE_MODAL,
  SET_TEST_AB,
} from "../actions/settings";
import { createReducer } from "@reduxjs/toolkit";

/**
 * @typedef {import("../initialState").DefaultStateSettings} StateSettingsType
 * @typedef {import("../initialState").DisplayColumns} DisplayColumns
 * @typedef {import("../actions/settings").SetTimeFrameAction} SetTimeFrameAction
 * @typedef {import("../actions/settings").SetSortAction} SetSortAction
 * @typedef {import("../actions/settings").SetFiltersAction} SetFiltersAction
 * @typedef {import("../actions/settings").SetSortColumnAction} SetSortColumnAction
 * @typedef {import("../actions/settings").SetResponsiveTableAction} SetResponsiveTableAction
 * @typedef {import("../actions/settings").SetTerminalPairAction} SetTerminalPairAction
 * @typedef {import("../actions/settings").SetTerminalProviderAction} SetTerminalProviderAction
 * @typedef {import("../actions/settings").SetTestABAction} SetTestABAction
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
    state.locale = action.payload;
  },

  [SELECT_THEME]: (state, action) => {
    state.darkStyle = action.payload;
  },

  [SET_MARKETPLACE_CACHE_MODAL]: (state, action) => {
    state.disableCacheModal[action.payload] = true;
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

  [SET_SORT_COLUMN]: (state, /** @type {SetSortColumnAction} */ action) => {
    const { table, name, direction } = action.payload;
    state.sortColumns[table] = { name, direction };
  },

  [SET_RESPONSIVE_TABLE]: (state, /** @type {SetResponsiveTableAction} */ action) => {
    const { table, responsive } = action.payload;
    state.responsiveTables[table] = responsive;
  },

  [SET_ROWS_PER_PAGE]: (state, action) => {
    const { table, numberOfRows } = action.payload;
    state.rowsPerPage = { ...state.rowsPerPage, [table]: numberOfRows };
  },

  [SET_SORT]: (state, /** @type {SetSortAction} */ action) => {
    const { page, sort } = action.payload;
    state.sort[page] = sort;
  },

  [SET_FILTERS]: (state, /** @type {SetFiltersAction} */ action) => {
    const { page, filters } = action.payload;
    // @ts-ignore
    state.filters[page] = {
      ...state.filters[page],
      ...filters,
    };
  },

  [SET_TIMEFRAME]: (state, /** @type {SetTimeFrameAction} */ action) => {
    const { page, timeFrame } = action.payload;
    state.timeFrame[page] = timeFrame;
  },

  [SET_TERMINAL_PAIR]: (state, /** @type {SetTerminalPairAction} */ action) => {
    const { exchangeId, pair } = action.payload;
    state.tradingTerminal.pair[exchangeId] = pair;
  },

  [SET_TERMINAL_PROVIDER]: (state, /** @type {SetTerminalProviderAction} */ action) => {
    state.tradingTerminal.provider = action.payload;
  },

  [SET_TEST_AB]: (state, /** @type {SetTestABAction} */ action) => {
    const { page, enable } = action.payload;
    state.testAB[page] = enable;
  },
});

export default settings;

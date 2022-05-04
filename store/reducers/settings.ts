import initialState from "../initialState";
import {
  SELECT_LANGUAGE,
  SET_SELECTED_EXCHANGE,
  SET_SELECTED_SERVICE,
  SET_SORT_COLUMN,
  SELECT_THEME,
  SET_ROWS_PER_PAGE,
  SET_HIDDEN_COLUMN,
} from "../actions/settings";
import { createReducer } from "@reduxjs/toolkit";

const settings = createReducer(initialState.settings, {
  [SELECT_LANGUAGE]: (state, action) => {
    state.locale = action.payload;
  },

  [SELECT_THEME]: (state, action) => {
    state.darkStyle = action.payload;
  },

  [SET_SELECTED_EXCHANGE]: (state, action) => {
    state.selectedExchangeId = action.payload;
  },

  [SET_SELECTED_EXCHANGE]: (state, action) => {
    state.selectedExchangeId = action.payload;
  },

  [SET_SELECTED_SERVICE]: (state, action) => {
    state.selectedServiceId = action.payload;
  },

  [SET_HIDDEN_COLUMN]: (state, action) => {
    const { column, isHidden, table } = action.payload;

    if (isHidden) {
      state.hiddenColumns[table].push(column);
    } else {
      state.hiddenColumns[table] = state.hiddenColumns[table].filter((c) => c !== column);
    }
  },

  [SET_SORT_COLUMN]: (state, /** @type {SetSortColumnAction} */ action) => {
    const { table, name, direction } = action.payload;
    state.sortColumns[table] = { name, direction };
  },

  [SET_ROWS_PER_PAGE]: (state, action) => {
    const { table, numberOfRows } = action.payload;
    state.rowsPerPage = { ...state.rowsPerPage, [table]: numberOfRows };
  },
});

export default settings;

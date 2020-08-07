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
  CONNECTED_COPYT_TIMEFRAME,
  CONNECTED_SIGNALP_TIMEFRAME,
  COPYT_TIMEFRAME,
  SIGNALP_TIMEFRAME,
  COPYT_SORT,
  SIGNALP_SORT,
} from "../store/actions/settings";

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
 * @param {StateSettingsType} state Current settings state.
 * @param {ActionObject} action Action to reduce.
 * @returns {StateSettingsType} New settings state.
 */
const settings = (state = initialState.settings, action) => {
  const newState = assign({}, state);

  switch (action.type) {
    case SELECT_LANGUAGE:
      newState.languageCode = action.payload;
      break;

    case SELECT_THEME:
      newState.darkStyle = action.payload;
      break;
    case TOGGLE_BALANCE_BOX:
      newState.balanceBox = action.payload;
      break;
    case SET_SELECTED_EXCHANGE:
      newState.selectedExchange = action.payload;
      break;
    case UNSET_SELECTED_EXCHANGE:
      newState.selectedExchange = initialState.settings.selectedExchange;
      break;

    case SET_DISPLAY_COLUMN: {
      /**
       * @type {keyof DisplayColumns} table
       */
      const table = action.payload.table;
      const { changedColumn, action: userAction } = action.payload;

      if (userAction === "add") {
        //   Add column to displayed list
        newState.displayColumns = {
          ...newState.displayColumns,
          [table]: [...newState.displayColumns[table], changedColumn],
        };
      } else {
        //   Remove column to displayed list
        newState.displayColumns = {
          ...newState.displayColumns,
          [table]: newState.displayColumns[table].filter((c) => c !== changedColumn),
        };
      }
      break;
    }

    case SET_ROWS_PER_PAGE: {
      const { table, numberOfRows } = action.payload;
      newState.rowsPerPage = { ...newState.rowsPerPage, [table]: numberOfRows };
      break;
    }

    case CONNECTED_SIGNALP_TIMEFRAME:
      newState.timeFrame = { ...newState.timeFrame, connectedSignalp: action.payload };
      break;

    case CONNECTED_COPYT_TIMEFRAME:
      newState.timeFrame = { ...newState.timeFrame, connectedCopyt: action.payload };
      break;

    case COPYT_TIMEFRAME:
      newState.timeFrame = { ...newState.timeFrame, copyt: action.payload };
      break;

    case SIGNALP_TIMEFRAME:
      newState.timeFrame = { ...newState.timeFrame, signalp: action.payload };
      break;

    case COPYT_SORT:
      newState.sort = { ...newState.sort, copyt: action.payload };
      break;

    case SIGNALP_SORT:
      newState.sort = { ...newState.sort, signalp: action.payload };
      break;

    default:
      return state;
  }

  return newState;
};

export default settings;

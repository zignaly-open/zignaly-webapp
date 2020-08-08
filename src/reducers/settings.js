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

    case SET_BROWSE_QUOTE:
      newState.copyt = {
        ...newState.copyt,
        browse: { ...newState.copyt.browse, quote: action.payload },
      };
      break;

    case SET_BROWSE_EXCHANGE:
      newState.copyt = {
        ...newState.copyt,
        browse: { ...newState.copyt.browse, exchange: action.payload },
      };
      break;

    case SET_BROWSE_EXCHANGE_TYPE:
      newState.copyt = {
        ...newState.copyt,
        browse: { ...newState.copyt.browse, exchangeType: action.payload },
      };
      break;

    case SET_SORT: {
      const { page, sort } = action.payload;
      newState.sort = {
        ...newState.sort,
        [page]: sort,
      };
      break;
    }

    case SET_TIMEFRAME: {
      const { page, timeFrame } = action.payload;
      newState.timeFrame = {
        ...newState.timeFrame,
        [page]: timeFrame,
      };
      break;
    }

    case SET_ANALYTICS_QUOTE: {
      const { page, quote } = action.payload;
      newState[page] = {
        ...newState[page],
        analytics: { ...newState[page].analytics, quote },
      };
      break;
    }

    case SET_ANALYTICS_PAIR: {
      const { page, pair } = action.payload;
      newState[page] = {
        ...newState[page],
        analytics: { ...newState[page].analytics, pair },
      };
      break;
    }

    case SET_TERMINAL_PAIR: {
      const { exchange, pair } = action.payload;
      newState.tradingTerminal = {
        ...newState.tradingTerminal,
        pair: { ...newState.tradingTerminal.pair, [exchange]: pair },
      };
      break;
    }

    default:
      return state;
  }

  return newState;
};

export default settings;

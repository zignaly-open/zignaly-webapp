import initialState from "../store/initialState";
import { assign } from "lodash";
import {
  SHOW_LOADER,
  SHOW_ERROR_ALERT,
  HIDE_ERROR_ALERT,
  SHOW_SUCCESS_ALERT,
  HIDE_SUCCESS_ALERT,
  ASK_2FA,
  CONNECTED_COPYT_TIMEFRAME,
  CONNECTED_SIGNALP_TIMEFRAME,
  COPYT_TIMEFRAME,
  SIGNALP_TIMEFRAME,
  SHOW_BALANCE_LOADER,
} from "../store/actions/ui";

/**
 * @typedef {import("../store/initialState").DefaultUIObject} DefaultUIObject
 */

/**
 * @typedef {Object} ActionObject
 * @property {String} type
 * @property {*} payload
 */

/**
 * @param {DefaultUIObject} state Current settings state.
 * @param {ActionObject} action Action to reduce.
 * @returns {DefaultUIObject} New settings state.
 */
const ui = (state = initialState.ui, action) => {
  const newState = assign({}, state);

  switch (action.type) {
    case SHOW_LOADER:
      newState.loader = action.payload;
      break;

    case SHOW_ERROR_ALERT:
      newState.alerts = {
        ...newState.alerts,
        error: {
          ...action.payload,
          open: true,
        },
      };
      break;

    case HIDE_ERROR_ALERT:
      newState.alerts = {
        ...newState.alerts,
        error: {
          title: "",
          body: "",
          open: false,
        },
      };
      break;

    case SHOW_SUCCESS_ALERT:
      newState.alerts = {
        ...newState.alerts,
        success: {
          ...action.payload,
          open: true,
        },
      };
      break;

    case HIDE_SUCCESS_ALERT:
      newState.alerts = {
        ...newState.alerts,
        success: {
          title: "",
          body: "",
          open: false,
        },
      };
      break;

    case ASK_2FA:
      newState.ask2FA = action.payload;
      break;

    case CONNECTED_SIGNALP_TIMEFRAME:
      newState.timeFrame.connectedSignalp = action.payload;
      break;

    case CONNECTED_COPYT_TIMEFRAME:
      newState.timeFrame.connectedCopyt = action.payload;
      break;

    case COPYT_TIMEFRAME:
      newState.timeFrame.copyt = action.payload;
      break;

    case SIGNALP_TIMEFRAME:
      newState.timeFrame.signalp = action.payload;
      break;

    case SHOW_BALANCE_LOADER:
      newState.balanceLoader = action.payload;
      break;

    default:
      return state;
  }

  return newState;
};

export default ui;

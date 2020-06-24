import initialState from "../store/initialState";
import { assign } from "lodash";
import {
  OPEN_EXCHANGE_CONNECTION_VIEW,
  OPEN_SSETTINGS_VIEW,
  SHOW_LOADER,
  SHOW_ERROR_ALERT,
  HIDE_ERROR_ALERT,
  SHOW_SUCCESS_ALERT,
  HIDE_SUCCESS_ALERT,
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
const ui = (state, action) => {
  const newState = assign({}, initialState.ui, state);

  switch (action.type) {
    case OPEN_EXCHANGE_CONNECTION_VIEW:
      newState.modal.exchangeConnectionView = action.payload;
      break;
    case OPEN_SSETTINGS_VIEW:
      newState.modal.settingsView = action.payload;
      break;
    case SHOW_LOADER:
      newState.loader = action.payload;
      break;
    case SHOW_ERROR_ALERT:
      newState.alerts.error = { ...action.payload, open: true };
      break;
    case HIDE_ERROR_ALERT:
      newState.alerts.error = {
        title: "",
        body: "",
        open: false,
      };
      break;
    case SHOW_SUCCESS_ALERT:
      newState.alerts.success = { ...action.payload, open: true };
      break;
    case HIDE_SUCCESS_ALERT:
      newState.alerts.success = {
        title: "",
        body: "",
        open: false,
      };
      break;

    default:
      break;
  }

  return newState;
};

export default ui;

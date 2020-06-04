import initialState from "../store/initialState";
import { assign } from "lodash";
import { OPEN_EXCHANGE_CONNECTION_VIEW, OPEN_SSETTINGS_VIEW } from "../store/actions/ui";

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

    default:
      break;
  }

  return newState;
};

export default ui;

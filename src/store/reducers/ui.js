// @ts-nocheck
import initialState from "../initialState";
import { assign } from "lodash";
import {
  SHOW_LOADER,
  SHOW_ERROR_ALERT,
  HIDE_ERROR_ALERT,
  SHOW_SUCCESS_ALERT,
  HIDE_SUCCESS_ALERT,
  ASK_2FA,
  SHOW_CREATE_PROVIDER,
  SHOW_CREATE_TRADER,
  SHOW_GLOBAL_MODAL,
  OPEN_MODAL,
  CLOSE_MODAL,
} from "../actions/ui";

/**
 * @typedef {import("../initialState").DefaultUIObject} DefaultUIObject
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

    case SHOW_CREATE_PROVIDER:
      newState.modal = { ...newState.modal, createProvider: action.payload };
      break;

    case SHOW_CREATE_TRADER:
      newState.modal = { ...newState.modal, createTrader: action.payload };
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

    case SHOW_GLOBAL_MODAL:
      newState.modal = { ...state.modal, globalModal: action.payload };
      break;

    case OPEN_MODAL:
      newState.modal = {
        ...state.modal,
        modal: {
          id: action.payload.id,
          data: action.payload.data,
        }
      };
      break;

    case CLOSE_MODAL:
      newState.modal = {
        ...state.modal,
        modal: initialState.ui.modal.modal
      };
      break;

    default:
      return state;
  }

  return newState;
};

export default ui;

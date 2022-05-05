// @ts-nocheck
import initialState from "../initialState";
import { assign } from "lodash";
import {
  SHOW_ERROR_ALERT,
  HIDE_ERROR_ALERT,
  SHOW_SUCCESS_ALERT,
  HIDE_SUCCESS_ALERT,
  ASK_2FA,
  OPEN_MODAL,
  CLOSE_MODAL,
} from "../actions/ui";

const ui = (state = initialState.ui, action) => {
  const newState = assign({}, state);

  switch (action.type) {
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

    case OPEN_MODAL:
      newState.modal = {
        id: action.payload.id,
        data: action.payload.data,
      };
      break;

    case CLOSE_MODAL:
      newState.modal = initialState.ui.modal;
      break;

    default:
      return state;
  }

  return newState;
};

export default ui;

import { assign } from "lodash";
import initialState from "../initialState";
import {
  START_TRADE_API_SESSION,
  END_TRADE_API_SESSION,
  REFRESH_SESSION_DATA,
  CLEAR_SESSION_DATA,
} from "../actions/session";

const settings = (state = initialState.session, action) => {
  const newState = assign({}, state);

  switch (action.type) {
    case START_TRADE_API_SESSION:
      newState.tradeApi = { accessToken: action.payload };
      break;
    case END_TRADE_API_SESSION:
      newState.tradeApi = { accessToken: "" };
      break;
    case REFRESH_SESSION_DATA:
      newState.sessionData = action.payload;
      break;
    case CLEAR_SESSION_DATA:
      newState.sessionData = initialState.session.sessionData;
      break;

    default:
      return state;
  }

  return newState;
};

export default settings;

import { showErrorAlert } from "./ui";

export const START_TRADE_API_SESSION = "START_TRADE_API_SESSION";
export const END_TRADE_API_SESSION = "END_TRADE_API_SESSION";
export const REFRESH_SESSION_DATA = "REFRESH_SESSION_DATA_ACTION";
export const CLEAR_SESSION_DATA = "CLEAR_SESSION_DATA_ACTION";

export const startTradeApiSession = (token) => {
  return {
    type: START_TRADE_API_SESSION,
    payload: token,
  };
};

export const endTradeApiSession = () => {
  return {
    type: END_TRADE_API_SESSION,
  };
};

export const clearSessionData = () => {
  return {
    type: CLEAR_SESSION_DATA,
  };
};

export const setSessionData = (payload) => {
  return {
    type: REFRESH_SESSION_DATA,
    payload,
  };
};

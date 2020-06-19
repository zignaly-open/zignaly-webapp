import tradeApi from "../../services/tradeApiClient";
import { SET_SELECTED_EXCHANGE } from "./settings";
import initialState from "../initialState";

export const GET_USER_EXCHNAGES = "ADD_USER_EXCHNAGES_ACTION";
export const REMOVE_USER_EXCHNAGES = "REMOVE_USER_EXCHNAGES_ACTION";
export const GET_USER_BALANCE = "GET_USER_BALANCE_ACTION";
export const SET_USER_BALANCE_LOADER = "SET_USER_BALANCE_LOADER_ACTION";
export const REMOVE_USER_BALANCE = "REMOVE_USER_BALANCE_ACTION";
export const GET_DAILY_USER_BALANCE = "GET_DAILY_USER_BALANCE_ACTION";

/**
 * @typedef {import('../../services/tradeApiClient.types').ExchangeConnectionEntity} ExchangeConnectionEntity
 * @typedef {import('../../services/tradeApiClient.types').UserLoginResponse} UserLoginResponse
 * @typedef {import('../../services/tradeApiClient.types').AuthorizationPayload} AuthorizationPayload
 * @typedef {import("../../services/tradeApiClient.types").UserEquityPayload} UserEquityPayload
 * @typedef {import('../../store/store').AppThunk} AppThunk
 */

/**
 * Get user connected exchanges store thunk action.
 *
 * @param {AuthorizationPayload} payload Trade API user authorization.
 *
 * @returns {AppThunk} Thunk action function.
 */
export const setUserExchanges = (payload) => {
  return async (dispatch) => {
    try {
      const responseData = await tradeApi.userExchangesGet(payload);
      const action = {
        type: GET_USER_EXCHNAGES,
        payload: responseData,
      };

      const action2 = {
        type: SET_SELECTED_EXCHANGE,
        payload: responseData.length > 0 ? responseData[0] : initialState.settings.selectedExchange,
      };

      dispatch(action);
      dispatch(action2);
      /**
       * @type {import("../../services/tradeApiClient.types").UserEquityPayload}
       */
      let balancePayload = { ...payload, exchangeInternalId: action2.payload.internalId };
      dispatch(setDailyUserBalance(balancePayload));
      dispatch(setUserBalance(balancePayload));
    } catch (e) {
      alert(`ERROR: ${e.message}`);
    }
  };
};

export const unsetUserExchanges = () => {
  return {
    type: REMOVE_USER_EXCHNAGES,
  };
};

/**
 * Get user balance store thunk action.
 *
 * @param {UserEquityPayload} payload Trade API user authorization.
 *
 * @returns {AppThunk} Thunk action function.
 */
export const setUserBalance = (payload) => {
  return async (dispatch, getState) => {
    try {
      dispatch({
        type: SET_USER_BALANCE_LOADER,
      });
      const responseData = await tradeApi.userBalanceGet(payload);
      const action = {
        type: GET_USER_BALANCE,
        payload: responseData,
      };

      dispatch(action);
    } catch (e) {
      alert(`ERROR: ${e.message}`);
    }
  };
};

export const unsetUserBalance = () => {
  return {
    type: REMOVE_USER_BALANCE,
  };
};

/**
 * Get user balance store thunk action.
 *
 * @param {UserEquityPayload} payload Trade API user authorization.
 *
 * @returns {AppThunk} Thunk action function.
 */
export const setDailyUserBalance = (payload) => {
  return async (dispatch) => {
    try {
      const response = await tradeApi.userEquityGet(payload);
      const action = {
        type: GET_DAILY_USER_BALANCE,
        payload: response,
      };
      dispatch(action);
    } catch (e) {
      alert(`ERROR: ${e.message}`);
    }
  };
};

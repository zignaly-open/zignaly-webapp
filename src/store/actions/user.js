import tradeApi from "../../services/tradeApiClient";
import { setSelectedExchange } from "./settings";
import { showErrorAlert } from "./ui";

export const REMOVE_USER = "REMOVE_USER_ACTION";
export const GET_USER_BALANCE = "GET_USER_BALANCE_ACTION";
export const SET_USER_BALANCE_LOADER = "SET_USER_BALANCE_LOADER_ACTION";
export const REMOVE_USER_BALANCE = "REMOVE_USER_BALANCE_ACTION";
export const GET_DAILY_USER_BALANCE = "GET_DAILY_USER_BALANCE_ACTION";
export const REMOVE_USER_EXCHANGE = "REMOVE_USER_EXCHANGE";
export const SET_USER_DATA = "SET_USER_DATA_ACTION";
export const ENABLE_TWO_FA = "ENABLE_TWO_FA";
export const SET_DAILY_BALANCE_LOADER = "SET_DAILY_BALANCE_LOADER_ACTION";
export const ACTIVATE_SUBACCOUNT = "ACTIVATE_SUBACCOUNT";

/**
 * @typedef {import('../../services/tradeApiClient.types').ExchangeConnectionEntity} ExchangeConnectionEntity
 * @typedef {import('../../services/tradeApiClient.types').UserEntity} UserEntity
 * @typedef {import('../../services/tradeApiClient.types').AuthorizationPayload} AuthorizationPayload
 * @typedef {import('../../store/store').AppThunk} AppThunk
 * @typedef {import('redux').AnyAction} AnyAction
 */

/**
 * Get user connected exchanges store thunk action.
 *
 * @param {Array<ExchangeConnectionEntity>} responseData User exchanges
 *
 * @returns {AppThunk} Thunk action function.
 */
const initUserExchanges = (responseData) => {
  return async (dispatch, getState) => {
    try {
      const state = getState();
      let selectedExchangeId = null;
      if (responseData.length) {
        // @ts-ignore
        const storeSelectedExchange = state.settings.selectedExchange;
        const selectedExchangeIdSaved = storeSelectedExchange?.internalId;
        if (responseData.find((e) => e.internalId === selectedExchangeIdSaved)) {
          // Use last saved selected exchange
          selectedExchangeId = selectedExchangeIdSaved;
        } else {
          // If no exchange account saved, use the first one
          selectedExchangeId = responseData[0].internalId;
        }
      }
      dispatch(setSelectedExchange(selectedExchangeId));

      // If the user has any exchange account, query balance
      if (responseData.length > 0) {
        dispatch(getDailyUserBalance(selectedExchangeId));
      }
    } catch (e) {
      dispatch(showErrorAlert(e));
    }
  };
};

export const unsetUser = () => {
  return {
    type: REMOVE_USER,
  };
};

export const unsetUserBalance = () => {
  return {
    type: REMOVE_USER_BALANCE,
  };
};

/**
 * Remove exchange from user exchanges list.
 *
 * @param {string} internalId Exchange account internal id.
 * @returns {Object} return action object.
 */
export const removeUserExchange = (internalId) => {
  return {
    type: REMOVE_USER_EXCHANGE,
    payload: internalId,
  };
};

/**
 * Get user balance store thunk action.
 *
 * @param {string} exchangeInternalId exchangeInternalId
 *
 * @returns {AppThunk} Thunk action function.
 */
export const getDailyUserBalance = (exchangeInternalId) => {
  return async (dispatch) => {
    try {
      dispatch({
        type: SET_DAILY_BALANCE_LOADER,
      });
      const response = await tradeApi.userEquityGet(exchangeInternalId);
      const action = {
        type: GET_DAILY_USER_BALANCE,
        payload: response,
      };
      dispatch(action);
    } catch (e) {
      dispatch(showErrorAlert(e));
    }
  };
};

/**
 * Get user data store thunk action.
 *
 * @param {string} token User's access token
 * @param {boolean} [loadExchanges] Load user exchanges
 * @param {function(UserEntity): *} [callback] Callback function
 *
 * @returns {AppThunk} Thunk action function.
 */
export const getUserData = (token, loadExchanges = false, callback) => {
  return async (dispatch) => {
    try {
      if (token) {
        const responseData = await tradeApi.userDataGet();
        const action = {
          type: SET_USER_DATA,
          payload: responseData,
        };

        dispatch(action);
        if (callback) {
          callback(responseData);
        }
        if (loadExchanges) {
          dispatch(initUserExchanges(responseData.exchanges));
        }
      }
    } catch (e) {
      dispatch(showErrorAlert(e));
    }
  };
};

/**
 * Remove exchange from user exchanges list.
 *
 * @param {boolean} twoFAEnable Flag to enable 2 FA.
 * @returns {Object} return action object.
 */
export const enable2FA = (twoFAEnable) => {
  return {
    type: ENABLE_TWO_FA,
    payload: twoFAEnable,
  };
};

/**
 * Activate Sub Account
 *
 * @param {string} internalExchangeId Exchange account internal id
 * @returns {Object} Action object.
 */
export const activateSubAccount = (internalExchangeId) => {
  return {
    type: ACTIVATE_SUBACCOUNT,
    payload: internalExchangeId,
  };
};

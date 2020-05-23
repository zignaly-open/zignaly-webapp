import tradeApi from "../../services/tradeApiClient";
const GET_USER_EXCHNAGES = "ADD_USER_EXCHNAGES_ACTION";
const REMOVE_USER_EXCHNAGES = "REMOVE_USER_EXCHNAGES_ACTION";
const GET_USER_BALANCE = "GET_USER_BALANCE_ACTION";
const REMOVE_USER_BALANCE = "REMOVE_USER_BALANCE_ACTION";

/**
 *
 * @typedef {import('../../services/tradeApiClient.types').ExchangeConnectionEntity} ExchangeConnectionEntity
 * @typedef {import('../../services/tradeApiClient.types').UserLoginResponse} UserLoginResponse
 * @typedef {import('redux').Dispatch} Dispatch
 */

/**
 * Dark style flag selected by user.
 *
 * @param {UserLoginResponse} data
 * @param {Function} hideLoading
 */

export const setUserExchanges = (data, hideLoading) => {
  return async (dispatch) => {
    try {
      const sessionPayload = {
        token: data.token,
      };
      const responseData = await tradeApi.userExchangesGet(sessionPayload);
      hideLoading();
      dispatch({
        type: GET_USER_EXCHNAGES,
        payload: responseData,
      });
    } catch (e) {
      // TODO: Display error in alert.
      hideLoading();
    }
  };
};

export const unsetUserExchanges = () => {
  return {
    type: REMOVE_USER_EXCHNAGES,
  };
};

/**
 * Dark style flag selected by user.
 *
 * @param {UserLoginResponse} data
 */

export const setUserBalance = (data) => {
  return async (dispatch) => {
    try {
      const sessionPayload = {
        token: data.token,
      };
      const responseData = await tradeApi.userBalanceGet(sessionPayload);
      dispatch({
        type: GET_USER_BALANCE,
        payload: responseData,
      });
    } catch (e) {
      // TODO: Display error in alert.
    }
  };
};

export const unsetUserBalance = () => {
  return {
    type: REMOVE_USER_BALANCE,
  };
};

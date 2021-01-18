import initialState from "../initialState";
import {
  REMOVE_USER,
  GET_USER_BALANCE,
  REMOVE_USER_BALANCE,
  GET_DAILY_USER_BALANCE,
  SET_USER_BALANCE_LOADER,
  REMOVE_USER_EXCHANGE,
  GET_USER_DATA,
  ENABLE_TWO_FA,
  SET_DAILY_BALANCE_LOADER,
} from "../actions/user";
import { createReducer } from "@reduxjs/toolkit";

/**
 * @typedef {import("../initialState").UserObject} UserObject
 * @typedef {import('../../services/tradeApiClient.types').ExchangeConnectionEntity} ExchangeConnectionEntity
 */

/**
 * @typedef {Object} ActionObject
 * @property {String} type
 * @property {*} payload
 */

/**
 * @param {UserObject} state Current user state.
 * @param {ActionObject} action
 */

const user = createReducer(initialState.user, {
  [REMOVE_USER]: () => {
    return initialState.user;
  },

  [GET_USER_BALANCE]: (state, action) => {
    state.balance = action.payload;
  },

  [SET_USER_BALANCE_LOADER]: (state) => {
    state.balance = { ...state.balance, loading: true };
  },

  [REMOVE_USER_BALANCE]: (state) => {
    state.balance = initialState.user.balance;
  },

  [GET_DAILY_USER_BALANCE]: (state, action) => {
    state.dailyBalance = action.payload;
  },

  [GET_USER_DATA]: (state, action) => {
    state.userData = action.payload;
  },

  [REMOVE_USER_EXCHANGE]: (state, action) => {
    state.userData.exchanges = state.userData.exchanges.filter(
      (item) => item.internalId !== action.payload,
    );
  },

  [ENABLE_TWO_FA]: (state, action) => {
    state.userData = { ...state.userData, twoFAEnable: action.payload };
  },

  [SET_DAILY_BALANCE_LOADER]: (state) => {
    state.dailyBalance = { ...state.dailyBalance, loading: true };
  },
});

export default user;

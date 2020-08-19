import initialState from "../store/initialState";
import {
  SET_USER_EXCHANGES,
  REMOVE_USER,
  GET_USER_BALANCE,
  REMOVE_USER_BALANCE,
  GET_DAILY_USER_BALANCE,
  SET_USER_BALANCE_LOADER,
  REMOVE_USER_EXCHANGE,
  GET_USER_DATA,
  ENABLE_TWO_FA,
  SET_DAILY_BALANCE_LOADER,
} from "../store/actions/user";
import { createReducer } from "@reduxjs/toolkit";

/**
 * @typedef {import("../store/initialState").UserObject} UserObject
 * @typedef {import('../services/tradeApiClient.types').ExchangeConnectionEntity} ExchangeConnectionEntity
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
  [SET_USER_EXCHANGES]: (state, action) => {
    state.loaded = true;
    state.exchangeConnections = action.payload;
  },

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
    state.exchangeConnections = state.exchangeConnections.filter(
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

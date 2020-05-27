import { assign } from "lodash";
import initialState from "../store/initialState";

const GET_USER_EXCHNAGES = "ADD_USER_EXCHNAGES_ACTION";
const REMOVE_USER_EXCHNAGES = "REMOVE_USER_EXCHNAGES_ACTION";
const GET_USER_BALANCE = "GET_USER_BALANCE_ACTION";
const REMOVE_USER_BALANCE = "REMOVE_USER_BALANCE_ACTION";

/**
 * @typedef {import('../services/tradeApiClient.types').ExchangeConnectionEntity} ExchangeConnectionEntity
 * @typedef {import('../services/tradeApiClient.types').UserBalanceEntity} UserBalanceEntity
 */

/**
 * @typedef {Object} ActionObject
 * @property {String} type
 * @property {UserBalanceEntity} payload
 */

/**
 * @param {*} state
 * @param {ActionObject} action
 */

const userExchanges = (state, action) => {
  const newState = assign({}, initialState.user, state);

  switch (action.type) {
    case GET_USER_EXCHNAGES:
      newState.exchangeConnections = action.payload;
      break;

    case REMOVE_USER_EXCHNAGES:
      newState.exchangeConnections = [];
      break;

    case GET_USER_BALANCE:
      newState.balance = action.payload;
      break;

    case REMOVE_USER_BALANCE:
      newState.balance = {};
      break;

    default:
      break;
  }

  return newState;
};

export default userExchanges;

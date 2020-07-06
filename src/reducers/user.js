import { assign } from "lodash";
import initialState from "../store/initialState";
import {
  GET_USER_EXCHNAGES,
  REMOVE_USER_EXCHNAGES,
  GET_USER_BALANCE,
  REMOVE_USER_BALANCE,
  GET_DAILY_USER_BALANCE,
  SET_USER_BALANCE_LOADER,
  REMOVE_USER_EXCHANGE,
  GET_USER_DATA,
  ENABLE_TWO_FA,
} from "../store/actions/user";

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

const userExchanges = (state = initialState.user, action) => {
  const newState = assign({}, state);

  switch (action.type) {
    case GET_USER_EXCHNAGES:
      newState.exchangeConnections = action.payload;
      break;

    case REMOVE_USER_EXCHNAGES:
      newState.exchangeConnections = initialState.user.exchangeConnections;
      break;

    case GET_USER_BALANCE:
      newState.balance = action.payload;
      break;

    case SET_USER_BALANCE_LOADER:
      newState.balance = { ...newState.balance, loading: true };
      break;

    case REMOVE_USER_BALANCE:
      newState.balance = initialState.user.balance;
      break;

    case GET_DAILY_USER_BALANCE:
      newState.dailyBalance = action.payload;
      break;

    case GET_USER_DATA:
      newState.userData = action.payload;
      break;

    case REMOVE_USER_EXCHANGE:
      newState.exchangeConnections = newState.exchangeConnections.filter(
        (item) => item.internalId !== action.payload,
      );
      break;

    case ENABLE_TWO_FA:
      newState.userData = { ...newState.userData, TwoFAEnable: action.payload };
      break;

    default:
      return state;
  }

  return newState;
};

export default userExchanges;

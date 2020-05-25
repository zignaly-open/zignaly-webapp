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

const userExchanges = (state = initialState.user, action) => {
  switch (action.type) {
    case GET_USER_EXCHNAGES:
      state.exchangeConnections = action.payload;
      return { ...state };
    case REMOVE_USER_EXCHNAGES:
      state.exchangeConnections = [];
      return { ...state };
    case GET_USER_BALANCE:
      state.balance = action.payload;
      return { ...state };
    case REMOVE_USER_BALANCE:
      state.balance = {};
      return { ...state };
    default:
      return { ...state };
  }
};

export default userExchanges;

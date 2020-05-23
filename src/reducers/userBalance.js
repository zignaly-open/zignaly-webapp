const GET_USER_BALANCE = "GET_USER_BALANCE_ACTION";
const REMOVE_USER_BALANCE = "REMOVE_USER_BALANCE_ACTION";

/**
 *
 * @typedef {import('../services/tradeApiClient.types').UserBalanceEntity} UserBalanceEntity
 */

/**
 *
 * @typedef {Object} ActionObject
 * @property {String} type
 * @property {UserBalanceEntity} payload
 */

/**
 *
 * @param {*} state
 * @param {ActionObject} action
 */

const userBalance = (state = {}, action) => {
  switch (action.type) {
    case GET_USER_BALANCE:
      state = action.payload;
      return { ...state };
    case REMOVE_USER_BALANCE:
      state = {};
      return { ...state };
    default:
      return { ...state };
  }
};

export default userBalance;

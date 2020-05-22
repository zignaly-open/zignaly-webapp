const ADD_USER_EXCHNAGES = "ADD_USER_EXCHNAGES_ACTION";
const REMOVE_USER_EXCHNAGES = "REMOVE_USER_EXCHNAGES_ACTION";

/**
 *
 * @typedef {import('../services/tradeApiClient.types').ExchangeConnectionEntity} ExchangeConnectionEntity
 */

/**
 *
 * @typedef {Object} ActionObject
 * @property {String} type
 * @property {Array<ExchangeConnectionEntity>} payload
 */

/**
 *
 * @param {*} state
 * @param {ActionObject} action
 */

const settings = (state = [], action) => {
  switch (action.type) {
    case ADD_USER_EXCHNAGES:
      state = action.payload;
      return [...state];
    case REMOVE_USER_EXCHNAGES:
      state = [];
      return [...state];
    default:
      return [...state];
  }
};

export default settings;

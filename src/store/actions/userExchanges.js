const ADD_USER_EXCHNAGES = "ADD_USER_EXCHNAGES_ACTION";
const REMOVE_USER_EXCHNAGES = "REMOVE_USER_EXCHNAGES_ACTION";

/**
 *
 * @typedef {import('../../services/tradeApiClient.types').ExchangeConnectionEntity} ExchangeConnectionEntity
 */

/**
 * Dark style flag selected by user.
 *
 * @param {Array<ExchangeConnectionEntity>} data
 */

export const addUserExchanges = (data) => {
  return {
    type: ADD_USER_EXCHNAGES,
    payload: data,
  };
};

export const removeUserExchanges = () => {
  return {
    type: REMOVE_USER_EXCHNAGES,
  };
};

import initialState from "../store/initialState";

const USER_LOGIN = "USER_LOGIN_ACTION";

/**
 *
 * @typedef {Object} ActionObject
 * @property {String} type
 * @property {*} payload
 */

/**
 * @typedef {Object} DefaultStateSessionTradeApi
 * @property {string} accessToken
 */

/**
 * @typedef {Object} DefaultStateSessionCoinRay
 * @property {string} accessToken
 */

/**
 * @typedef {Object} DefaultStateSession
 * @property {DefaultStateSessionTradeApi} tradeApi
 * @property {DefaultStateSessionCoinRay} coinRay
 */

/**
 *
 * @param {DefaultStateSession} state
 * @param {ActionObject} action
 */

const settings = (state = initialState.session, action) => {
  switch (action.type) {
    case USER_LOGIN:
      state.tradeApi.accessToken = action.payload.token;
      return state;
    default:
      return state;
  }
};

export default settings;

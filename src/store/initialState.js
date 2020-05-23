/**
 * @typedef {import('../services/tradeApiClient.types').ExchangeConnectionEntity} ExchangeConnectionEntity
 */

/**
 * @typedef {Object} UserBalanceEntity
 * @property {Boolean} btcusdt
 * @property {String} profitPercentage
 * @property {String} totalInvested
 * @property {String} totalAssets
 * @property {String} totalOpen
 * @property {String} totalProfit
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
 * @typedef {Object} DefaultStateSettings
 * @property {String} languageCode
 * @property {Boolean} darkStyle
 */

/**
 * @typedef {Object} DefaultState
 * @property {DefaultStateSession} session
 * @property {DefaultStateSettings} settings
 * @property {Array<ExchangeConnectionEntity>} userExchanges
 * @property {UserBalanceEntity} userBalance
 */

/**
 * @type {DefaultState} initialState
 */
const initialState = {
  session: {
    tradeApi: {
      accessToken: "",
    },
    coinRay: {
      accessToken: "",
    },
  },
  settings: {
    languageCode: "en",
    darkStyle: false,
  },
  userExchanges: [],
  userBalance: {
    btcusdt: false,
    totalInvested: "",
    totalOpen: "",
    totalProfit: "",
    totalAssets: "",
    profitPercentage: "",
  },
};

export default initialState;

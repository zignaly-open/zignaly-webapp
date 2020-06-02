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
 * @typedef {import('../services/tradeApiClient.types').ExchangeConnectionEntity} ExchangeConnectionEntity
 * @typedef {import('../services/tradeApiClient.types').UserEquityEntity} UserEquityEntity
 */

/**
 * @typedef {Object} UserObject
 * @property {Array<ExchangeConnectionEntity>} exchangeConnections
 * @property {UserBalanceEntity} balance
 * @property {Array<UserEquityEntity>} dailyBalance
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
 * @typedef {Object} DisplayColumns
 * @property {Array<string>} spAnalytics
 * @property {Array<string>} ctAnalytics
 */

/**
 * @typedef {Object} DefaultStateSettings
 * @property {String} languageCode
 * @property {Boolean} darkStyle
 * @property {DisplayColumns} displayColumns
 * @property {ExchangeConnectionEntity} selectedExchange
 */

/**
 * @typedef {Object} DefaultUIModalObject
 * @property {Boolean} exchangeConnectionView
 */

/**
 * @typedef {Object} DefaultUIAlertsObject
 * @property {Object} success
 * @property {Object} error
 */

/**
 * @typedef {Object} DefaultUIObject
 * @property {DefaultUIModalObject} modal
 * @property {DefaultUIAlertsObject} alerts
 */

/**
 * @typedef {Object} DefaultState
 * @property {DefaultStateSession} session
 * @property {DefaultStateSettings} settings
 * @property {UserObject} user
 * @property {DefaultUIObject} ui
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
    displayColumns: {
      spAnalytics: [
        "name",
        "percentageProfit",
        "signals",
        "sumPositions",
        "winRate",
        "sumClosedPositions",
        "avgAverageClosingTime",
        "sumSoldBySignal",
        "sumSoldByStopLoss",
        "sumSoldByTakeProfit",
      ],
      ctAnalytics: [
        "name",
        "percentageProfit",
        "signals",
        "sumPositions",
        "winRate",
        "sumClosedPositions",
        "avgAverageClosingTime",
        "sumSoldBySignal",
        "sumSoldByStopLoss",
        "sumSoldByTakeProfit",
      ],
    },
    selectedExchange: {
      id: "",
      name: "",
      exchangeId: "",
      exchangeName: "",
      internalId: "",
      internalName: "",
      key: false,
      secret: false,
      areKeysValid: false,
      paperTrading: false,
      exchangeType: "",
      isTestnet: false,
      disable: false,
      positionSize: 0,
      managed: false,
      internal: false,
      isBrokerAccount: true,
      subAccountId: "",
      binanceBrokerId: "",
      checkAuthCount: 0,
    },
  },
  user: {
    exchangeConnections: [],
    balance: {
      btcusdt: false,
      totalInvested: "",
      totalOpen: "",
      totalProfit: "",
      totalAssets: "",
      profitPercentage: "",
    },
    dailyBalance: [],
  },
  ui: {
    modal: {
      exchangeConnectionView: false,
    },
    alerts: {
      success: {},
      error: {},
    },
  },
};

export default initialState;

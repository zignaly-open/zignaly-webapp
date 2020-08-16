/**
 * @typedef {Object} UserBalance
 * @property {Number} pnlBTC
 * @property {Number} pnlUSDT
 * @property {Number} totalBTC
 * @property {Number} totalFreeBTC
 * @property {Number} totalFreeUSDT
 * @property {Number} totalLockedBTC
 * @property {Number} totalLockedUSDT
 * @property {Number} totalUSDT
 * @property {Boolean} loading
 */

/**
 * @typedef {import('../services/tradeApiClient.types').ExchangeConnectionEntity} ExchangeConnectionEntity
 * @typedef {import('../services/tradeApiClient.types').DefaultDailyBalanceEntity} DefaultDailyBalanceEntity
 * @typedef {import('../services/tradeApiClient.types').UserEquityEntity} UserEquityEntity
 * @typedef {import('../services/tradeApiClient.types').DefaultProviderGetObject} DefaultProviderGetObject
 * @typedef {import('../services/tradeApiClient.types').UserEntity} UserEntity
 *
 */

/**
 * @typedef {Object} UserObject
 * @property {Array<ExchangeConnectionEntity>} exchangeConnections
 * @property {UserBalance} balance
 * @property {DefaultDailyBalanceEntity} dailyBalance
 * @property {UserEntity} userData
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
 * @typedef {Object} DefaultSessionData
 * @property {string} status
 * @property {number} validUntil
 */

/**
 * @typedef {Object} DefaultStateSession
 * @property {DefaultStateSessionTradeApi} tradeApi
 * @property {DefaultStateSessionCoinRay} coinRay
 * @property {DefaultSessionData} sessionData
 * @property {string} appVersion
 */

/**
 * @typedef {Object<string, Array<string>>} DisplayColumns
 */

/**
 * @typedef {Object<string, number>} RowsPerPage
 */

/**
 * @typedef {Object} BrowseSettings
 * @property {string} quote
 * @property {string} exchange
 * @property {string} exchangeType
 */

/**
 * @typedef {Object} AnalyticsSettings
 * @property {string} quote
 * @property {string} base
 */

/**
 * @typedef {Object} CopytSettings
 * @property {BrowseSettings} browse
 * @property {AnalyticsSettings} analytics
 */

/**
 * @typedef {Object} SignalpSettings
 * @property {AnalyticsSettings} analytics
 */

/**
 * @typedef {Object} TradingTerminalSettings
 * @property {Object<string, string>} pair
 */

/**
 * @typedef {Object} DefaultStateSettings
 * @property {String} languageCode
 * @property {Boolean} darkStyle
 * @property {Boolean} balanceBox
 * @property {DisplayColumns} displayColumns
 * @property {RowsPerPage} rowsPerPage
 * @property {ExchangeConnectionEntity} selectedExchange
 * @property {TimeframeObject} timeFrame
 * @property {SortObject} sort
 * @property {CopytSettings} copyt
 * @property {SignalpSettings} signalp
 * @property {TradingTerminalSettings} tradingTerminal
 */

/**
 * @typedef {Object} DefaultUIModalObject
 * @property {Boolean} twoFA
 * @property {Boolean} createProvider
 * @property {Boolean} globalModal
 */

/**
 * @typedef {Object} AlertObject
 * @property {Boolean} open
 * @property {String} title
 * @property {String} body
 */

/**
 * @typedef {Object} DefaultUIAlertsObject
 * @property {AlertObject} success
 * @property {AlertObject} error
 */

/**
 * @typedef {Object} TimeframeObject
 * @property {Number} connectedCopyt
 * @property {Number} connectedSignalp
 * @property {Number} copyt
 * @property {Number} signalp
 * @property {string} signalpAnalytics
 * @property {string} copytAnalytics
 */

/**
 * @typedef {Object} SortObject
 * @property {string} copyt
 * @property {string} signalp
 */

/**
 * @typedef {Object} DefaultUIObject
 * @property {DefaultUIModalObject} modal
 * @property {DefaultUIAlertsObject} alerts
 * @property {Boolean} loader
 * @property {Boolean} ask2FA
 * @property {Boolean} balanceLoader
 */

/**
 * @typedef {Object} DefaultViewsObject
 * @property {DefaultProviderGetObject} provider
 */

/**
 * @typedef {Object} DefaultState
 * @property {DefaultStateSession} session
 * @property {DefaultStateSettings} settings
 * @property {UserObject} user
 * @property {DefaultUIObject} ui
 * @property {DefaultViewsObject} views
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
    sessionData: {
      status: "",
      validUntil: 0,
    },
    appVersion: "",
  },
  settings: {
    languageCode: "en",
    darkStyle: false,
    balanceBox: false,
    rowsPerPage: {},
    displayColumns: {
      signalpAnalytics: [
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
      copytAnalytics: [
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
      dailyBalance: [
        "date",
        "totalUSDT",
        "totalFreeUSDT",
        "totalLockedUSDT",
        "totalBTC",
        "totalFreeBTC",
        "totalLockedBTC",
        "freeETH",
        "freeBNB",
        "col.availablePercentage",
        "col.investedPercentage",
      ],
      exchangeAssets: [
        "coin",
        "name",
        "balanceTotal",
        "balanceFree",
        "balanceLocked",
        "balanceTotalBTC",
        "balanceTotalUSDT",
      ],
      copytProfileUsers: [
        "userId",
        "email",
        "name",
        "active",
        "connected",
        "allocatedBalance",
        "suspended",
        "profitsFromClosedBalance",
        "lastTransactionId",
        "modify",
        "cancel",
        "cancelDate",
        "code",
        "realExchangeConnected",
      ],
      openPositions: [
        "openDateReadable",
        "providerLogo",
        "pair",
        "sellPrice",
        "profit",
        "profitPercentage",
        "positionSizeQuote",
        "updating",
      ],
      openEditPositions: [
        "openDateReadable",
        "status",
        "providerLogo",
        "pair",
        "sellPrice",
        "profit",
        "profitPercentage",
        "positionSizeQuote",
        "updating",
      ],
      closedPositions: [
        "openDateReadable",
        "closeDataRedable",
        "providerLogo",
        "pair",
        "buyPrice",
        "sellPrice",
        "remainAmount",
        "positionSizeQuote",
        "risk",
        "fees",
        "netProfitPercentage",
        "netProfit",
        "updating",
      ],
      logPositions: [
        "openDateReadable",
        "type",
        "providerLogo",
        "status",
        "pair",
        "positionSizeQuote",
        "updating",
      ],
      profileOpenPositions: [
        "openDateReadable",
        "pair",
        "buyPrice",
        "leverage",
        "unrealizedProfitLosses",
        "unrealizedProfitLossesPercentage",
        "priceDifference",
        "side",
        "amount",
        "positionSizeQuote",
        "risk",
        "updating",
        "cancel",
      ],
      profileClosedPositions: [
        "remainAmount",
        "pair",
        "buyPrice",
        "closeDataRedable",
        "exchange",
        "leverage",
        "openDateReadable",
        "positionSize",
        "returnFromAllocated",
        "returnFromInvestment",
        "amount",
        "side",
        "status",
      ],
      depositHistory: ["status", "currency", "amount", "timestamp", "txid"],
      withdrawHistory: ["status", "currency", "amount", "timestamp", "txid"],
      convertAssets: [
        "coin",
        "balanceFree",
        "balanceFreeBTC",
        "balanceFreeUSDT",
        "balanceTotalExchCoin",
      ],
      managementPositions: [
        "subPositions",
        "providerName",
        "copyTradingTotals.totalPositions",
        "copyTradingTotals.soldPositions",
        "pair",
        "sellPrice",
        "profit",
        "profitPercentage",
        "positionSizeQuote",
        "updating",
      ],
      ordersTable: [
        "col.orders.orderid",
        "col.positionid",
        "col.orders.symbol",
        "col.amount",
        "col.orders.price",
        "col.side",
        "col.orders.type",
        "col.orders.datetime",
        "col.cancel",
      ],
      contractsTable: [
        "col.positionid",
        "col.orders.symbol",
        "col.amount",
        "col.leverage",
        "col.contracts.liquidationprice",
        "col.side",
        "col.entryprice",
        "col.contracts.markprice",
        "col.contracts.margin",
        "col.cancel",
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
      isBrokerAccount: false,
      subAccountId: "",
      binanceBrokerId: "",
      checkAuthCount: 0,
      globalDelisting: false,
      globalBlacklist: false,
      globalMaxPositions: false,
      globalMinVolume: false,
      globalPositionsPerMarket: false,
      globalWhitelist: false,
      balanceSynced: false,
    },
    timeFrame: {
      connectedCopyt: null,
      connectedSignalp: null,
      copyt: null,
      signalp: null,
      copytAnalytics: null,
      signalpAnalytics: null,
    },
    sort: {
      copyt: null,
      signalp: null,
    },
    copyt: {
      browse: { quote: null, exchange: null, exchangeType: null },
      analytics: { quote: null, base: null },
    },
    signalp: {
      analytics: { quote: null, base: null },
    },
    tradingTerminal: { pair: {} },
  },
  user: {
    exchangeConnections: [],
    balance: {
      pnlBTC: 0,
      pnlUSDT: 0,
      totalBTC: 0,
      totalFreeBTC: 0,
      totalFreeUSDT: 0,
      totalLockedBTC: 0,
      totalLockedUSDT: 0,
      totalUSDT: 0,
      loading: false,
    },
    dailyBalance: {
      balances: [],
      quotes: [],
      loading: false,
    },
    userData: {
      ask2FA: false,
      twoFAEnable: false,
      binanceConnected: false,
      buysCount: 0,
      createdAt: "",
      dashlyEchoAuth: "",
      dashlyHash: "",
      email: "",
      firstName: "",
      isAdmin: null,
      minimumProviderSettings: true,
      onboarding: { finished: false, paused: true, step: "2" },
      planId: "",
      planName: "",
      planType: "",
      projectId: "",
      providerEnable: true,
      ref: "",
      refCode: "",
      sellsCount: 0,
      status: 0,
      subscribe: false,
      token: "",
      userId: "",
    },
  },
  ui: {
    modal: {
      twoFA: false,
      createProvider: false,
      globalModal: false,
    },
    alerts: {
      success: {
        title: "",
        body: "",
        open: false,
      },
      error: {
        title: "",
        body: "",
        open: false,
      },
    },
    loader: false,
    ask2FA: false,
    balanceLoader: false,
  },
  views: {
    provider: {
      connected: false,
      copyTradingQuote: "",
      description: "",
      disable: false,
      exchangeInternalId: "",
      exchangeType: "",
      exchanges: [""],
      fee: "",
      hasBeenUsed: false,
      hasRecommendedSettings: false,
      id: "",
      internalPaymentInfo: {
        isPremium: true,
        merchantId: "",
        price: 0,
        trial: 0,
        ipnSecret: "",
      },
      isAdmin: false,
      isClone: false,
      isCopyTrading: false,
      key: false,
      list: false,
      logoUrl: "",
      longDesc: "",
      minAllocatedBalance: 0,
      name: "",
      options: {
        acceptUpdateSignal: false,
        allowSendingBuyOrdersAsMarket: false,
        balanceFilter: false,
        enablePanicSellSignals: false,
        enableSellSignals: false,
        limitPriceFromSignal: false,
        reBuyFromProvider: false,
        reBuysFromSignal: false,
        reUseSignalIdIfClosed: false,
        riskFilter: false,
        stopLossFromSignal: false,
        successRateFilter: false,
        takeProfitsFromSignal: false,
        terms: false,
        trailingStopFromSignal: false,
        useLeverageFromSignal: false,
        customerKey: false,
        allowClones: true,
        disclaimer: "",
      },
      public: false,
      shortDesc: "",
      userPaymentInfo: { userId: "" },
      website: "",
      allocatedBalance: 0,
      allocatedBalanceUpdatedAt: { $date: { $numberlong: "" } },
      balanceFilter: false,
      clonedFrom: { $oid: "" },
      createdAt: "",
      enableInProvider: false,
      originalBalance: "",
      profitsFromClosedBalance: "0",
      reBuyFromProvider: false,
      riskFilter: false,
      successRateFilter: false,
      terms: false,
      team: [{ name: "", countryCode: "" }],
      social: [{ network: "", link: "" }],
      about: "",
      performance: {
        closePositions: 0,
        weeklyStats: [{ week: 0, return: 0, day: "", positions: 0 }],
        openPositions: 0,
        totalBalance: 0,
        totalTradingVolume: 0,
      },
      strategy: "",
      avgHoldingTime: 0,
      activeSince: 0,
      avgTradesPerWeek: 0,
      profitableWeeks: 0,
      followers: 0,
      stripe: {
        cancelAtPeriodEnd: false,
        cancelDate: "",
        email: "",
        enable: false,
        paymentGateway: "",
        trialStartedAt: "",
      },
      acceptUpdateSignal: false,
      allowSendingBuyOrdersAsMarket: false,
      customerKey: "",
      disclaimer: false,
      enablePanicSellSignals: false,
      enableSellSignals: false,
      limitPriceFromSignal: false,
      limitReBuys: "",
      long: false,
      mid: false,
      quantityPercentage: 0,
      reBuyAll: false,
      reBuyFirst: false,
      reBuyLast: false,
      reBuysFromSignal: false,
      reUseSignalIdIfClosed: false,
      risk: "",
      short: false,
      shortmid: false,
      stopLossFromSignal: false,
      successRate: "",
      takeProfitAll: false,
      takeProfitFirst: false,
      takeProfitLast: false,
      takeProfitsFromSignal: false,
      trailingStopFromSignal: false,
      useLeverageFromSignal: false,
      price: 0,
      loading: false,
    },
  },
};

export default initialState;

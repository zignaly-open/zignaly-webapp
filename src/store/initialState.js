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
 */

/**
 * @typedef {Object} UserObject
 * @property {UserBalance} balance
 * @property {DefaultDailyBalanceEntity} dailyBalance
 * @property {UserEntity} userData
 * @property {boolean} loaded
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
 * @property {'login'|'signup'|''} initEvent
 */

/**
 * @typedef {Object} DefaultStateSession
 * @property {DefaultStateSessionTradeApi} tradeApi
 * @property {DefaultStateSessionCoinRay} coinRay
 * @property {DefaultSessionData} sessionData
 * @property {string} appVersion
 */

/**
 * @typedef {Object} SortColumnType
 * @property {string} name
 * @property {'asc'|'desc'} direction
 */

/**
 * @typedef {Object<string, Array<string>>} DisplayColumns
 * @typedef {Object<string, SortColumnType>} SortColumns
 * @typedef {Object<string, boolean>} ResponsiveTables
 */

/**
 * @typedef {Object<string, number>} RowsPerPage
 */

/**
 * @typedef {Object} BrowseFilters
 * @property {string} [quote]
 * @property {string} exchange
 * @property {string} exchangeType
 * @property {string} fromUser
 */

/**
 * @typedef {Object} SignalPBrowseFilters
 * @property {string} [fromUser]
 */

/**
 * @typedef {Object} AnalyticsFilters
 * @property {string} quote
 * @property {string} base
 * @property {string} timeFrame
 */

/**
 * @typedef {Object} OptionTypeStr
 * @property {string} label
 * @property {string} val
 */

/**
 * @typedef {Object} DashboardAnalyticsFilters
 * @property {string} timeFrame
 * @property {string} quote
 * @property {OptionTypeStr} provider
 */

/**
 * @typedef {Object} DashboardPositionsFilters
 * @property {string} providerId
 * @property {string} pair
 * @property {string} side
 * @property {string} type
 * @property {string} status
 */

/**
 * @typedef {Object} Filters
 * @property {DashboardAnalyticsFilters} dashboardAnalytics
 * @property {DashboardPositionsFilters} dashboardPositions
 * @property {BrowseFilters} copyt
 * @property {BrowseFilters} profit
 * @property {SignalPBrowseFilters} signalp
 * @property {AnalyticsFilters} copytAnalytics
 * @property {AnalyticsFilters} signalpAnalytics
 */

/**
 * @typedef {Object} TradingTerminalSettings
 * @property {Object<string, string>} pair
 * @property {string} provider
 */

/**
 * @typedef {Object} DefaultStateSettings
 * @property {String} languageCode
 * @property {Boolean} darkStyle
 * @property {Boolean} balanceBox
 * @property {DisplayColumns} displayColumns
 * @property {SortColumns} sortColumns
 * @property {ResponsiveTables} responsiveTables
 * @property {RowsPerPage} rowsPerPage
 * @property {ExchangeConnectionEntity} selectedExchange
 * @property {TimeframeObject} timeFrame
 * @property {SortObject} sort
 * @property {Filters} filters
 * @property {TradingTerminalSettings} tradingTerminal
 */

/**
 * @typedef {Object} DefaultUIModalObject
 * @property {Boolean} twoFA
 * @property {Boolean} createProvider
 * @property {Boolean} createTrader
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
 * @property {Number} connectedProfit
 * @property {Number} copyt
 * @property {Number} signalp
 * @property {Number} profit
 */

/**
 * @typedef {Object} SortObject
 * @property {string} copyt
 * @property {string} signalp
 * @property {string} profit
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
      initEvent: "",
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
      futuresDailyBalance: [
        "date",
        "col.dailyprofitlossUSDT",
        "col.cumprofitlossUSDT",
        "col.nettransferUSDT",
        "col.walletbalanceUSDT",
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
      profileProviderStats: [
        "dateReadable",
        "pair",
        "exchange",
        "averageEntryPrice",
        "i24HighPercentage",
        "i24LowPercentage",
        "i3DHighPercentage",
        "i3DLowPercentage",
        "iweekHighPercentage",
        "iweekLowPercentage",
        "imonthHighPercentage",
        "imonthLowPercentage",
        "i3MonthHighPercentage",
        "i3MonthLowPercentage",
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
        "profitsMode",
        "originalAllocated",
        "profitsShare",
        "retain",
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
        "amount",
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
        "orderId",
        "positionId",
        "symbol",
        "amount",
        "status",
        "price",
        "side",
        "type",
        "datetimeReadable",
      ],
      contractsTable: [
        "positionId",
        "symbol",
        "amount",
        "leverage",
        "liquidationprice",
        "side",
        "entryprice",
        "markprice",
        "margin",
      ],
      providerOrders: [
        "orderId",
        "positionId",
        "symbol",
        "amount",
        "status",
        "price",
        "side",
        "type",
        "datetimeReadable",
      ],
      providerContracts: [
        "orderId",
        "positionId",
        "symbol",
        "amount",
        "status",
        "price",
        "side",
        "type",
        "datetimeReadable",
      ],
    },
    sortColumns: {},
    responsiveTables: {},
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
      connectedProfit: null,
      copyt: null,
      signalp: null,
      profit: null,
    },
    sort: {
      copyt: null,
      signalp: null,
      profit: null,
    },
    filters: {
      dashboardAnalytics: { timeFrame: "", quote: "", provider: null },
      dashboardPositions: { providerId: "", pair: "", side: "", type: "", status: "" },
      copyt: { quote: "", exchange: "", exchangeType: "", fromUser: "" },
      profit: { quote: "", exchange: "", exchangeType: "", fromUser: "" },
      signalp: { fromUser: "" },
      copytAnalytics: { quote: "", base: "", timeFrame: "" },
      signalpAnalytics: { quote: "", base: "", timeFrame: "" },
    },
    tradingTerminal: { pair: {}, provider: "" },
  },
  user: {
    loaded: false,
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
      email: "",
      firstName: "",
      isAdmin: null,
      providerEnable: true,
      sellsCount: 0,
      subscribe: false,
      token: "",
      userId: "",
      userName: "",
      imageUrl: "",
      hasActivated: false,
      isSupport: false,
      realExchangeConnected: false,
      demoExchangeConnected: false,
      exchanges: [],
    },
  },
  ui: {
    modal: {
      twoFA: false,
      createProvider: false,
      createTrader: false,
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
      disable: true,
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
        weeklyStats: [{ return: 0, day: "", positions: 0 }],
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
      signalProviderQuotes: [],
      profitSharing: false,
      profitsShare: 0,
      profitsMode: "",
      notificationsPosts: false,
      exchangeInternalIds: [],
    },
  },
};

export default initialState;

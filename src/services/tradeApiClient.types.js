import { assign, isArray, isObject } from "lodash";

/**
 * @typedef {Object} UserCreatePayload
 * @property {string} firstName User first name.
 * @property {string} email User email address.
 * @property {string} password User password.
 * @property {string} gRecaptchaResponse Google captcha response.
 */

/**
 * @typedef {Object} UserCreateResponse
 * @property {string} token User access token.
 */

/**
 * @typedef {Object} UserLoginPayload
 * @property {string} email
 * @property {string} password
 */

/**
 * @typedef {Object} UserLoginResponse
 * @property {string} token User access token.
 * @property {string} firstName User first name.
 * @property {string} email User email.
 * @property {boolean} ask2FA Indicates if 2FA should be asked.
 * @property {string} userId User ID.
 * @property {string} createdAt Creation timestamp: e.g. (2020-05-14T14:34:48).
 * @property {boolean} providerEnable Indicates if user is subscribed to signal providers.
 * @property {boolean} twoFAEnable Indicate if 2FA is enabled.
 * @property {boolean} ref
 * @property {boolean} subscribe
 * @property {boolean} isAdmin Indicate if user is administrator.
 * @property {boolean} binanceConnected Indicates if user has Binance exchange connected.
 * @property {number} buysCount Counts the number of buys positions.
 * @property {number} sellsCount Counts the number of sell positions.
 * @property {number} planId Reference of the Zignaly subscription plan.
 * @property {string} planName Name of the Zignaly plan that user is subscribed to.
 * @property {string} planType
 * @property {string} projectId
 * @property {boolean} minimumProviderSettings
 * @property {number} status Indicate if user is active or not.
 * @property {Onboarding} onboarding Indicate user onboarding stage.
 * @property {string} refCode
 */

/**
 * @typedef {Object} Onboarding
 * @property {boolean} finished
 * @property {boolean} paused
 * @property {number} step
 */

/**
 * @typedef {Object} AuthorizationPayload
 * @property {string} token
 */

/**
 * @typedef {Object} PositionEntity
 * @property {boolean} closed
 * @property {string} positionId
 * @property {string} userId
 * @property {string} openDate
 * @property {string} openTrigger
 * @property {string} closeDate
 * @property {string} closeTrigger
 * @property {string} pair
 * @property {string} base
 * @property {string} quote
 * @property {string} buyPrice
 * @property {string} sellPrice
 * @property {string} side
 * @property {string} amount
 * @property {string} remainAmount
 * @property {string} invested
 * @property {number} positionSizeQuote
 * @property {string} positionSize
 * @property {string} investedQuote
 * @property {string} profitPercentage
 * @property {number} profit
 * @property {string} quoteAsset
 * @property {number} stopLossPercentage
 * @property {number} stopLossPrice
 * @property {boolean} takeProfit
 * @property {number} trailingStopPercentage
 * @property {number} trailingStopTriggerPercentage
 * @property {boolean} trailingStopTriggered
 * @property {boolean} trailingStopPrice
 * @property {string} exchange
 * @property {string} exchangeInternalName
 * @property {string} symbol
 * @property {number} status
 * @property {string} statusDesc
 * @property {string} sellPlaceOrderAt
 * @property {boolean} checkStop
 * @property {string} provider
 * @property {boolean} sellByTTL
 * @property {number} buyTTL
 * @property {boolean} updating
 * @property {boolean} signalMetadata
 * @property {boolean} accounting
 * @property {string} providerId
 * @property {string} providerName
 * @property {string} signalTerm
 * @property {number} takeProfitTargetsCountFail
 * @property {number} takeProfitTargetsCountSuccess
 * @property {number} takeProfitTargetsCountPending
 * @property {number} reBuyTargetsCountFail
 * @property {number} reBuyTargetsCountSuccess
 * @property {number} reBuyTargetsCountPending
 * @property {boolean} isCopyTrading
 * @property {boolean} isCopyTrader
 * @property {string} signalId
 * @property {string} type
 * @property {boolean} copyTraderId
 * @property {boolean} paperTrading
 * @property {RealInvestment} realInvestment
 * @property {number} leverage
 * @property {string} internalExchangeId
 * @property {string} logoUrl
 * @property {Array<ReBuyTarget>} reBuyTargets
 */

/**
 * @typedef {Object} RealInvestment
 * @property {string} $numberDecimal
 */

/**
 * @typedef {Object} ReBuyTarget
 * @property {number} targetId
 * @property {number} triggerPercentage
 * @property {number} quantity
 * @property {boolean} buying
 * @property {boolean} done
 * @property {string} orderId
 * @property {boolean} cancel
 * @property {boolean} skipped
 * @property {string} buyType
 */

/**
 * @typedef {Array<PositionEntity>} UserPositionsCollection
 */

/**
 * @typedef {Array<UserLoginResponse>} UsersCollection
 */

/**
 * @typedef {Object} ProvidersPayload
 * @property {string} token
 */

/**
 * @typedef {Object} DailyReturn
 * @property {string} name
 * @property {number} [positions]
 * @property {string|number} returns
 * @property {string} [totalInvested]
 * @property {string} [totalProfit]
 * @property {boolean} ro
 */

/**
 * @typedef {Object} ProvidersStatsPayload
 * @property {string} token
 * @property {string} quote
 * @property {string} base
 * @property {string} timeFrame
 * @property {string} DCAFilter
 * @property {boolean} ro
 */

/**
 * @typedef {Object} ProviderEntity
 * @property {string} id
 * @property {string} name
 * @property {string} description
 * @property {string} shortDesc
 * @property {string} longDesc
 * @property {string|boolean} fee
 * @property {boolean} website
 * @property {Array<string>} exchanges
 * @property {boolean} key
 * @property {boolean} disable
 * @property {boolean} customerKey
 * @property {boolean} public
 * @property {boolean} hasRecommendedSettings
 * @property {string} logoUrl
 * @property {string} coin
 * @property {boolean} hasBeenUsed
 * @property {boolean} isClone
 * @property {boolean} isCopyTrading
 * @property {boolean} clonedFrom
 * @property {number} createdAt
 * @property {boolean} isFromUser
 * @property {boolean} quote
 * @property {Array<DailyReturn>} dailyReturns
 * @property {number} [risk]
 * @property {number} followers
 * @property {number} returns
 */

/**
 * @typedef {Array<ProviderEntity>} ProvidersCollection
 */

/**
 * @typedef {Object} ProviderStats
 * @property {string} id
 * @property {string} name
 * @property {string} logoUrl
 * @property {string} name
 * @property {string} quote
 * @property {boolean} base
 * @property {number} signals
 * @property {string} sumTotalInvested
 * @property {string} sumTotalProfit
 * @property {string} sumTotalProfitFromClosed
 * @property {string} sumTotalProfitFromOpened
 * @property {string} sumPositions
 * @property {string} sumUnclosedPositions
 * @property {string} sumWins
 * @property {string} sumLosses
 * @property {string} sumDCAs
 * @property {string} sumDCAWins
 * @property {string} sumDCALosses
 * @property {string} sumSoldByTakeProfit
 * @property {string} sumSoldManually
 * @property {string} sumSoldByTrailingStop
 * @property {string} sumSoldByStopLoss
 * @property {string} sumSoldByTTL
 * @property {string} sumSoldBySignal
 * @property {string} sumSoldByOther
 * @property {string} avgAverageProfit
 * @property {string} avgAveragePositionSize
 * @property {string} avgAverageDCAsPerPosition
 * @property {string} avgAverageClosingTime
 * @property {string} avgAverageEntryPrice
 * @property {string} avgAverageExitPrice
 * @property {string} avgAverageAveragePrice
 * @property {string} avgAverageProfitPercentage
 * @property {string} avgI24h_higherPricePercentage
 * @property {string} avgI24h_lowerBeforeHigherPricePercentage
 * @property {string} avgI24h_lowerPricePercentage
 * @property {string} avgI24h_secondsUntilHigherPrice
 * @property {string} avgI24h_secondsUntilLowerBeforeHigherPrice
 * @property {string} avgI24h_secondsUntilLowerPrice
 * @property {string} avgI3d_higherPricePercentage
 * @property {string} avgI3d_lowerBeforeHigherPricePercentage
 * @property {string} avgI3d_lowerPricePercentage
 * @property {string} avgI3d_secondsUntilHigherPrice
 * @property {string} avgI3d_secondsUntilLowerBeforeHigherPrice
 * @property {string} avgI3d_secondsUntilLowerPrice
 * @property {string} avgI1w_higherPricePercentage
 * @property {string} avgI1w_lowerBeforeHigherPricePercentage
 * @property {string} avgI1w_lowerPricePercentage
 * @property {string} avgI1w_secondsUntilHigherPrice
 * @property {string} avgI1w_secondsUntilLowerBeforeHigherPrice
 * @property {string} avgI1w_secondsUntilLowerPrice
 * @property {string} avgI2w_higherPricePercentage
 * @property {string} avgI2w_lowerBeforeHigherPricePercentage
 * @property {string} avgI2w_lowerPricePercentage
 * @property {string} avgI2w_secondsUntilHigherPrice
 * @property {string} avgI2w_secondsUntilLowerBeforeHigherPrice
 * @property {string} avgI2w_secondsUntilLowerPrice
 * @property {string} avgI1m_higherPricePercentage
 * @property {string} avgI1m_lowerBeforeHigherPricePercentage
 * @property {string} avgI1m_lowerPricePercentage
 * @property {string} avgI1m_secondsUntilHigherPrice
 * @property {string} avgI1m_secondsUntilLowerBeforeHigherPrice
 * @property {string} avgI1m_secondsUntilLowerPrice
 * @property {string} avgI3m_higherPricePercentage
 * @property {string} avgI3m_lowerBeforeHigherPricePercentage
 * @property {string} avgI3m_lowerPricePercentage
 * @property {string} avgI3m_secondsUntilHigherPrice
 * @property {string} avgI3m_secondsUntilLowerBeforeHigherPrice
 * @property {string} avgI3m_secondsUntilLowerPrice
 * @property {string} maxMaxInvestment
 * @property {string} maxMaxReturnOfInvestment
 * @property {string} maxMaxDCAProfit
 * @property {string} maxMaxBuyingPrice
 * @property {string} maxMaxExitPrice
 * @property {string} maxSlowerClosedPositionInSeconds
 * @property {string} minMinInvestment
 * @property {string} minMinReturnOfInvestment
 * @property {string} minMinDCAProfit
 * @property {string} minMinBuyingPrice
 * @property {string} minMinExitPrice
 * @property {string} minFasterClosedPositionInSeconds
 * @property {string} sumReturnOfInvestment
 * @property {string} sumClosedPositions
 * @property {string} percentageProfit
 * @property {string} winRate
 */

/**
 * @typedef {Array<ProviderStats>} ProvidersStatsCollection
 */

/**
 * Transform user create response to typed object.
 *
 * @export
 * @param {*} response Trade API user object.
 * @returns {UserCreateResponse} User entity.
 */
export function userCreateResponseTransform(response) {
  const transformResponse = {};
  transformResponse.token = response;

  return transformResponse;
}

/**
 * Transform user entity response to typed object.
 *
 * @export
 * @param {*} response Trade API user object.
 * @returns {UserLoginResponse} User entity.
 */
export function userEntityResponseTransform(response) {
  return {
    firstName: response.firstName,
    email: response.email,
    token: response.token,
    ask2FA: response.ask2FA,
    userId: response.userId,
    createdAt: response.createdAt,
    providerEnable: response.providerEnable,
    twoFAEnable: response.twoFAEnable,
    ref: response.ref,
    subscribe: response.subscribe,
    isAdmin: response.isAdmin,
    binanceConnected: response.binanceConnected,
    buysCount: response.buysCount,
    sellsCount: response.sellsCount,
    planId: response.planId,
    planName: response.planName,
    planType: response.planType,
    projectId: response.projectId,
    minimumProviderSettings: response.minimumProviderSettings,
    status: response.status,
    onboarding: response.onboarding,
    refCode: response.refCode,
  };
}

/**
 * Transform providers response to typed object.
 *
 * @export
 * @param {*} response Trade API signal providers list response.
 * @returns {ProvidersCollection} Signal providers entities collection.
 */
export function providersResponseTransform(response) {
  if (!isArray(response)) {
    throw new Error("Response must be an array of providers.");
  }

  return response.map((providerItem) => {
    return providerItemTransform(providerItem);
  });
}

/**
 * Transform API provider item to typed object.
 *
 * @param {Object} providerItem Trade API provider item.
 * @returns {ProviderEntity} Provider entity.
 */
function providerItemTransform(providerItem) {
  const emptyProviderEntity = createEmptyProviderEntity();
  // Override the empty entity with the values that came in from API.
  const transformedResponse = assign(emptyProviderEntity, providerItem);
  transformedResponse.returns = transformedResponse.dailyReturns.reduce((acc, item) => {
    // if (isCopyTrading) {
    const returns = typeof item.returns === "number" ? item.returns : parseFloat(item.returns);
    acc += returns;
    // } else {
    //   //   cumulativeTotalProfits += parseFloat(item.totalProfit);
    //   //   cumulativeTotalInvested += parseFloat(item.totalInvested);
    //   //   if (cumulativeTotalInvested) {
    //   //     acc = (cumulativeTotalProfits / cumulativeTotalInvested) * 100;
    //   //   }
    // }
    // chartData.push({
    //   day: item.name,
    //   returns: acc.toFixed(2),
    // });
    return acc;
  }, 0);

  return transformedResponse;
}

/**
 * Create empty provider entity skeletion.
 *
 * @returns {ProviderEntity} Enpty provider entity.
 */
function createEmptyProviderEntity() {
  return {
    id: "",
    name: "",
    description: "",
    shortDesc: "",
    longDesc: "",
    fee: false,
    website: false,
    exchanges: [],
    key: false,
    disable: true,
    customerKey: false,
    public: true,
    logoUrl: "",
    hasRecommendedSettings: false,
    hasBeenUsed: false,
    isClone: false,
    isCopyTrading: false,
    clonedFrom: false,
    createdAt: 0,
    isFromUser: false,
    quote: false,
    dailyReturns: [],
    returns: 0,
    risk: 0,
    coin: "BTC",
    followers: 0,
  };
}

/**
 * Transform user positions response to typed object collection.
 *
 * @param {*} response Trade API positions list response.
 * @returns {UserPositionsCollection} Positions entities collection.
 */
export function userPositionsResponseTransform(response) {
  if (!isArray(response)) {
    throw new Error("Response must be an array of positions.");
  }

  return response.map((positionItem) => {
    return userPositionItemTransform(positionItem);
  });
}

/**
 * Transform API position item to typed object.
 *
 * @param {Object} positionItem Trade API position item.
 * @returns {PositionEntity} Position entity.
 */
function userPositionItemTransform(positionItem) {
  const emptyPositionEntity = createEmptyPositionEntity();
  // Override the empty entity with the values that came in from API.
  const transformedResponse = assign(emptyPositionEntity, positionItem);

  return transformedResponse;
}

/**
 * Create empty position entity skeleton.
 *
 * @returns {PositionEntity} Empty position entity.
 */
function createEmptyPositionEntity() {
  return {
    closed: false,
    positionId: "",
    userId: "",
    openDate: "",
    openTrigger: "",
    closeDate: "",
    closeTrigger: "",
    pair: "",
    base: "",
    quote: "",
    buyPrice: "",
    sellPrice: "",
    side: "",
    amount: "",
    remainAmount: "",
    invested: "",
    positionSizeQuote: 0,
    positionSize: "",
    investedQuote: "",
    profitPercentage: "",
    profit: 0,
    quoteAsset: "",
    stopLossPercentage: 0,
    stopLossPrice: 0,
    takeProfit: false,
    trailingStopPercentage: 0,
    trailingStopTriggerPercentage: 0,
    trailingStopTriggered: false,
    trailingStopPrice: false,
    exchange: "",
    exchangeInternalName: "",
    symbol: "",
    status: 0,
    statusDesc: "",
    sellPlaceOrderAt: "",
    checkStop: false,
    provider: "",
    sellByTTL: false,
    buyTTL: 0,
    updating: false,
    signalMetadata: false,
    accounting: false,
    providerId: "",
    providerName: "",
    signalTerm: "",
    takeProfitTargetsCountFail: 0,
    takeProfitTargetsCountSuccess: 0,
    takeProfitTargetsCountPending: 0,
    reBuyTargetsCountFail: 0,
    reBuyTargetsCountSuccess: 0,
    reBuyTargetsCountPending: 0,
    isCopyTrading: false,
    isCopyTrader: false,
    signalId: "",
    type: "",
    copyTraderId: false,
    paperTrading: false,
    realInvestment: { $numberDecimal: "" },
    leverage: 0,
    internalExchangeId: "",
    logoUrl: "",
    reBuyTargets: [],
  };
}

/**
 * Transform user exchange connection to typed ExchangeConnectionEntity.
 *
 * @param {*} response Trade API get exchanges raw response.
 * @returns {Array<ExchangeConnectionEntity>} User exchange connections collection.
 */
export function userExchangeConnectionResponseTransform(response) {
  if (!isArray(response)) {
    throw new Error("Response must be an array of positions.");
  }

  return response.map((exchangeConnectionItem) => {
    return userExchangeConnectionItemTransform(exchangeConnectionItem);
  });
}

/**
 * @typedef {Object} ExchangeConnectionEntity
 * @property {String} id
 * @property {String} Name
 * @property {String} exchangeId
 * @property {String} exchangeName
 * @property {String} internalId
 * @property {String} exchangeInternalName
 * @property {Boolean} key
 * @property {Boolean} secret
 * @property {Boolean} arrayKeysValid
 * @property {Boolean} paperTrading
 * @property {String} exchangeType
 * @property {Boolean} isTestnet
 * @property {Boolean} disable
 * @property {Number} positionSize
 * @property {Boolean} managed
 * @property {Boolean} internal
 * @property {Boolean} isBrokerAccount
 * @property {String} subAccountId
 * @property {String} binanceBrokerId
 * @property {Number} checkAuthCount
 */

/**
 * Transform API exchange connection item to typed object.
 *
 * @param {*} exchangeConnectionItem Trade API exchange connection item.
 * @returns {ExchangeConnectionEntity} Exchange connection entity.
 */
function userExchangeConnectionItemTransform(exchangeConnectionItem) {
  const emptyExchangeConnectionEntity = createExchangeConnectionEmptyEntity();
  const normalizedId = isObject(exchangeConnectionItem._id) ? exchangeConnectionItem._id.$oid : "";
  // Override the empty entity with the values that came in from API.
  const transformedResponse = assign(emptyExchangeConnectionEntity, exchangeConnectionItem, {
    id: normalizedId,
  });

  return transformedResponse;
}

function createExchangeConnectionEmptyEntity() {
  return {
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
    checkAuthCount: false,
  };
}

/**
 * @typedef {import('../store/initialState').UserBalanceEntity} UserBalanceEntity
 */

/**
 * Transform API user balance response to typed object.
 *
 * @param {*} response Trade API exchange connection item.
 * @returns {UserBalanceEntity} User Balance entity.
 */

/**
 * Transform user balance response to typed UserBalanceEntity.
 *
 * @param {*} response Trade API get user balance raw response.
 * @returns {UserBalanceEntity} User balance entity.
 */
export function userBalanceResponseTransform(response) {
  if (!isObject(response)) {
    throw new Error("Response must be an object with different propteries.");
  }

  const transformedResponse = createUserBalanceEntity(response);
  return transformedResponse;
}

/**
 * Create user balance entity.
 *
 * @param {*} response Trade API user balance raw raw response.
 * @returns {UserBalanceEntity} User balance entity.
 */
function createUserBalanceEntity(response) {
  return {
    btcusdt: response.btcusdt,
    totalInvested: response.totalInvested,
    totalOpen: response.totalOpen,
    totalProfit: response.totalProfit,
    totalAssets: response.totalAssets,
    profitPercentage: response.profitPercentage,
  };
}

/**
 * Transform providers stats response to typed ProvidersStatsCollection.
 *
 * @param {*} response Trade API get user balance raw response.
 * @returns {ProvidersStatsCollection} User balance entity.
 */
export function providersStatsResponseTransform(response) {
  if (!isObject(response)) {
    throw new Error("Response must be an object with different propteries.");
  }

  return response.map((providerStatsItem) => {
    console.log(providerStatsItem);
    return providerStatsItemTransform(providerStatsItem);
  });
}

/**
 * Transform API provider stats item to typed object.
 *
 * @param {*} providerStatsItem Trade API provider stats item.
 * @returns {ProviderStats} Provider stats.
 */
function providerStatsItemTransform(providerStatsItem) {
  const emptyProviderStatsEntity = createProviderStatsEmptyEntity();
  // Override the empty entity with the values that came in from API.
  const transformedResponse = assign(emptyProviderStatsEntity, providerStatsItem);

  return transformedResponse;
}

/**
 * Create provider stats entity.
 *
 * @returns {ProviderStats} User balance entity.
 */

function createProviderStatsEmptyEntity() {
  return {
    id: "",
    name: "",
    logoUrl: "",
    quote: "",
    base: false,
    signals: 0,
    sumTotalInvested: "",
    sumTotalProfit: "",
    sumTotalProfitFromClosed: "",
    sumTotalProfitFromOpened: "",
    sumPositions: "",
    sumUnclosedPositions: "",
    sumWins: "",
    sumLosses: "",
    sumDCAs: "",
    sumDCAWins: "",
    sumDCALosses: "",
    sumSoldByTakeProfit: "",
    sumSoldManually: "",
    sumSoldByTrailingStop: "",
    sumSoldByStopLoss: "",
    sumSoldByTTL: "",
    sumSoldBySignal: "",
    sumSoldByOther: "",
    avgAverageProfit: "",
    avgAveragePositionSize: "",
    avgAverageDCAsPerPosition: "",
    avgAverageClosingTime: "",
    avgAverageEntryPrice: "",
    avgAverageExitPrice: "",
    avgAverageAveragePrice: "",
    avgAverageProfitPercentage: "",
    avgI24h_higherPricePercentage: "",
    avgI24h_lowerBeforeHigherPricePercentage: "",
    avgI24h_lowerPricePercentage: "",
    avgI24h_secondsUntilHigherPrice: "",
    avgI24h_secondsUntilLowerBeforeHigherPrice: "",
    avgI24h_secondsUntilLowerPrice: "",
    avgI3d_higherPricePercentage: "",
    avgI3d_lowerBeforeHigherPricePercentage: "",
    avgI3d_lowerPricePercentage: "",
    avgI3d_secondsUntilHigherPrice: "",
    avgI3d_secondsUntilLowerBeforeHigherPrice: "",
    avgI3d_secondsUntilLowerPrice: "",
    avgI1w_higherPricePercentage: "",
    avgI1w_lowerBeforeHigherPricePercentage: "",
    avgI1w_lowerPricePercentage: "",
    avgI1w_secondsUntilHigherPrice: "",
    avgI1w_secondsUntilLowerBeforeHigherPrice: "",
    avgI1w_secondsUntilLowerPrice: "",
    avgI2w_higherPricePercentage: "",
    avgI2w_lowerBeforeHigherPricePercentage: "",
    avgI2w_lowerPricePercentage: "",
    avgI2w_secondsUntilHigherPrice: "",
    avgI2w_secondsUntilLowerBeforeHigherPrice: "",
    avgI2w_secondsUntilLowerPrice: "",
    avgI1m_higherPricePercentage: "",
    avgI1m_lowerBeforeHigherPricePercentage: "",
    avgI1m_lowerPricePercentage: "",
    avgI1m_secondsUntilHigherPrice: "",
    avgI1m_secondsUntilLowerBeforeHigherPrice: "",
    avgI1m_secondsUntilLowerPrice: "",
    avgI3m_higherPricePercentage: "",
    avgI3m_lowerBeforeHigherPricePercentage: "",
    avgI3m_lowerPricePercentage: "",
    avgI3m_secondsUntilHigherPrice: "",
    avgI3m_secondsUntilLowerBeforeHigherPrice: "",
    avgI3m_secondsUntilLowerPrice: "",
    maxMaxInvestment: "",
    maxMaxReturnOfInvestment: "",
    maxMaxDCAProfit: "",
    maxMaxBuyingPrice: "",
    maxMaxExitPrice: "",
    maxSlowerClosedPositionInSeconds: "",
    minMinInvestment: "",
    minMinReturnOfInvestment: "",
    minMinDCAProfit: "",
    minMinBuyingPrice: "",
    minMinExitPrice: "",
    minFasterClosedPositionInSeconds: "",
    sumReturnOfInvestment: "",
    sumClosedPositions: "",
    percentageProfit: "",
    winRate: "",
  };
}

import { assign, isArray } from "lodash";

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
 * @typedef {Object} UserPositionsPayload
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
 * Transform user create response to typed object.
 *
 * @export
 * @param {*} response
 * @returns {UserCreateResponse}
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
 * @param {*} response
 * @returns {UserLoginResponse}
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
    twoFAEnable: response["twoFAEnable"],
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
 * Transform user positions response to typed object collection.
 *
 * @export
 * @param {*} response
 * @returns {UserPositionsCollection}
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
 * @param {Object} positionItem
 * @returns {PositionEntity}
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
 * @returns {PositionEntity}
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

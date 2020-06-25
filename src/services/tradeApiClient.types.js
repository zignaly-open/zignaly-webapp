import moment from "moment";
import { assign, isArray, isObject } from "lodash";
import { toCamelCaseKeys } from "../utils/format";
import defaultProviderLogo from "../images/defaultProviderLogo.png";

/**
 * @type {('entry')}
 */
export const POSITION_TYPE_ENTRY = "entry";

/**
 * @type {('exit')}
 */
export const POSITION_TYPE_EXIT = "exit";

/**
 * @type {('LONG')}
 */
export const POSITION_SIDE_LONG = "LONG";

/**
 * @type {('SHORT')}
 */
export const POSITION_SIDE_SHORT = "SHORT";

/**
 * @type {('market')}
 */
export const POSITION_ENTRY_TYPE_MARKET = "market";

/**
 * @type {('limit')}
 */
export const POSITION_ENTRY_TYPE_LIMIT = "limit";

/**
 * @type {('stop_loss_limit')}
 */
export const POSITION_ENTRY_TYPE_SLLIMIT = "stop_loss_limit";

/**
 * @type {('import')}
 */
export const POSITION_ENTRY_TYPE_IMPORT = "import";

/**
 * @typedef {Object} CreatePositionPayload
 * @property {string} token
 * @property {string} pair
 * @property {number} limitPrice
 * @property {string} positionSizeQuote
 * @property {number} positionSize
 * @property {('entry' | 'exit')} type
 * @property {('SHORT' | 'LONG')} side
 * @property {number|boolean} stopLossPercentage
 * @property {number|boolean} buyTTL
 * @property {("market" | "limit" | "stop_loss_limit" | "import")} buyType
 * @property {number} buyStopPrice
 * @property {number|boolean} sellByTTL
 * @property {Array<PositionProfitTarget>|boolean} takeProfitTargets
 * @property {Array<PositionDCATarget>|boolean} reBuyTargets
 * @property {number|boolean} trailingStopTriggerPercentage
 * @property {number|boolean} trailingStopPercentage
 * @property {number|string} providerId
 * @property {string} providerName
 * @property {string} exchangeName
 * @property {string} exchangeInternalId
 */

/**
 * @typedef {Object} PositionProfitTarget
 * @property {number} targetId
 * @property {number} priceTargetPercentage
 * @property {number} quoteTarget
 * @property {number} amountPercentage
 * @property {number} value
 */

/**
 * @typedef {Object} PositionDCATarget
 * @property {number} targetId
 * @property {number} priceTargetPercentage
 * @property {number} amountPercentage
 */

/**
 * @typedef {Object} PositionActionPayload
 * @property {string} positionId Position ID to cancel.
 * @property {string} token Access token.
 */

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
 * @typedef {Object} GetProviderPayload
 * @property {string} token
 * @property {string} providerId
 * @property {Number} version
 */

/**
 * @typedef {Object} GetProviderFollowersPayload
 * @property {string} token
 * @property {string} providerId
 */

/**
 * @typedef {Object} ConnectProviderPayload
 * @property {string} token
 * @property {string} providerId
 * @property {String} allocatedBalance
 * @property {String} exchangeInternalId
 * @property {Boolean} balanceFilter
 * @property {Boolean} connected
 */

/**
 * @typedef {Object} DisableProviderPayload
 * @property {string} token
 * @property {string} providerId
 * @property {String} type
 * @property {Boolean} disable
 */

/**
 * @typedef {Object} EditProvderPayload
 * @property {string} token
 * @property {string} providerId
 * @property {String} name
 * @property {String} logoUrl
 * @property {String} website
 * @property {Boolean} list
 * @property {Boolean} public
 * @property {String} minAllocatedBalance
 * @property {String} merchantId
 * @property {String} price
 * @property {String} trial
 * @property {String} ipnSecret
 * @property {String} [exchange]
 * @property {String} [exchangeType]
 * @property {String} [quote]
 * @property {String} about
 * @property {String} strategy
 * @property {Array<DefaultProviderSocialObject>} social
 * @property {Array<DefaultProviderTeamObject>} team
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
 * @property {string} token User access token.
 */

/**
 * @typedef {Object} UserEquityPayload
 * @property {string} token User access token.
 * @property {String} exchangeInternalId
 */

/**
 * @typedef {Object} PositionsListPayload
 * @property {string} token User access token.
 * @property {string} internalExchangeId User exchange connection ID.
 */

/**
 * @typedef {Object & AuthorizationPayload} ReadOnlyPayload
 * @property {boolean} ro
 */

/**
 * @typedef {Object & AuthorizationPayload} BaseAssetsPayload
 * @property {string} quote
 */

/**
 * @typedef {Object} ExchangeAssetsPayload
 * @property {string} internalId
 */

/**
 * @typedef {Object} PositionEntity
 * @property {Array<ReBuyTarget>} reBuyTargets
 * @property {RealInvestment} realInvestment
 * @property {boolean} accounting
 * @property {boolean} checkStop
 * @property {boolean} closed
 * @property {boolean} copyTraderId
 * @property {boolean} isCopyTrader
 * @property {boolean} isCopyTrading
 * @property {boolean} paperTrading
 * @property {boolean} sellByTTL
 * @property {boolean} signalMetadata
 * @property {boolean} takeProfit
 * @property {boolean} trailingStopPrice
 * @property {boolean} trailingStopTriggered
 * @property {boolean} updating
 * @property {number} buyTTL
 * @property {number} closeDate
 * @property {number} fees
 * @property {number} leverage
 * @property {number} netProfit
 * @property {number} netProfitPercentage
 * @property {string} netProfitStyle
 * @property {number} openDate
 * @property {number} positionSizeQuote
 * @property {number} profit
 * @property {number} reBuyTargetsCountFail
 * @property {number} reBuyTargetsCountPending
 * @property {number} reBuyTargetsCountSuccess
 * @property {number} risk
 * @property {number} status
 * @property {number} stopLossPercentage
 * @property {number} stopLossPrice
 * @property {number} takeProfitTargetsCountFail
 * @property {number} takeProfitTargetsCountPending
 * @property {number} takeProfitTargetsCountSuccess
 * @property {number} trailingStopPercentage
 * @property {number} trailingStopTriggerPercentage
 * @property {string} age
 * @property {number} amount
 * @property {string} base
 * @property {number} buyPrice
 * @property {string} closeDateReadable
 * @property {string} closeTrigger
 * @property {string} exchange
 * @property {string} exchangeInternalName
 * @property {string} internalExchangeId
 * @property {string} invested
 * @property {string} investedQuote
 * @property {string} logoUrl
 * @property {string} openDateReadable
 * @property {string} openTrigger
 * @property {string} pair
 * @property {string} positionId
 * @property {string} positionSize
 * @property {number} profitPercentage
 * @property {string} profitStyle
 * @property {string} provider
 * @property {string} providerId
 * @property {string} providerLink
 * @property {string} providerLogo
 * @property {string} providerName
 * @property {string} quote
 * @property {string} quoteAsset
 * @property {number} remainAmount
 * @property {string} riskStyle
 * @property {string} sellPlaceOrderAt
 * @property {number} sellPrice
 * @property {string} side
 * @property {string} signalId
 * @property {string} signalTerm
 * @property {string} statusDesc
 * @property {string} stopLossStyle
 * @property {string} symbol
 * @property {string} userId
 * @property {('unsold' | 'sold' | 'unopened' | '')} type
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
 * @property {string} type
 * @property {number} timeFrame
 * @property {boolean} copyTradersOnly
 * @property {boolean} [ro]
 */

/**
 * @typedef {Object} DailyReturn
 * @property {string} name
 * @property {number} [positions]
 * @property {number} returns
 * @property {string} [totalInvested]
 * @property {string} [totalProfit]
 */

/**
 * @typedef {Object} ProvidersStatsPayload
 * @property {string} token
 * @property {string} quote
 * @property {string} base
 * @property {string} timeFrame
 * @property {string} DCAFilter
 * @property {boolean} ro
 * @property {boolean} isCopyTrading
 */

/**
 * @typedef {Object} ProviderEntity
 * @property {string} id
 * @property {string} name
 * @property {string} description
 * @property {string} shortDesc
 * @property {string} longDesc
 * @property {string|boolean} fee
 * @property {number} price
 * @property {boolean} website
 * @property {Array<string>} exchanges
 * @property {boolean} key
 * @property {boolean} disable
 * @property {boolean} customerKey
 * @property {boolean} public
 * @property {boolean} hasRecommendedSettings
 * @property {string} logoUrl
 * @property {boolean} hasBeenUsed
 * @property {boolean} isClone
 * @property {boolean} isCopyTrading
 * @property {boolean} clonedFrom
 * @property {number} createdAt
 * @property {boolean} isFromUser
 * @property {string} quote
 * @property {Array<DailyReturn>} dailyReturns
 * @property {number} [risk]
 * @property {number} followers
 * @property {number} returns
 * @property {string} floating
 * @property {number} openPositions
 * @property {number} closedPositions
 */

/**
 * @typedef {Array<ProviderEntity>} ProvidersCollection
 */

/**
 * @typedef {Object} ProviderStats
 * @property {string} providerId
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
 * @property {string} avgI24hHigherPricePercentage
 * @property {string} avgI24hLowerBeforeHigherPricePercentage
 * @property {string} avgI24hLowerPricePercentage
 * @property {string} avgI24hSecondsUntilHigherPrice
 * @property {string} avgI24hSecondsUntilLowerBeforeHigherPrice
 * @property {string} avgI24hSecondsUntilLowerPrice
 * @property {string} avgI3dHigherPricePercentage
 * @property {string} avgI3dLowerBeforeHigherPricePercentage
 * @property {string} avgI3dLowerPricePercentage
 * @property {string} avgI3dSecondsUntilHigherPrice
 * @property {string} avgI3dSecondsUntilLowerBeforeHigherPrice
 * @property {string} avgI3dSecondsUntilLowerPrice
 * @property {string} avgI1wHigherPricePercentage
 * @property {string} avgI1wLowerBeforeHigherPricePercentage
 * @property {string} avgI1wLowerPricePercentage
 * @property {string} avgI1wSecondsUntilHigherPrice
 * @property {string} avgI1wSecondsUntilLowerBeforeHigherPrice
 * @property {string} avgI1wSecondsUntilLowerPrice
 * @property {string} avgI1mHigherPricePercentage
 * @property {string} avgI1mLowerBeforeHigherPricePercentage
 * @property {string} avgI1mLowerPricePercentage
 * @property {string} avgI1mSecondsUntilHigherPrice
 * @property {string} avgI1mSecondsUntilLowerBeforeHigherPrice
 * @property {string} avgI1mSecondsUntilLowerPrice
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
 * @typedef {Object} QuoteAsset
 * @property {string} quote
 * @property {string} minNominal
 */

/**
 * @typedef {Object} BaseAsset
 * @property {string} quote
 * @property {string} base
 */

/**
 * @typedef {Object.<string, QuoteAsset>} QuoteAssetsDict
 * @typedef {Object.<string, BaseAsset>} BaseAssetsDict
 */

/**
 * @typedef {Object & ReadOnlyPayload} ConnectedProviderUserInfoPayload
 * @property {string} providerId
 */

/**
 * @typedef {Object} ConnectedProviderUserInfo
 * @property {number} currentAllocated
 * @property {number} profitsSinceCopying
 */

/**
 * @typedef {Object} ExchangeAddPayload
 * @property {string} exchangeId
 * @property {string} internalName
 * @property {string} exchangeType
 * @property {string} key
 * @property {string} secret
 * @property {string} [password]
 * @property {boolean} mainAccount
 * @property {boolean} isPaperTrading
 * @property {boolean} testNet
 */

/**
 * @typedef {Object} ExchangeDeletePayload
 * @property {string} internalId
 */

/**
 * @typedef {Object} ExchangeUpdatePayload
 * @property {string} internalId
 * @property {string} exchangeId
 * @property {string} internalName
 * @property {string|boolean} globalMaxPositions
 * @property {string|boolean} globalMinVolume
 * @property {string|boolean} globalPositionsPerMarket
 * @property {string|boolean} globalBlacklist
 * @property {string|boolean} globalWhitelist
 * @property {boolean} globalDelisting
 */

/**
 * @typedef {Object} DepositAddressGetPayload
 * @property {string} network
 * @property {string} internalId
 * @property {string} asset
 */

/**
 * @typedef {Object} ExchangeDepositAddress
 * @property {string} currency
 * @property {string} address
 * @property {string} tag
 */

/**
 * @typedef {Object} GetExchangeLastDepositsPayload
 * @property {string} internalId
 */

/**
 * @typedef {Object} WithdrawPayload
 * @property {string} internalId
 * @property {string} asset
 * @property {string} network
 * @property {string} tag
 * @property {string} address
 * @property {number} amount
 */

/**
 * @typedef {Object} WithdrawReply
 * @property {string} id
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

  transformedResponse.dailyReturns.forEach((item) => {
    // if (isCopyTrading) {
    item.returns = typeof item.returns === "number" ? item.returns : parseFloat(item.returns);
    transformedResponse.returns += item.returns;
    transformedResponse.closedPositions += item.positions;
    // } else {
    //   //   cumulativeTotalProfits += parseFloat(item.totalProfit);
    //   //   cumulativeTotalInvested += parseFloat(item.totalInvested);
    //   //   if (cumulativeTotalInvested) {
    //   //     acc = (cumulativeTotalProfits / cumulativeTotalInvested) * 100;
    //   //   }
    // }
  });

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
    price: 0,
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
    quote: "",
    dailyReturns: [],
    returns: 0,
    risk: 0,
    followers: 0,
    floating: "",
    openPositions: 0,
    closedPositions: 0,
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
 * @param {Object.<string, any>} positionItem Trade API position item.
 * @returns {PositionEntity} Position entity.
 */
export function userPositionItemTransform(positionItem) {
  const emptyPositionEntity = createEmptyPositionEntity();
  const openDateMoment = moment(Number(positionItem.openDate));
  const closeDateMoment = moment(Number(positionItem.closeDate));
  const composeProviderLink = () => {
    // Manual positions don't use a signal provider.
    if (positionItem.providerId === "1") {
      return "";
    }

    if (positionItem.isCopyTrading) {
      return `/copytraders/${positionItem.providerId}`;
    }

    return `/signalsproviders/${positionItem.providerId}`;
  };

  /**
   * Calculate position risk based on buy price, stop loss and entry side.
   *
   * @param {PositionEntity} positionEntity Transformed position entity.
   * @returns {number} Risk percentage.
   */
  const calculateRisk = (positionEntity) => {
    const buyPrice = positionEntity.buyPrice;
    let risk = ((positionEntity.stopLossPrice - buyPrice) / buyPrice) * 100;

    if (isNaN(risk)) {
      return 0.0;
    }

    // Invert on short position.
    if (positionEntity.side === "SHORT") {
      risk *= -1;
    }

    return risk;
  };

  /**
   * Checks if entry price is currently at profit or loss.
   *
   * @param {number} entry Entry price.
   * @param {number} current Current price.
   * @param {string} side Position side.
   * @returns {('gain' | 'loss' | 'breakeven')} Profit result.
   */
  const getProfitType = (entry, current, side) => {
    if (side === "LONG") {
      if (entry > current) {
        return "gain";
      } else if (entry < current) {
        return "loss";
      }
    }

    if (side === "SHORT") {
      if (entry < current) {
        return "gain";
      } else if (entry > current) {
        return "loss";
      }
    }

    return "breakeven";
  };

  // Override the empty entity with the values that came in from API and augment
  // with pre-calculated fields.
  const positionEntity = assign(emptyPositionEntity, positionItem, {
    amount: parseFloat(positionItem.amount),
    buyPrice: parseFloat(positionItem.buyPrice),
    closeDate: Number(positionItem.closeDate),
    fees: parseFloat(positionItem.fees),
    netProfit: parseFloat(positionItem.netProfit),
    netProfitPercentage: parseFloat(positionItem.netProfitPercentage),
    openDate: Number(positionItem.openDate),
    positionSizeQuote: parseFloat(positionItem.positionSizeQuote),
    profit: parseFloat(positionItem.profit),
    profitPercentage: parseFloat(positionItem.profitPercentage),
    remainAmount: parseFloat(positionItem.remainAmount),
    sellPrice: parseFloat(positionItem.sellPrice),
    side: positionItem.side.toUpperCase(),
    stopLossPrice: parseFloat(positionItem.stopLossPrice),
  });

  const risk = calculateRisk(positionEntity);
  const augmentedEntity = assign(positionEntity, {
    age: openDateMoment.toNow(true),
    closeDateReadable: positionEntity.closeDate ? closeDateMoment.format("YY/MM/DD HH:mm") : "-",
    openDateMoment: openDateMoment,
    openDateReadable: positionEntity.openDate ? openDateMoment.format("YY/MM/DD HH:mm") : "-",
    profitStyle: getProfitType(positionEntity.profit, 0, positionEntity.side),
    providerLink: composeProviderLink(),
    providerLogo: positionEntity.logoUrl || defaultProviderLogo,
    risk: risk,
    riskStyle: risk < 0 ? "loss" : "gain",
    stopLossStyle: getProfitType(
      positionEntity.stopLossPrice,
      positionEntity.buyPrice,
      positionEntity.side,
    ),
    netProfitStyle: getProfitType(positionEntity.netProfit, 0, positionEntity.side),
  });

  return augmentedEntity;
}

/**
 * Create empty position entity skeleton.
 *
 * @returns {PositionEntity} Empty position entity.
 */
function createEmptyPositionEntity() {
  return {
    accounting: false,
    age: "",
    amount: 0,
    base: "",
    buyPrice: 0,
    buyTTL: 0,
    checkStop: false,
    closeDate: 0,
    closeDateReadable: "",
    closeTrigger: "",
    closed: false,
    copyTraderId: false,
    exchange: "",
    exchangeInternalName: "",
    fees: 0,
    internalExchangeId: "",
    invested: "",
    investedQuote: "",
    isCopyTrader: false,
    isCopyTrading: false,
    leverage: 0,
    logoUrl: "",
    netProfit: 0,
    netProfitPercentage: 0,
    netProfitStyle: "",
    openDate: 0,
    openDateReadable: "",
    openTrigger: "",
    pair: "",
    paperTrading: false,
    positionId: "",
    positionSize: "",
    positionSizeQuote: 0,
    profit: 0,
    profitPercentage: 0,
    profitStyle: "",
    provider: "",
    providerId: "",
    providerLink: "",
    providerLogo: "",
    providerName: "",
    quote: "",
    quoteAsset: "",
    reBuyTargets: [],
    reBuyTargetsCountFail: 0,
    reBuyTargetsCountPending: 0,
    reBuyTargetsCountSuccess: 0,
    realInvestment: { $numberDecimal: "" },
    remainAmount: 0,
    risk: 0,
    riskStyle: "",
    sellByTTL: false,
    sellPlaceOrderAt: "",
    sellPrice: 0,
    side: "",
    signalId: "",
    signalMetadata: false,
    signalTerm: "",
    status: 0,
    statusDesc: "",
    stopLossPercentage: 0,
    stopLossPrice: 0,
    stopLossStyle: "",
    symbol: "",
    takeProfit: false,
    takeProfitTargetsCountFail: 0,
    takeProfitTargetsCountPending: 0,
    takeProfitTargetsCountSuccess: 0,
    trailingStopPercentage: 0,
    trailingStopPrice: false,
    trailingStopTriggerPercentage: 0,
    trailingStopTriggered: false,
    updating: false,
    userId: "",
    type: "",
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
 * @property {String} name
 * @property {String} exchangeId
 * @property {String} exchangeName
 * @property {String} internalId
 * @property {Boolean} key
 * @property {Boolean} secret
 * @property {Boolean} areKeysValid
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
 * @property {String} internalName
 * @property {string|boolean} globalMaxPositions
 * @property {string|boolean} globalMinVolume
 * @property {string|boolean} globalPositionsPerMarket
 * @property {string|boolean} globalBlacklist
 * @property {string|boolean} globalWhitelist
 * @property {boolean} globalDelisting
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
  };
}

/**
 * @typedef {Object} UserBalanceEntity
 * @property {Number} pnlBTC
 * @property {Number} pnlUSDT
 * @property {Number} totalBTC
 * @property {Number} totalFreeBTC
 * @property {Number} totalFreeUSDT
 * @property {Number} totalLockedBTC
 * @property {Number} totalLockedUSDT
 * @property {Number} totalUSDT
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

  let transformedResponse = createUserBalanceEntity(response);
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
    pnlBTC: response.pnlBTC,
    pnlUSDT: response.pnlUSDT,
    totalBTC: response.totalBTC,
    totalFreeBTC: response.totalFreeBTC,
    totalFreeUSDT: response.totalFreeUSDT,
    totalLockedBTC: response.totalLockedBTC,
    totalLockedUSDT: response.totalLockedUSDT,
    totalUSDT: response.totalUSDT,
  };
}

/**
 *
 * @typedef {Object} DefaultDailyBalanceEntity
 * @property {Array<UserEquityEntity>} balances
 * @property {Array<String>} quotes
 */

/**
 *
 * @typedef {Object} UserEquityEntity
 * @property {Number} BNBpercentage
 * @property {Number} BTCpercentage
 * @property {Number} DAIpercentage
 * @property {Number} ETHpercentage
 * @property {Number} KCSpercentage
 * @property {Number} NEOpercentage
 * @property {Number} PAXpercentage
 * @property {Number} TRXpercentage
 * @property {Number} TUSDpercentage
 * @property {Number} USDCpercentage
 * @property {Number} USDTpercentage
 * @property {Number} BKRWpercentage
 * @property {Number} BUSDpercentage
 * @property {Number} EURpercentage
 * @property {Number} IDRTpercentage
 * @property {Number} NGNpercentage
 * @property {Number} RUBpercentage
 * @property {Number} TRYpercentage
 * @property {Number} USDSpercentage
 * @property {Number} XRPpercentage
 * @property {Number} ZARpercentage
 * @property {String} date
 * @property {Number} freeBNB
 * @property {Number} freeBTC
 * @property {Number} freeDAI
 * @property {Number} freeETH
 * @property {Number} freeKCS
 * @property {Number} freeNEO
 * @property {Number} freePAX
 * @property {Number} freeTRX
 * @property {Number} freeTUSD
 * @property {Number} freeUSDC
 * @property {Number} freeUSDT
 * @property {Number} freeBKRW
 * @property {Number} freeBUSD
 * @property {Number} freeEUR
 * @property {Number} freeIDRT
 * @property {Number} freeNGN
 * @property {Number} freeRUB
 * @property {Number} freeTRY
 * @property {Number} freeUSDS
 * @property {Number} freeXRP
 * @property {Number} freeZAR
 * @property {Number} lockedBNB
 * @property {Number} lockedBTC
 * @property {Number} lockedDAI
 * @property {Number} lockedETH
 * @property {Number} lockedKCS
 * @property {Number} lockedNEO
 * @property {Number} lockedPAX
 * @property {Number} lockedTRX
 * @property {Number} lockedTUSD
 * @property {Number} lockedUSDC
 * @property {Number} lockedUSDT
 * @property {Number} lockedBKRW
 * @property {Number} lockedBUSD
 * @property {Number} lockedEUR
 * @property {Number} lockedIDRT
 * @property {Number} lockedNGN
 * @property {Number} lockedRUB
 * @property {Number} lockedTRY
 * @property {Number} lockedUSDS
 * @property {Number} lockedXRP
 * @property {Number} lockedZAR
 * @property {Number} otherPercentage
 * @property {Number} totalBTC
 * @property {Number} totalFreeBTC
 * @property {Number} totalFreeUSDT
 * @property {Number} totalLockedBTC
 * @property {Number} totalLockedUSDT
 * @property {Number} totalUSDT
 *
 */

/**
 * Transform user balance response to typed UserBalanceEntity.
 *
 * @param {*} response Trade API get user balance raw response.
 * @returns {DefaultDailyBalanceEntity} User balance entity.
 */
export function userEquityResponseTransform(response) {
  if (!isObject(response)) {
    throw new Error("Response must be an object with different properties.");
  }

  let transformedResponse = createUserEquityResponseEntity(response);

  let quotes = transformedResponse.quotes;
  let balances = transformedResponse.balances.map((userEquityItem) => {
    return userEquityItemTransform(userEquityItem);
  });
  balances = balances.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  transformedResponse = { ...transformedResponse, balances, quotes };
  return transformedResponse;
}

/**
 * Transform API exchange connection item to typed object.
 *
 * @param {*} userEquityItem Trade API exchange connection item.
 * @returns {UserEquityEntity} Exchange connection entity.
 */
function userEquityItemTransform(userEquityItem) {
  const emptyEquityEntity = createUserEquityEntity();
  // Override the empty entity with the values that came in from API.
  const transformedResponse = assign(emptyEquityEntity, userEquityItem);

  return transformedResponse;
}

/**
 * Create user balance entity.
 * @param {*} response Response from the API.
 * @returns {DefaultDailyBalanceEntity} User balance entity.
 */
function createUserEquityResponseEntity(response) {
  return {
    balances: response.balances,
    quotes: response.quotes,
  };
}

/**
 * Create user balance entity.
 *
 * @returns {UserEquityEntity} User balance entity.
 */
function createUserEquityEntity() {
  return {
    BKRWpercentage: 0,
    BNBpercentage: 0,
    DAIpercentage: 0,
    BTCpercentage: 0,
    BUSDpercentage: 0,
    ETHpercentage: 0,
    EURpercentage: 0,
    IDRTpercentage: 0,
    NGNpercentage: 0,
    PAXpercentage: 0,
    RUBpercentage: 0,
    TRXpercentage: 0,
    TRYpercentage: 0,
    TUSDpercentage: 0,
    USDCpercentage: 0,
    USDSpercentage: 0,
    USDTpercentage: 0,
    XRPpercentage: 0,
    ZARpercentage: 0,
    KCSpercentage: 0,
    NEOpercentage: 0,
    date: "0",
    freeBKRW: 0,
    freeBNB: 0,
    freeBTC: 0,
    freeBUSD: 0,
    freeETH: 0,
    freeEUR: 0,
    freeIDRT: 0,
    freeNGN: 0,
    freePAX: 0,
    freeRUB: 0,
    freeTRX: 0,
    freeTRY: 0,
    freeTUSD: 0,
    freeUSDC: 0,
    freeUSDS: 0,
    freeUSDT: 0,
    freeXRP: 0,
    freeZAR: 0,
    freeDAI: 0,
    freeNEO: 0,
    freeKCS: 0,
    lockedBKRW: 0,
    lockedBNB: 0,
    lockedBTC: 0,
    lockedBUSD: 0,
    lockedETH: 0,
    lockedEUR: 0,
    lockedIDRT: 0,
    lockedNGN: 0,
    lockedPAX: 0,
    lockedRUB: 0,
    lockedTRX: 0,
    lockedTRY: 0,
    lockedTUSD: 0,
    lockedUSDC: 0,
    lockedUSDS: 0,
    lockedUSDT: 0,
    lockedXRP: 0,
    lockedZAR: 0,
    lockedDAI: 0,
    lockedKCS: 0,
    lockedNEO: 0,
    otherPercentage: 0,
    totalBTC: 0,
    totalFreeBTC: 0,
    totalFreeUSDT: 0,
    totalLockedBTC: 0,
    totalLockedUSDT: 0,
    totalUSDT: 0,
  };
}

/**
 * Transform providers stats response to typed ProvidersStatsCollection.
 *
 * @param {*} response Trade API get user balance raw response.
 * @returns {ProvidersStatsCollection} Provider Stats list.
 */
export function providersStatsResponseTransform(response) {
  if (!isArray(response)) {
    throw new Error("Response must be an array of provider stats.");
  }

  return response.map((providerStatsItem) => {
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
  const transformedResponse = assign(emptyProviderStatsEntity, toCamelCaseKeys(providerStatsItem));

  return transformedResponse;
}

/**
 * Create provider stats entity.
 *
 * @returns {ProviderStats} User balance entity.
 */

function createProviderStatsEmptyEntity() {
  return {
    providerId: "",
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
    avgI24hHigherPricePercentage: "",
    avgI24hLowerBeforeHigherPricePercentage: "",
    avgI24hLowerPricePercentage: "",
    avgI24hSecondsUntilHigherPrice: "",
    avgI24hSecondsUntilLowerBeforeHigherPrice: "",
    avgI24hSecondsUntilLowerPrice: "",
    avgI3dHigherPricePercentage: "",
    avgI3dLowerBeforeHigherPricePercentage: "",
    avgI3dLowerPricePercentage: "",
    avgI3dSecondsUntilHigherPrice: "",
    avgI3dSecondsUntilLowerBeforeHigherPrice: "",
    avgI3dSecondsUntilLowerPrice: "",
    avgI1wHigherPricePercentage: "",
    avgI1wLowerBeforeHigherPricePercentage: "",
    avgI1wLowerPricePercentage: "",
    avgI1wSecondsUntilHigherPrice: "",
    avgI1wSecondsUntilLowerBeforeHigherPrice: "",
    avgI1wSecondsUntilLowerPrice: "",
    avgI1mHigherPricePercentage: "",
    avgI1mLowerBeforeHigherPricePercentage: "",
    avgI1mLowerPricePercentage: "",
    avgI1mSecondsUntilHigherPrice: "",
    avgI1mSecondsUntilLowerBeforeHigherPrice: "",
    avgI1mSecondsUntilLowerPrice: "",
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

/**
 * @typedef {Object} ServerTime
 * @property {number} serverTime
 * @property {number} dbTime
 */

/**
 * Create empty ServerTime value object.
 *
 * @returns {ServerTime} Empty object of this type.
 */
function createServerTimeEmptyValueObject() {
  return {
    serverTime: 0,
    dbTime: 0,
  };
}

/**
 * Transform server time response to typed ServerTime.
 *
 * @param {*} response Trade API get quotes list raw response.
 * @returns {ServerTime} Quote assets.
 */
export function serverTimeResponseTransform(response) {
  return assign(createServerTimeEmptyValueObject(), response, {
    dbTime: parseInt(response.dbTime),
  });
}

/**
 * @typedef {Object} CoinRayToken
 * @property {string} jwt
 */

/**
 * Create empty CoinRayToken value object.
 *
 * @returns {CoinRayToken} Empty object of this type.
 */
function createCoinRayTokenEmptyValueObject() {
  return {
    jwt: "",
  };
}

/**
 * Transform coinray token response to typed CoinRayToken
 *
 * @param {*} response Trade API get quotes list raw response.
 * @returns {CoinRayToken} Coinray token value object.
 */
export function coinRayTokenResponseTransform(response) {
  return assign(createCoinRayTokenEmptyValueObject(), response);
}

/**
 * @typedef {Object} MarketSymbol
 * @property {string} id
 * @property {string} symbol
 * @property {string} base
 * @property {string} quote
 * @property {string} baseId
 * @property {string} quoteId
 * @property {PricePrecision} precision
 * @property {SymbolLimits} limits
 * @property {string} coinrayQuote
 * @property {string} coinrayBase
 */

/**
 * @typedef {Object} SymbolLimits
 * @property {AmountLimit} cost:
 * @property {AmountLimit} price:
 * @property {AmountLimit} amount:
 */

/**
 * @typedef {Object} AmountLimit
 * @property {number} min:
 * @property {number} max:
 */

/**
 * @typedef {Object} PricePrecision
 *
 * @property {number} amount:
 * @property {number} price:
 */

/**
 * @typedef {Array<MarketSymbol>} MarketSymbolsCollection
 */

/**
 * Create empty market symbol value object.
 *
 * @returns {MarketSymbol} Empty market symbol value object.
 */
function createMarketSymbolEmptyValueObject() {
  return {
    id: "",
    symbol: "",
    base: "",
    quote: "",
    baseId: "",
    quoteId: "",
    precision: { amount: 0, price: 0 },
    limits: {
      cost: { min: 0, max: 0 },
      price: { min: 0, max: 0 },
      amount: { min: 0, max: 0 },
    },
    coinrayQuote: "",
    coinrayBase: "",
  };
}

/**
 * Transform exchange connection market data response to typed collection.
 *
 * @param {*} response Trade API get quotes list raw response.
 * @returns {MarketSymbolsCollection} Coinray token value object.
 */
export function exchangeMarketDataResponseTransform(response) {
  if (!isArray(response)) {
    throw new Error("Response must be an array of market symbols.");
  }

  return response.map(exchangeMarketDataItemTransform);
}

/**
 * Transform market data response item to typed MarketSymbol.
 *
 * @param {*} symbolsDataItem Market data symbol.
 * @returns {MarketSymbol} Market data symbol value object.
 */
function exchangeMarketDataItemTransform(symbolsDataItem) {
  return assign(createMarketSymbolEmptyValueObject(), symbolsDataItem);
}

/**
 * Transform quote assets response to typed QuoteAssetsDict.
 *
 * @param {*} response Trade API get quotes list raw response.
 * @returns {QuoteAssetsDict} Quote assets.
 */
export function quotesResponseTransform(response) {
  if (!isObject(response)) {
    throw new Error("Response must be an object with different properties.");
  }

  return Object.entries(response).reduce(
    (res, [key, val]) => ({
      ...res,
      [key]: {
        quote: val.quote,
        minNotional: val.minotional,
      },
    }),
    {},
  );
}

/**
 * Transform base assets response to typed BaseAssetsDict.
 *
 * @param {*} response Trade API get quotes list raw response.
 * @returns {BaseAssetsDict} Base assets.
 */
export function basesResponseTransform(response) {
  if (!isObject(response)) {
    throw new Error("Response must be an object with different properties.");
  }

  return Object.entries(response).reduce(
    (res, [key, val]) => ({
      ...res,
      [key]: {
        quote: val.quote,
        base: val.base,
      },
    }),
    {},
  );
}

/**
 * Transform connected provider user info to typed ConnectedProviderUserInfo.
 *
 * @param {*} response Connected provider user info raw response.
 * @returns {ConnectedProviderUserInfo} User info.
 */
export function connectedProviderUserInfoResponseTransform(response) {
  if (!isObject(response)) {
    throw new Error("Response must be an object with different properties.");
  }

  return createConnectedProviderUserInfoEntity(response);
}

/**
 * Create connected provider user info entity.
 *
 * @param {*} response Trade API user balance raw raw response.
 * @returns {ConnectedProviderUserInfo} User balance entity.
 */
function createConnectedProviderUserInfoEntity(response) {
  return {
    currentAllocated: response.currentAllocated,
    profitsSinceCopying: response.profitsSinceCopying,
  };
}

/**
 *
 * @typedef {Object} DefaultProviderClonedFromObject
 * @property {String} $oid
 */

/**
 *
 * @typedef {Object} DefaultProviderAllocatedUpdatedAtDateObject
 * @property {String} $numberlong
 */

/**
 *
 * @typedef {Object} DefaultProviderAllocatedUpdatedAtObject
 * @property {DefaultProviderAllocatedUpdatedAtDateObject} $date
 */

/**
 *
 * @typedef {Object} DefaultProviderUserPaymentObject
 * @property {String} userId
 */

/**
 *
 * @typedef {Object} DefaultProviderOptions
 * @property {Boolean} acceptUpdateSignal
 * @property {Boolean} allowSendingBuyOrdersAsMarket
 * @property {Boolean} balanceFilter
 * @property {Boolean} enablePanicSellSignals
 * @property {Boolean} enableSellSignals
 * @property {Boolean} limitPriceFromSignal
 * @property {Boolean} reBuyFromProvider
 * @property {Boolean} reBuysFromSignal
 * @property {Boolean} reUseSignalIdIfClosed
 * @property {Boolean} riskFilter
 * @property {Boolean} stopLossFromSignal
 * @property {Boolean} successRateFilter
 * @property {Boolean} takeProfitsFromSignal
 * @property {Boolean} terms
 * @property {Boolean} trailingStopFromSignal
 */

/**
 *
 * @typedef {Object} DefaultProviderStripeObject
 * @property {Boolean} cancelAtPeriodEnd
 * @property {String} cancelDate
 * @property {String} email
 * @property {Boolean} enable
 * @property {String} paymentGateway
 * @property {String} trialStartedAt
 */

/**
 *
 * @typedef {Object} DefaulProviderInternalPaymentObject
 * @property {Boolean} isPremium
 * @property {String} merchantId
 * @property {Number} price
 * @property {Number} trial
 * @property {String} ipnSecret
 */

/**
 *
 * @typedef {Object} DefaultProviderTeamObject
 * @property {String} name
 * @property {String} countryCode
 */

/**
 *
 * @typedef {Object} DefaultProviderSocialObject
 * @property {String} network
 * @property {String} link
 */

/**
 *
 * @typedef {Object} DefaultProviderPermormanceWeeklyStats
 * @property {Number} week
 * @property {Number} return
 * @property {String} day
 * @property {Number} positions
 */

/**
 *
 * @typedef {Object} DefaultProviderPermormanceObject
 * @property {Number} closePositions
 * @property {Array<DefaultProviderPermormanceWeeklyStats>} weeklyStats
 * @property {Number} openPositions
 * @property {Number} totalBalance
 * @property {Number} totalTradingVolume
 */

/**
 * Default Single Provider object from 'getProvider' endpoint.
 *
 * @typedef {Object} DefaultProviderGetObject
 * @property {Boolean} connected
 * @property {String} copyTradingQuote
 * @property {String} description
 * @property {Boolean} disable
 * @property {String} exchangeInternalId
 * @property {String} exchangeType
 * @property {Array<String>} exchanges
 * @property {String} fee
 * @property {Boolean} hasBeenUsed
 * @property {Boolean} hasRecommendedSettings
 * @property {String} id
 * @property {DefaulProviderInternalPaymentObject} internalPaymentInfo
 * @property {Boolean} isAdmin
 * @property {Boolean} isClone
 * @property {Boolean} isCopyTrading
 * @property {Boolean} key
 * @property {Boolean} list
 * @property {String} logoUrl
 * @property {String} longDesc
 * @property {Number} minAllocatedBalance
 * @property {String} name
 * @property {DefaultProviderOptions} options
 * @property {Boolean} public
 * @property {String} shortDesc
 * @property {DefaultProviderUserPaymentObject} userPaymentInfo
 * @property {String} website
 * @property {Number} allocatedBalance
 * @property {DefaultProviderAllocatedUpdatedAtObject} allocatedBalanceUpdatedAt
 * @property {Boolean} balanceFilter
 * @property {DefaultProviderClonedFromObject} clonedFrom
 * @property {String} createdAt
 * @property {Boolean} enableInProvider
 * @property {String} originalBalance
 * @property {String} profitsFromClosedBalance
 * @property {Boolean} reBuyFromProvider
 * @property {Boolean} riskFilter
 * @property {Boolean} successRateFilter
 * @property {Boolean} terms
 * @property {Array<DefaultProviderTeamObject>} team
 * @property {Array<DefaultProviderSocialObject>} social
 * @property {String} about
 * @property {String} strategy
 * @property {DefaultProviderPermormanceObject} performance
 * @property {Number} avgHoldingTime
 * @property {Number} activeSince
 * @property {Number} avgTradesPerWeek
 * @property {Number} profitableWeeks
 * @property {Number} followers
 * @property {DefaultProviderStripeObject} stripe
 */

/**
 *
 * @param {*} response
 * @returns {DefaultProviderGetObject}
 */

export function providerGetResponseTransform(response) {
  if (!isObject) {
    throw new Error("Response must be an object with different properties.");
  }

  let emptyProviderEntity = createEmptyProviderGetEntity();
  return { ...emptyProviderEntity, ...response };
}

function createEmptyProviderGetEntity() {
  return {
    connected: false,
    copyTradingQuote: "",
    description: "",
    disable: false,
    exchangeInternalId: false,
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
    team: [{}],
    social: [{}],
    about: "",
    performance: {
      closePositions: 0,
      weeklyStats: [{ week: 0, return: 0 }],
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
  };
}

/**
 * Transform user exchange connection to typed ExchangeConnectionEntity.
 *
 * @param {*} response Trade API get exchanges raw response.
 * @returns {Array<ExchangeListEntity>} User exchange connections collection.
 */

export function exchangeListResponseTransform(response) {
  if (!isArray(response)) {
    throw new Error("Response must be an array of positions.");
  }

  return response.map((exchangeConnectionItem) => {
    return exchangeListResponseItemTransform(exchangeConnectionItem);
  });
}

/**
 * @typedef {Object} ExchangeListEntity
 * @property {String} id
 * @property {String} name
 * @property {Boolean} enabled
 * @property {Array<String>} type
 * @property {Array<String>} testNet
 * @property {Array<String>} requiredAuthFields
 */

/**
 * Transform API exchange connection item to typed object.
 *
 * @param {*} exchangeConnectionItem Trade API exchange connection item.
 * @returns {ExchangeListEntity} Exchange connection entity.
 */
function exchangeListResponseItemTransform(exchangeConnectionItem) {
  const emptyExchangeListEntity = createExchangeListEmptyEntity();
  const transformedResponse = assign(emptyExchangeListEntity, exchangeConnectionItem);

  return transformedResponse;
}

function createExchangeListEmptyEntity() {
  return {
    enabled: false,
    id: "",
    name: "",
    requiredAuthFields: [""],
    testNet: [""],
    type: [""],
  };
}
/**
 * @typedef {Object} CopyTradersProvidersOptionsPayload
 * @property {string} token User access token.
 * @property {String} internalExchangeId
 */

/**
 * @typedef {Object} CopyTradersProvidersOption
 * @property {number} providerId
 * @property {string} providerName
 * @property {boolean} providerQuote
 */

/**
 * @typedef {Array<CopyTradersProvidersOption>} CopyTradersProvidersOptionsCollection
 */

/**
 * Transform own copy traders providers options to typed CopyTradersProvidersOptionsCollection.
 *
 * @param {*} response Trade API own copy traders providers options raw response.
 * @returns {CopyTradersProvidersOptionsCollection} Options collection.
 */
export function ownCopyTraderProvidersOptionsResponseTransform(response) {
  if (!isArray(response)) {
    throw new Error("Response must be an array of copy trader providers options.");
  }

  return response.map(ownCopyTraderProviderOptionResponseTransform);
}

/**
 * Transform own copy traders providers option to typed CopyTradersProvidersOption.
 *
 * @param {*} option Trade API own copy traders providers options raw response.
 * @returns {CopyTradersProvidersOption} Options collection.
 */

function ownCopyTraderProviderOptionResponseTransform(option) {
  return assign(createEmptyOwnCopyTraderProviderOption(), option);
}

/**
 * Create empty own copy trader option.
 *
 * @returns {CopyTradersProvidersOption} Own copy trader empty option.
 */
function createEmptyOwnCopyTraderProviderOption() {
  return {
    providerId: 0,
    providerName: "",
    providerQuote: false,
  };
}

/**
 * Transform user exchange connection to typed ExchangeConnectionEntity.
 *
 * @param {*} response Trade API get exchanges raw response.
 * @returns {Array<ProviderFollowerEntity>} User exchange connections collection.
 */

export function providerFollowersResponseTransform(response) {
  if (!isArray(response)) {
    throw new Error("Response must be an array of positions.");
  }

  let list = response.map((providerFollowersItem) => {
    return providerFollowersResponseItemTransform(providerFollowersItem);
  });
  list = list.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  return list;
}

/**
 * @typedef {Object} ProviderFollowerEntity
 * @property {String} date
 * @property {Number} followers
 * @property {Number} totalFollowers
 */

/**
 * Transform API exchange connection item to typed object.
 *
 * @param {*} providerFollowersItem Trade API exchange connection item.
 * @returns {ProviderFollowerEntity} Exchange connection entity.
 */
function providerFollowersResponseItemTransform(providerFollowersItem) {
  const emptyExchangeListEntity = createProviderFollowersEmptyEntity();
  const transformedResponse = assign(emptyExchangeListEntity, providerFollowersItem);

  return transformedResponse;
}

function createProviderFollowersEmptyEntity() {
  return {
    enabled: false,
    id: "",
    name: "",
    requiredAuthFields: [""],
    testNet: [""],
    type: [""],
  };
}

/**
 * Transform provider followers list response item to ProviderFollowersListEntity.
 *
 * @param {*} response Trade API get provider followers list response.
 * @returns {Array<ProviderFollowersListEntity>} Provider followers list collection.
 */

export function providerFollowersListResponseTransform(response) {
  if (!isArray(response)) {
    throw new Error("Response must be an array of positions.");
  }

  return response.map((providerFollowersListItem) => {
    return providerFollowersListItemTransform(providerFollowersListItem);
  });
}

/**
 * @typedef {Object} ProviderFollowersListEntity
 * @property {String} userId
 * @property {String} name
 * @property {String} email
 * @property {Boolean} connected
 * @property {String} allocatedBalance
 * @property {Boolean} active
 * @property {String} cancelDate
 * @property {String} code
 * @property {String} profitsFromClosedBalance
 * @property {Boolean} realExchangeConnected
 * @property {Boolean} suspended
 * @property {String} lastTransactionId
 */

/**
 * Transform provider followers list response item to typed object.
 *
 * @param {*} providerFollowersListItem Provider followers list response item.
 * @returns {ProviderFollowersListEntity} Provider Followers List Item entity.
 */
function providerFollowersListItemTransform(providerFollowersListItem) {
  const emptyProviderFollowersListEntity = createProviderFollowersListEmptyEntity();
  const transformedResponse = assign(emptyProviderFollowersListEntity, providerFollowersListItem);

  return transformedResponse;
}

function createProviderFollowersListEmptyEntity() {
  return {
    active: false,
    allocatedBalance: "",
    cancelDate: "-",
    code: "-",
    connected: false,
    email: "0",
    lastTransactionId: "-",
    name: "",
    profitsFromClosedBalance: "",
    realExchangeConnected: false,
    suspended: false,
    userId: "",
  };
}

/**
 * @typedef {Object} CoinNetwork
 * @property {string} name
 * @property {string} network
 * @property {string} coin
 * @property {string} addressRegex
 * @property {string} depositDesc
 * @property {string} depositEnable
 * @property {boolean} isDefault
 * @property {string} memoRegex
 * @property {boolean} resetAddressStatus
 * @property {string} specialTips
 * @property {string} withdrawDesc
 * @property {boolean} withdrawEnable
 * @property {string} withdrawFee
 * @property {string} withdrawMin
 */

/**
 * @typedef {Object} ExchangeAsset
 * @property {string} name
 * @property {string} balanceFree
 * @property {string} balanceLocked
 * @property {string} balanceTotal
 * @property {string} balanceFreeBTC
 * @property {string} balanceLockedBTC
 * @property {string} balanceTotalBTC
 * @property {string} balanceFreeUSDT
 * @property {string} balanceLockedUSDT
 * @property {string} balanceTotalUSDT
 * @property {string} balanceTotalExchCoin
 * @property {string} exchCoin
 * @property {Array<CoinNetwork>} networks
 */

/**
 * @typedef {Object.<string, ExchangeAsset>} ExchangeAssetsDict
 */

/**
 * Transform provider followers list response item to ProviderFollowersListEntity.
 *
 * @param {*} response Trade API get exchange assets list response.
 * @returns {ExchangeAssetsDict} Exchange asssets.
 */

export function exchangeAssetsResponseTransform(response) {
  if (!isObject(response)) {
    throw new Error("Response must be an object with different properties.");
  }
  return Object.entries(response).reduce(
    (res, [key, val]) => ({
      ...res,
      [key]: exchangeAssetsItemTransform(val),
    }),
    {},
  );
}

/**
 *
 * @param {*} exchangeAssetItem Exchange assets list response item.
 * @returns {ExchangeAssetsDict} Exchange assets.
 */
function exchangeAssetsItemTransform(exchangeAssetItem) {
  const emptyExchangeAssetsEntity = createExchangeAssetsEmptyEntity();
  const transformedResponse = assign(emptyExchangeAssetsEntity, exchangeAssetItem);

  return transformedResponse;
}

/**
 * @returns {ExchangeAsset} Exchange asset
 */
function createExchangeAssetsEmptyEntity() {
  return {
    name: "",
    balanceFree: "0.000000000000",
    balanceLocked: "0.000000000000",
    balanceTotal: "0.000000000000",
    balanceFreeBTC: "0.000000000000",
    balanceLockedBTC: "0.000000000000",
    balanceTotalBTC: "0.000000000000",
    balanceFreeUSDT: "0.000000000000",
    balanceLockedUSDT: "0.000000000000",
    balanceTotalUSDT: "0.000000000000",
    balanceTotalExchCoin: "0.000000000000",
    exchCoin: "",
    networks: [],
  };
}

/**
 * Create Exchange Deposit Address entity.
 *
 * @param {*} response Trade API user balance raw response.
 * @returns {ExchangeDepositAddress} Exchange Deposit Address entity.
 */
export function exchangeDepositAddressResponseTransform({ currency, address, tag }) {
  return {
    currency,
    address,
    tag,
  };
}

/**
 *
 * @typedef {Object} ProviderPerformanceEntity
 * @property {Number} closePositions
 * @property {Number} openPositions
 * @property {Number} totalBalance
 * @property {Number} totalTradingVolume
 * @property {Array<DefaultProviderPermormanceWeeklyStats>} weeklyStats
 */

/**
 *
 * @param {*} response
 * @returns {ProviderPerformanceEntity}
 */

export function providerPerformanceResponseTransform(response) {
  if (!isObject) {
    throw new Error("Response must be an object with different properties.");
  }

  let emptyProviderEntity = createProviderPerformanceEmptyEntity();
  return { ...emptyProviderEntity, ...response };
}

function createProviderPerformanceEmptyEntity() {
  return {
    closePositions: 0,
    openPositions: 0,
    totalBalance: 0,
    totalTradingVolume: 0,
    weeklyStats: [{}],
  };
}

/**
 * Transform exchange deposit list response item to ExchangeDepositEntity list.
 *
 * @param {*} response Trade API get exchange deposits list response.
 * @returns {Array<ExchangeDepositEntity>} Exchange Deposits list collection.
 */
export function exchangeDepositsResponseTransform(response) {
  if (!isArray(response)) {
    throw new Error("Response must be an array of deposit.");
  }

  return response.map((exchangeDepositsItem) => {
    return exchangeDepositItemTransform(exchangeDepositsItem);
  });
}

/**
 * @typedef {Object} ExchangeDepositEntity
 * @property {String} id
 * @property {String} txid
 * @property {Number} timestamp
 * @property {String} datetime
 * @property {String} address
 * @property {String} tag
 * @property {String} type
 * @property {Number} amount
 * @property {String} currency
 * @property {String} status
 * @property {String} fee
 */

/**
 * Transform exchange deposits list response item to typed object.
 *
 * @param {*} exchangeDepositItem Exchange Deposit response item.
 * @returns {ExchangeDepositEntity} Exchange Deposit Item entity.
 */
function exchangeDepositItemTransform(exchangeDepositItem) {
  const emptyExchangeDepositEntity = createExchangeDepositEmptyEntity();
  const transformedResponse = assign(emptyExchangeDepositEntity, exchangeDepositItem);

  return transformedResponse;
}

function createExchangeDepositEmptyEntity() {
  return {
    id: "",
    txid: "",
    timestamp: 0,
    datetime: "",
    address: "",
    tag: "",
    type: "",
    amount: 0,
    currency: "USDT",
    status: "ok",
    fee: "",
  };
}

/**
 * Transform withdraw reply to typed WithdrawReply
 *
 * @param {*} response Trade API withdraw response.
 * @returns {WithdrawReply} Withdraw reply object.
 */
export function withdrawResponseTransform(response) {
  return {
    id: response.id,
  };
}

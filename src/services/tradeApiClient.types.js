import moment from "moment";
import dayjs from "dayjs";
import { assign, isArray, isObject, mapValues, isString, toNumber } from "lodash";
import { toCamelCaseKeys, formatFloat, formatFloat2Dec } from "../utils/format";
import defaultProviderLogo from "../images/defaultProviderLogo.png";

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
 * @type {('multi')}
 */
export const POSITION_ENTRY_TYPE_MULTI = "multi";

/**
 * @typedef {('SHORT' | 'LONG')} PositionEntrySide
 */

/**
 * @typedef {("market" | "limit" | "stop_loss_limit" | "import" | 'multi')} PositionOrderType
 */

/**
 * @typedef {Object} CreatePositionPayload
 * @property {string} token Authorization token.
 * @property {string} pair Currency pair i.e. "USDT BTC".
 * @property {number} limitPrice Order limit price.
 * @property {string} positionSizeQuote Quote (currency) that represent the position size.
 * @property {number} positionSize Position size.
 * @property {number} [realInvestment] Real invested amount excluding the leverage.
 * @property {PositionEntrySide} side Position side.
 * @property {number|boolean} stopLossPercentage Stop loss percentage.
 * @property {number|boolean} buyTTL Entry order time to live expiration.
 * @property {PositionOrderType} type Entry order type.
 * @property {number} [buyStopPrice] Entry stop price.
 * @property {number|boolean} sellByTTL Auto exit time to live.
 * @property {Array<PositionProfitTarget>|boolean} takeProfitTargets Take profit targets.
 * @property {Array<PositionDCATarget>|boolean} reBuyTargets Rebuy / DCA targets.
 * @property {number|boolean} trailingStopTriggerPercentage Percentage that when crossed activate the trailing stop.
 * @property {number|boolean} trailingStopPercentage Percentage distance from current price that will keep moving trailing stop price following the trend.
 * @property {number|string} providerId Copy trader provider ID or "1" when is a manual signal.
 * @property {string} providerName Provider name when is a position published for copy trader service.
 * @property {string} exchangeName Exchange name.
 * @property {string} internalExchangeId Exchange connection ID.
 * @property {number} [positionSizePercentage] Position size as percentage, used to calculate position size from allocated balance for copy trader followers positions.
 * @property {boolean} [postOnly]
 */

/**
 * @typedef {Object} PositionProfitTarget
 * @property {number} targetId
 * @property {number} priceTargetPercentage
 * @property {number} [priceTarget]
 * @property {string} [pricePriority] Use price or percentage
 * @property {number} amountPercentage
 * @property {boolean} [postOnly]
 */

/**
 * @typedef {Object} PositionDCATarget
 * @property {number} targetId
 * @property {number} priceTargetPercentage
 * @property {number} [priceTarget]
 * @property {string} [pricePriority] Use price or percentage
 * @property {number} amountPercentage
 * @property {boolean} [postOnly]
 */

/**
 * @typedef {Object} PositionActionPayload
 * @property {string} positionId Position ID to cancel.
 * @property {string} token Access token.
 */

/**
 * @typedef {Object} PositionGetPayload
 * @property {string} positionId Position ID to cancel.
 * @property {string} token Access token.
 * @property {string} internalExchangeId Exchange connection ID associated to the position.
 */

/**
 * Payload to update existing position, the size could be increased passing optional parameters.
 *
 * @typedef {Object} UpdatePositionPayload
 * @property {string} token Authorization token.
 * @property {number} [limitPrice] Order limit price.
 * @property {string} [positionSizeQuote] Quote (currency) that represent the position size.
 * @property {number} [positionSize] Position size.
 * @property {number} [buyStopPrice] Entry stop price.
 * @property {number} [realInvestment] Real invested amount excluding the leverage.
 * @property {number} [positionSizePercentage] Position size as percentage, used to calculate position size from allocated balance for copy trader followers positions.
 * @property {PositionOrderType} [buyType] Entry order type.
 * @property {PositionEntrySide} [side] Position side.
 * @property {number|boolean} stopLossPercentage Stop loss percentage.
 * @property {Array<PositionProfitTarget>|boolean} takeProfitTargets Take profit targets.
 * @property {Array<PositionDCATarget>|boolean} reBuyTargets Rebuy / DCA targets.
 * @property {number|boolean} trailingStopTriggerPercentage Percentage that when crossed activate the trailing stop.
 * @property {number|boolean} trailingStopPercentage Percentage distance from current price that will keep moving trailing stop price following the trend.
 * @property {number|string} providerId Copy trader provider ID or "1" when is a manual signal.
 * @property {string} providerName Provider name when is a position published for copy trader service.
 * @property {string} internalExchangeId Exchange connection ID.
 * @property {number} [reduceTargetPercentage] The reduce order target in percentage from the average entry price, or from the last entry price if recurring is selected.
 * @property {number} [reduceAvailablePercentage] The amount to be sold from the position available amount for this reduce order target.
 * @property {string} [reduceOrderType] The reduce order type that will be send to the exchange, options: market|limit
 * @property {boolean} [reduceRecurring] If checked, each time a new DCA is filled, a reduce order will be placed in the exchange.
 * @property {boolean} [reducePersistent] If checked, it won't close the position if there are pending DCAs.
 * @property {boolean} [removeReduceRecurringPersistent] Remove the flag recurring and persistent.
 * @property {Array<number>} [removeReduceOrder] An array with the list of targets ids for removing their reduce orders
 * @property {Array<number>} [removeAllReduceOrders] Remove all pending reduce orders.
 */

/**
 * @typedef {Object} UserLoginPayload
 * @property {string} email
 * @property {string} password
 * @property {string} gRecaptchaResponse
 */

/**
 * @typedef {Object} UserRegisterPayload
 * @property {string} firstName
 * @property {string} email
 * @property {string} password
 * @property {string} gRecaptchaResponse
 * @property {Boolean} terms
 * @property {Boolean} subscribe
 * @property {Boolean} array
 * @property {string} ref
 */

/**
 * @typedef {Object} UserExchangeAssetsPayload
 * @property {string} token
 * @property {string} internalId
 */

/**
 * @typedef {Object} GetProviderPayload
 * @property {string} token user's access token
 * @property {string} providerId Provider ID
 * @property {Number} version api endpoint version number.
 * @property {String} exchangeInternalId internal Id of selected exchange.
 */

/**
 * @typedef {Object} GetProviderFollowersPayload
 * @property {string} token user access token.
 * @property {string} providerId provider ID.
 */

/**
 * @typedef {Object} ConnectTraderPayload
 * @property {string} token
 * @property {string} providerId
 * @property {String} allocatedBalance
 * @property {String} exchangeInternalId
 * @property {Boolean} balanceFilter
 * @property {Boolean} connected
 */

/**
 * @typedef {Object} ConnectProviderPayload
 * @property {string} token
 * @property {string} providerId
 * @property {String} exchangeInternalId
 * @property {Boolean} connected
 * @property {Boolean} [acceptUpdateSignal]
 * @property {Boolean} [allowSendingBuyOrdersAsMarket]
 * @property {Boolean} [enablePanicSellSignals]
 * @property {Boolean} [enableSellSignals]
 * @property {Boolean} [limitPriceFromSignal]
 * @property {Boolean} [reBuyFromProvider]
 * @property {Boolean} [reBuysFromSignal]
 * @property {Boolean} [reUseSignalIdIfClosed]
 * @property {Boolean} [riskFilter]
 * @property {Boolean} [stopLossFromSignal]
 * @property {Boolean} [successRateFilter]
 * @property {Boolean} [takeProfitsFromSignal]
 * @property {Boolean} [terms]
 * @property {Boolean} [trailingStopFromSignal]
 * @property {Boolean} [useLeverageFromSignal]
 * @property {String} [customerKey]
 * @property {Boolean} [reBuyFirst]
 * @property {Boolean} [reBuyAll]
 * @property {Boolean} [reBuyLast]
 * @property {Boolean} [takeProfitFirst]
 * @property {Boolean} [takeProfitAll]
 * @property {Boolean} [takeProfitLast]
 * @property {Number} [quantityPercentage]
 * @property {Number} [limitReBuys]
 * @property {Boolean} [short]
 * @property {Boolean} [shortmid]
 * @property {Boolean} [mid]
 * @property {Boolean} [long]
 * @property {Number} [risk]
 * @property {Number} [successRate]
 */

/**
 * @typedef {Object} DisableProviderPayload
 * @property {string} token
 * @property {string} providerId
 * @property {String} type
 * @property {Boolean} disable
 */

/**
 * @typedef {Object} DisconnectProviderPayload
 * @property {string} token User's session token
 * @property {string} providerId Provider Id
 * @property {String} disconnectionType Disconnection type.
 * @property {String} internalExchangeId Internal Id of connected exchange.
 */

/**
 * @typedef {Object} CancelDisconnectProviderPayload
 * @property {string} token User's session token
 * @property {string} providerId Provider Id
 * @property {String} internalExchangeId Internal Id of connected exchange.
 */

/**
 * @typedef {Object} DeleteProviderPayload
 * @property {string} token
 * @property {string} providerId
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
 * @property {String} about
 * @property {String} strategy
 * @property {Array<DefaultProviderSocialObject>} social
 * @property {Array<DefaultProviderTeamObject>} team
 * @property {DefaultProviderOptions} [options]
 */

/**
 * @typedef {Object} EditClonedProvderPayload
 * @property {string} token
 * @property {string} providerId
 * @property {String} name
 * @property {String} logoUrl
 */

/**
 * @typedef {Object} UserEntity
 * @property {string} token User access token.
 * @property {string} firstName User first name.
 * @property {string} email User email.
 * @property {boolean} ask2FA Indicates if 2FA should be asked.
 * @property {string} userId User ID.
 * @property {string} createdAt Creation timestamp: e.g. (2020-05-14T14:34:48).
 * @property {boolean} providerEnable Indicates if user is subscribed to signal providers.
 * @property {boolean} twoFAEnable Indicate if 2FA is enabled.
 * @property {string} ref
 * @property {boolean} subscribe
 * @property {boolean} isAdmin Indicate if user is administrator.
 * @property {boolean} binanceConnected Indicates if user has Binance exchange connected.
 * @property {number} buysCount Counts the number of buys positions.
 * @property {number} sellsCount Counts the number of sell positions.
 * @property {string} planId Reference of the Zignaly subscription plan.
 * @property {string} planName Name of the Zignaly plan that user is subscribed to.
 * @property {string} planType
 * @property {string} projectId
 * @property {boolean} minimumProviderSettings
 * @property {number} status Indicate if user is active or not.
 * @property {Onboarding} onboarding Indicate user onboarding stage.
 * @property {string} refCode
 * @property {string} dashlyEchoAuth
 * @property {string} dashlyHash
 * @property {string} userName
 * @property {string} imageUrl
 * @property {string} firstPositionClosedAt
 * @property {string} firstPositionOpenedAt
 * @property {string} firstRealPositionClosedAt
 * @property {string} firstRealPositionOpenedAt
 * @property {boolean} hasActivated
 * @property {string} hasActivatedAt
 * @property {string} hasRegisteredAt
 * @property {boolean} isSupport
 * @property {string} lastPositionClosedAt
 * @property {string} lastPositionOpenedAt
 * @property {string} lastRealPositionClosedAt
 * @property {string} lastRealPositionOpenedAt
 * @property {number} positionBuysCount
 * @property {number} positionSellsCount
 * @property {number} realPositionBuysCount
 * @property {number} realPositionSellsCount
 * @property {string} role
 * @property {boolean} realExchangeConnected
 * @property {boolean} demoExchangeConnected
 * @property {Array<ExchangeConnectionEntity>} exchanges
 */

/**
 * @typedef {Object} Onboarding
 * @property {boolean} finished
 * @property {boolean} paused
 * @property {string} step
 */

/**
 * @typedef {Object} AuthorizationPayload
 * @property {string} token User access token.
 */

/**
 * @typedef {Object} ProviderExchangeSettingsPayload
 * @property {string} token User access token.
 * @property {string} internalExchangeId User exchange connection ID.
 * @property {String} providerId
 * @property {Number} version
 */

/**
 * @typedef {Object & ProviderExchangeSettingsPayload & ProviderExchangeSettingsObject} ProviderExchangeSettingsUpdatePayload
 * @property {boolean} exchangeId
 */

/**
 * @typedef {Object} UserBalancePayload
 * @property {string} token User access token.
 * @property {String} exchangeInternalId Internal ID of exchange.
 * @property {Boolean} [force] Flag to sync balance with exchange.
 */

/**
 * @typedef {Object} UserEquityPayload
 * @property {string} token User access token.
 * @property {String} exchangeInternalId Internal ID of exchange.
 */

/**
 * @typedef {Object} ProviderContractsPayload
 * @property {string} token User access token.
 * @property {String} exchangeInternalId Internal ID of exchange.
 * @property {String} providerId ID of provider.
 */

/**
 * @typedef {Object} CancelOrderPayload
 * @property {string} token User access token.
 * @property {String} exchangeInternalId Internal ID of exchange.
 * @property {String} orderId order ID.
 * @property {String} symbol symbol.
 * @property {String} providerId symbol.
 */

/**
 * @typedef {Object} CancelContractPayload
 * @property {string} token User access token.
 * @property {String} exchangeInternalId Internal ID of exchange.
 * @property {String} amount amount.
 * @property {String} symbol symbol.
 * @property {String} providerId symbol.
 */

/**
 * @typedef {Object} PositionsListPayload
 * @property {string} token User access token.
 * @property {string} internalExchangeId User exchange connection ID.
 * @property {boolean} [extendedStatuses] Flag to get log positions with all possibles status.
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
 * @typedef {Object} ProviderAssetsPayload
 * @property {string} exchangeInternalId
 * @property {string} providerId
 */

/**
 *
 * @typedef {Object} PositionEntityTotals
 * @property {Number} openPositions
 * @property {Number} totalPositions
 * @property {Number} totalPositionSize
 * @property {Number} soldPositions
 *
 */

/**
 *
 * @typedef {Object} MultiSideData
 * @property {Number} amount
 * @property {string} price
 * @property {Number} priceDifference
 *
 */

/**
 * @typedef {Object} PositionEntity
 * @property {Object<number, ReBuyTarget>} reBuyTargets DCA/Rebuy targets.
 * @property {Object<number, ReduceOrder>} reduceOrders Reduce position orders.
 * @property {Object<number, ProfitTarget>} takeProfitTargets Take profit targets.
 * @property {Number} realInvestment Invested amount without including the leveraged part.
 * @property {boolean} accounting Flag that indicates if accounting is already calculated for a closed position.
 * @property {boolean} closed Flag that indicate when a position is closed.
 * @property {boolean} isCopyTrader Flag that indicates that this position owner and copy trader signal provider owner are the same.
 * @property {boolean} isCopyTrading Flag that indicates that position is derived from copy trader signal.
 * @property {boolean} paperTrading Flag that indicates that position is executed in paper trading (demo) exchange.
 * @property {boolean} trailingStopTriggered Flag that indicates when trailing stop is triggered.
 * @property {boolean} updating Flag that indicates that some position updates are in progress.
 * @property {number} buyTTL Expiration time of the entry order, if not filled during this seconds will be aborted.
 * @property {number} closeDate Close date represented in unix time epoch seconds.
 * @property {number} fees Exchange transaction fees.
 * @property {number} fundingFees Exchange transaction funding fees.
 * @property {boolean} profitSharing Flag to indicate if it is a profit sharing service position.
 * @property {number} leverage Futures position leverage level, X times real position size borrowed from exchange.
 * @property {number} netProfit Net profit amount.
 * @property {number} netProfitPercentage Net percentage profit.
 * @property {string} netProfitStyle Profit style (coloring) based on gain/loss.
 * @property {number} openDate Open date represented in unix time epoch seconds.
 * @property {number} positionSizeQuote Position size represented in quote currency.
 * @property {number} profit Profit amount without fees substraction.
 * @property {number} reBuyTargetsCountFail Rebuy / DCA targets that was executed with failures counter.
 * @property {number} reBuyTargetsCountPending Rebuy / DCA targets not yet reached and not executed counter.
 * @property {number} reBuyTargetsCountSuccess Rebuy / DCA targets succesfully executed counter.
 * @property {number} risk Invested amount percentage that is still in risk relative to current price and exit protections (stop loss / trailing stop).
 * @property {number} status Position status, see translations/en.yml STATUS section for detailed list.
 * @property {number} stopLossPercentage Price percentage stop loss, relative to entry price.
 * @property {number} stopLossPrice Stop loss price.
 * @property {string} stopLossPriority Stop loss priority (price or percentage).
 * @property {number} takeProfitTargetsCountFail Take profit targets that was executed with failures counter.
 * @property {number} takeProfitTargetsCountPending Take profit targets not yet reached and not executed counter.
 * @property {number} takeProfitTargetsCountSuccess Take profit targets succesfully executed counter.
 * @property {number} trailingStopPercentage Trailing stop distance percentage, the stop will move dynamically following the trend at this distance.
 * @property {number|boolean} trailingStopTriggerPrice Trailing stop trigger price or false when not enabled.
 * @property {number} trailingStopTriggerPercentage Trailing stop entry price percentage increase that will trigger the trailing stop start.
 * @property {string} trailingStopTriggerPriority Trailing stop loss priority (price or percentage).
 * @property {string} age Elapsed time since position was opened in human readable format.
 * @property {number} ageSeconds Elapsed seconds since position was opened.
 * @property {number} amount Position invested amount in quote currency.
 * @property {string} base Base currency ID, i.e. "BTC".
 * @property {number} buyPrice Quote currency price at the moment of order entry was filled.
 * @property {string} closeDateReadable Close date in human readable format.
 * @property {string} exchange Exchange name where position was filled.
 * @property {string} exchangeType Exchange type (futures / spot) used to operate the position.
 * @property {string} exchangeInternalName Exchange connection name where position was filled.
 * @property {string} exitPriceStyle Exit price style (coloring) based on gain/loss.
 * @property {string} internalExchangeId Exchange connection ID, reference the connection of an exchange to Zignaly account.
 * @property {string} exchangeInternalId Exchange connection ID, reference the connection of an exchange to Zignaly account.
 * @property {number} invested Invested amount on this position, including leveraged part.
 * @property {string} investedQuote Currency ID of the invested amount.
 * @property {string} openDateReadable Open date in human readable format.
 * @property {string} positionId Zignaly position ID.
 * @property {string} positionSize Position size in base currency.
 * @property {number} profitPercentage Percentage gain/loss of the position based on current price in relation to entry price.
 * @property {string} profitStyle Profit style (coloring) based on gain/loss.
 * @property {string} providerId Copy trader provider ID that originated the signal for position entry.
 * @property {string} providerOwnerUserId Copy trader service owner user ID.
 * @property {string} providerLink Copy trader provider profile page URL.
 * @property {string} logoUrl Copy trader provider logo (will be deprecated in favor of provideerLogo).
 * @property {string} providerLogo Copy trader provider logo.
 * @property {string} providerName Copy trader provider name.
 * @property {string} quote Quote currency ID.
 * @property {number} remainAmount Remaining position amount after apply take profits (decrease) / rebuy (increase).
 * @property {number} availableAmount Remaining position amount minus locked amount from pending buy/sell orders.
 * @property {string} riskStyle Risk style (coloring) based on gain/loss.
 * @property {number} sellPrice Exit price for closed position, current price for open positions.
 * @property {string} side Position side (LONG / SHORT).
 * @property {string} signalId Copy trader signal ID.
 * @property {string} stopLossStyle Stop loss style (coloring) based on gain / loss.
 * @property {string} pair Currency pair in separated format, i.e. "BTC/USDT".
 * @property {string} symbol Currency pair in separated format, i.e. "BTC/USDT".
 * @property {string} userId Zignaly user ID.
 * @property {('unsold' | 'sold' | 'unopened' | 'open' | 'log' | 'closed' | '')} type Position status category.
 * @property {PositionEntityTotals} copyTradingTotals Position totals stats, only apply for position of copy trader provider.
 * @property {Number} subPositions Followers copied positions derived from this position, only apply for position of copy trader provider.
 * @property {Number} returnFromAllocated Percentage return from copy trader service allocated balance.
 * @property {Number} returnFromInvestment Percentage return from copy trader service invested balance.
 * @property {Number} priceDifference Price difference from entry price.
 * @property {string} priceDifferenceStyle Price difference style (coloring) based on gain/loss.
 * @property {Number} unrealizedProfitLosses Unrealized profit / loss amount expressed in quote currency.
 * @property {Number} unrealizedProfitLossesPercentage Unrealized profit / loss percentage.
 * @property {string} unrealizedProfitStyle Unrealized profit style (coloring) based on gain/loss.
 * @property {Number} currentAllocatedBalance Allocated copy trading balance when the trade was open.
 * @property {Number} positionSizePercentage % of the balance that was allocated (Copy Traders).
 * @property {Number} liquidationPrice
 * @property {Number} markPrice
 * @property {Number} margin
 * @property {string} markPriceStyle
 * @property {string} unitsInvestment Units displayed for the investment.
 * @property {string} unitsAmount Units displayed when bought.
 * @property {string} short Short symbol name displayed in Zignaly.
 * @property {string} tradeViewSymbol TradingView symbol.
 * @property {{long: MultiSideData, short: MultiSideData}} [multiData] Price/Amount info for MULTI side position
 * @property {boolean} stopLossFollowsTakeProfit Stop Loss moves each time a take profit target is reached
 * @property {boolean} stopLossToBreakEven Stop Loss moves to break even (entry price) when take profit target is reached.
 * @property {boolean} isolated
 * @property {string} isolatedReadable
 */

/**
 * @typedef {Object} RealInvestment
 * @property {string} $numberDecimal
 */

/**
 * @typedef {Object} ReBuyTarget
 * @property {number} targetId
 * @property {number} triggerPercentage
 * @property {number} [priceTarget]
 * @property {string} [pricePriority] Use price or percentage
 * @property {number} quantity
 * @property {boolean} buying
 * @property {boolean} done
 * @property {string} orderId
 * @property {boolean} cancel
 * @property {boolean} skipped
 * @property {string} buyType
 * @property {string} errorMSG
 * @property {boolean} postOnly
 */

/**
 * @typedef {Object} ReduceOrder
 * @property {number} targetId
 * @property {string} type
 * @property {number} targetPercentage
 * @property {number} availablePercentage
 * @property {boolean} done
 * @property {boolean} recurring
 * @property {boolean} persistent
 * @property {string} orderId
 * @property {string} errorMSG
 * @property {string} price
 * @property {string} amount
 */

/**
 * @typedef {Object} ProfitTarget
 * @property {number} targetId
 * @property {number} amountPercentage
 * @property {boolean} done
 * @property {string} orderId
 * @property {number} priceTargetPercentage
 * @property {number} priceTarget
 * @property {number} pricePriority
 * @property {boolean} cancel
 * @property {boolean} skipped
 * @property {boolean} updating
 * @property {boolean} postOnly
 */

/**
 * @typedef {Array<PositionEntity>} UserPositionsCollection
 */

/**
 * @typedef {Array<UserEntity>} UsersCollection
 */

/**
 * @typedef {Object} ProvidersPayload
 * @property {string} token
 * @property {"connected"|"all"} type
 * @property {number} timeFrame
 * @property {Array<'copytraders'|'signal'|'profitsharing'>} provType
 * @property {boolean} [ro] Read only request
 * @property {string} internalExchangeId
 */

/**
 * @typedef {Object} ProvidersListPayload
 * @property {string} token
 * @property {boolean} ro
 * @property {string} internalExchangeId
 */

/**
 * @typedef {Object} DailyReturn
 * @property {Date} name Date
 * @property {number} [positions] Number of closed positions.
 * @property {number} returns % Returns
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
 * @property {boolean} ro Read only request
 * @property {Array<'signal'|'copytraders'|'profitsharing'>} provType
 */

/**
 * @typedef {Object} ProviderFollowers
 * @property {string} date
 * @property {number} followers New followers for this date
 * @property {number} totalFollowers Total followers at this date
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
 * @property {boolean|string} website
 * @property {Array<string>} exchanges
 * @property {boolean} key
 * @property {boolean} disable False if user is copying
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
 * @property {number} [newFollowers] New followers in the past 7 days
 * @property {number} returns
 * @property {number} floating
 * @property {number} openPositions
 * @property {number} closedPositions
 * @property {number} [totalSignals] Total signals for signal providers
 * @property {string} exchangeType
 * @property {string} exchangeInternalId Connected exchange account id
 * @property {boolean} profitSharing Connected exchange account id
 * @property {number} profitsShare Connected exchange account id
 * @property {string} profitsMode Connected exchange account id
 * @property {Array<ProviderFollowers>} [aggregateFollowers] Followers history data (signal providers)
 * @property {'signal'|'copytrading'|'profitsharing'} provType
 * @property {string} providerLink
 *
 */

/**
 * @typedef {Array<ProviderEntity>} ProvidersCollection
 */

/**
 * @typedef {Object} ProviderStats
 * @property {string} providerId
 * @property {string} name
 * @property {string} logoUrl
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
 * @property {number} minNotional
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
 * @property {string} exchangeInternalId
 */

/**
 * @typedef {Object} ConnectedProviderUserInfo
 * @property {number} currentAllocated Allocated balance with unrealized pnl.
 * @property {number} allocatedBalance Allocated balance without unrealized pnl.
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
 * @property {boolean} globalDelisting Avoid open position for delisted coins
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
 * @typedef {Object} ProfitStatsPayload
 * @property {Boolean} includeOpenPositions
 * @property {String} providerId
 * @property {String} quote
 * @property {Boolean} ro
 * @property {Number | Boolean} timeFrame
 * @property {String} timeFrameFormat
 * @property {String} token
 * @property {String} internalExchangeId
 */

/**
 * @typedef {Object} ProfileProviderStatsPayload
 * @property {String} providerId
 * @property {Boolean} ro
 * @property {String} token
 */

/**
 * @typedef {Object} GetTransactionsPayload
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
 * @property {string} id Transaction id.
 */

/**
 * @typedef {Object} ModifySubscriptionPayload
 * @property {string} token
 * @property {String} providerId
 * @property {String} followerId
 * @property {Number} days
 */

/**
 * @typedef {Object} CancelSubscriptionPayload
 * @property {string} token
 * @property {String} providerId
 * @property {String} followerId
 * @property {Boolean} cancel
 */

/**
 * @typedef {Object} ConvertPayload
 * @property {Array<string>} assets Assets to convert.
 * @property {string} internalId
 */

/**
 * @typedef {Object} TransObject
 * @property {string} amount
 * @property {string} asset
 * @property {string} serviceCharge
 * @property {string} transferredAmount
 */

/**
 * @typedef {Object} ConvertReply
 * @property {string} totalServiceCharge Total fees.
 * @property {string} totalTransferred Total amount transferred.
 * @property {Array<TransObject>} trans Converted coins transactions.
 */

/**
 * @typedef {Object} UpdatePasswordPayload
 * @property {string} password
 * @property {string} newPassword
 * @property {string} repeatPassword
 */

/**
 * @typedef {Object} TwoFAPayload
 * @property {string} code
 * @property {string} token
 */

/**
 * @typedef {Object} ChangeEmailRequestPayload
 * @property {String} token User session token
 * @property {String} [code] two FA code.
 */

/**
 * @typedef {Object} ChangeEmailVisitPayload
 * @property {String} token token received through the reset request.
 */

/**
 * @typedef {Object} ChangeEmailConfirmPayload
 * @property {String} token Token received through the reset request.
 * @property {String} email New email of the user.
 */

/**
 * @typedef {Object} ForgotPasswordStep1Payload
 * @property {String} email User's email.
 * @property {Boolean} array Default backend param equal to "true".
 * @property {String} [gRecaptchaResponse] Google captcha response.
 */

/**
 * @typedef {Object} ForgotPasswordStep3Payload
 * @property {string} token
 * @property {String} password
 * @property {String} [gRecaptchaResponse] Google captcha response.
 */

/**
 * @typedef {Object} ProfileNotifications
 * @property {boolean} emailEnable
 * @property {boolean} emailNews
 * @property {boolean} emailOpenPosition
 * @property {boolean} emailUpdatePosition
 * @property {boolean} emailSubscriptionWarning
 * @property {boolean} telegramEnable
 * @property {boolean} telegramNews
 * @property {boolean} telegramUpdatePosition
 * @property {boolean} telegramSubscriptionWarning
 * @property {string} telegramCode
 */

/**
 * @typedef {Object} ProfileNotificationsPayload
 * @property {ProfileNotifications} notifications
 */

/**
 * @typedef {Object} QuotesAssetsGetPayload
 * @property {boolean} ro
 * @property {string} token
 * @property {string} [exchangeInternalId] Exchange Internal ID
 * @property {number} version version of endpoint
 * @property {string} [exchangeId] Exchange ID
 * @property {string} [exchangeType] Exchange type
 */

/**
 * @typedef {Object} UserPayload
 * @property {string} userName
 * @property {string} [imageUrl]
 */

/**
 * @typedef {Object} GetPostsPayload
 * @property {string} providerId
 */

/**
 * @typedef {Object} CreatePostPayload
 * @property {string} providerId
 * @property {string} content
 */

/**
 * @typedef {Object} PostAuthor
 * @property {string} userId
 * @property {string} userName
 * @property {string} imageUrl
 * @property {string} isFollowing Flag indicating if author is following provider
 */

/**
 * @typedef {Object} Post
 * @property {string} id
 * @property {PostAuthor} author
 * @property {string} content
 * @property {boolean} removed
 * @property {number} createdAt
 * @property {number} spams
 * @property {number} likes
 * @property {boolean} unapproved Post has been unlisted by moderators
 * @property {Array<Post>} replies
 */

/**
 * @typedef {Object} AddReplyPayload
 * @property {string} postId
 * @property {string} [replyId] If replying to a comment
 * @property {string} content
 */

/**
 * @typedef {Object} GetProfitSharingBalanceHistoryPayload
 * @property {string} exchangeInternalId
 * @property {string} providerId
 */

/**
 * @typedef {Object} ProfitSharingBalanceEntry
 * @property {Date} date
 * @property {number} amount
 * @property {string} type
 */

/**
 * @typedef {Object} ProfitSharingBalanceHistory
 * @property {Array<ProfitSharingBalanceEntry>} entries
 * @property {number} watermark Hide-water mark
 * @property {number} currentBalance
 * @property {number} initBalance
 * @property {number} retain
 * @property {string} quote
 */

/**
 * @typedef {Object} AdjustMarginPayload
 * @property {string} positionId
 * @property {string} internalExchangeId
 * @property {number} amount
 */

/**
 * @typedef {Object} Disable2FAConfirmPayload
 * @property {string} apiKey An api key used to connect an exchange to zignaly
 * @property {string} token Reset link code
 */

/**
 * Transform user entity response to typed object.
 *
 * @export
 * @param {*} response Trade API user object.
 * @returns {UserEntity} User entity.
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
    twoFAEnable: response["2FAEnable"] ? response["2FAEnable"] : false,
    ref: response.ref ? response.ref : "",
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
    dashlyHash: response.dashlyHash ? response.dashlyHash : "",
    dashlyEchoAuth: response.dashlyEchoAuth ? response.dashlyEchoAuth : "",
    userName: response.userName,
    imageUrl: response.imageUrl,
    firstPositionClosedAt: response.firstPositionClosedAt,
    firstPositionOpenedAt: response.firstPositionOpenedAt,
    firstRealPositionClosedAt: response.firstRealPositionClosedAt,
    firstRealPositionOpenedAt: response.firstRealPositionOpenedAt,
    hasActivated: response.hasActivated,
    hasActivatedAt: response.hasActivatedAt,
    hasRegisteredAt: response.hasRegisteredAt,
    isSupport: response.isSupport,
    lastPositionClosedAt: response.lastPositionClosedAt,
    lastPositionOpenedAt: response.lastPositionOpenedAt,
    lastRealPositionClosedAt: response.lastRealPositionClosedAt,
    lastRealPositionOpenedAt: response.lastRealPositionOpenedAt,
    positionBuysCount: response.positionBuysCount,
    positionSellsCount: response.positionSellsCount,
    realPositionBuysCount: response.realPositionBuysCount,
    realPositionSellsCount: response.realPositionSellsCount,
    role: response.role,
    realExchangeConnected: response.realExchangeConnected,
    demoExchangeConnected: response.demoExchangeConnected,
    exchanges: response.exchanges
      ? userExchangeConnectionResponseTransform(response.exchanges)
      : [],
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
 * Calculate new followers for the past week
 * @param {ProviderEntity} provider Provider entity.
 * @returns {number} followers
 */
const calculateNewFollowers = (provider) => {
  // Find first date that is less than 7 days old
  let followerDataOneWeekAgo = provider.aggregateFollowers.find(
    (followerData) => moment().diff(moment(followerData.date), "d") <= 7,
  );
  let newFollowers = 0;
  if (followerDataOneWeekAgo) {
    newFollowers = provider.followers - followerDataOneWeekAgo.totalFollowers;
  }

  return newFollowers;
};

/**
 * Transform API provider item to typed object.
 *
 * @param {Object.<string, any>} providerItem Trade API provider item.
 * @returns {ProviderEntity} Provider entity.
 */
function providerItemTransform(providerItem) {
  const emptyProviderEntity = createEmptyProviderEntity();
  // Override the empty entity with the values that came in from API.
  const transformedResponse = assign(emptyProviderEntity, providerItem, {
    floating: parseFloat(providerItem.floating) || 0,
    aggregateFollowers: providerItem.aggregateFollowers ? providerItem.aggregateFollowers : [],
  });

  transformedResponse.dailyReturns.forEach((item) => {
    item.returns = typeof item.returns === "number" ? item.returns : parseFloat(item.returns);
    item.name = new Date(item.name);
    transformedResponse.closedPositions += item.positions;
  });
  transformedResponse.returns = transformedResponse.dailyReturns.length
    ? transformedResponse.dailyReturns[transformedResponse.dailyReturns.length - 1].returns
    : 0;

  // transformedResponse.dailyReturns = transformedResponse.dailyReturns.sort(
  //   (a, b) => a.name.getTime() - b.name.getTime(),
  // );

  if (!transformedResponse.isCopyTrading) {
    // Updating followers count because it's out of date for clones
    transformedResponse.followers = transformedResponse.aggregateFollowers.length
      ? transformedResponse.aggregateFollowers[transformedResponse.aggregateFollowers.length - 1]
          .totalFollowers
      : 0;
    transformedResponse.newFollowers = calculateNewFollowers(transformedResponse);
  }
  const copyTraders = transformedResponse.provType === "copytrading";
  const profitSharingProvider = transformedResponse.provType === "profitsharing";

  transformedResponse.providerLink = `/${
    copyTraders ? "copyTraders" : profitSharingProvider ? "profitSharing" : "signalProviders"
  }/${transformedResponse.id}`;

  return transformedResponse;
}

/**
 * @typedef {Object} HasBeenUsedProviderEntity
 * @property {boolean} connected Hide-water mark
 * @property {string} id
 * @property {string} name
 * @property {'copyTrading'|'profitSharing'|'signalProvider'} type
 */

/**
 * Create empty provider entity skeletion.
 *
 * @returns {HasBeenUsedProviderEntity} Enpty provider entity.
 */
function createEmptyHasBeenProviderEntity() {
  return {
    connected: false,
    id: "",
    name: "",
    type: "copyTrading",
  };
}

/**
 * Transform providers response to typed object.
 *
 * @export
 * @param {*} response Trade API signal providers list response.
 * @returns {Array<HasBeenUsedProviderEntity>} Signal providers entities collection.
 */
export function hasBeenUsedProvidersResponseTransform(response) {
  if (!isArray(response)) {
    throw new Error("Response must be an array of providers.");
  }

  return response.map((providerItem) => {
    return hasBeenUsedProviderItemTransform(providerItem);
  });
}

/**
 * Transform API provider item to typed object.
 *
 * @param {Object.<string, any>} providerItem Trade API provider item.
 * @returns {HasBeenUsedProviderEntity} Provider entity.
 */
function hasBeenUsedProviderItemTransform(providerItem) {
  const emptyProviderEntity = createEmptyHasBeenProviderEntity();
  // Override the empty entity with the values that came in from API.
  return assign(emptyProviderEntity, providerItem);
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
    floating: 0,
    openPositions: 0,
    closedPositions: 0,
    exchangeType: "",
    exchangeInternalId: "",
    profitSharing: false,
    profitsShare: 0,
    profitsMode: "",
    provType: "copytrading",
    providerLink: "",
  };
}

/**
 * Safe parse float value that may contain number separators.
 *
 * @param {*} value Float value to parse.
 * @returns {number} The parsed amount value.
 */
function safeParseFloat(value) {
  let safeValue = String(value)
    .toUpperCase()
    .replace(/[^0-9.E\\-]/g, "");

  // Convert the scientific notation numbers to 8 digits precision.
  if (safeValue.indexOf("E") !== -1) {
    safeValue = parseFloat(safeValue).toFixed(8);
  }

  return parseFloat(safeValue);
}

/**
 * Transform positions response to typed UserPositionsCollection collection.
 *
 * @param {*} response Trade API positions list response.
 * @returns {UserPositionsCollection} Positions entities collection.
 */
export function positionsResponseTransform(response) {
  if (!isArray(response)) {
    throw new Error("Response must be an array of positions.");
  }

  return response.map((positionItem) => {
    return positionItemTransform(positionItem);
  });
}

/**
 * Transform Trade API position item to typed PositionEntity object.
 *
 * @param {*} positionItem Trade API position item object.
 * @returns {PositionEntity} Position entity.
 */
export function positionItemTransform(positionItem) {
  const openDateMoment = moment(Number(positionItem.openDate));
  const closeDateMoment = moment(Number(positionItem.closeDate));
  const dateFormat =
    positionItem.profitSharing && !positionItem.isCopyTrader ? "YYYY/MM/DD" : "YYYY/MM/DD HH:mm";
  const nowDate = moment();
  const composeProviderLink = () => {
    // Manual positions don't use a signal provider.
    if (positionItem.providerId === "1") {
      return "";
    }

    if (positionItem.isCopyTrading && !positionItem.profitSharing) {
      return `/copyTraders/${positionItem.providerId}`;
    }
    if (positionItem.isCopyTrading && positionItem.profitSharing) {
      return `/profitSharing/${positionItem.providerId}`;
    }

    return `/signalProviders/${positionItem.providerId}`;
  };

  /**
   * Calculate position risk based on buy price, stop loss and entry side.
   *
   * @param {PositionEntity} positionEntity Transformed position entity.
   * @returns {number} Risk percentage.
   */
  const calculateRisk = (positionEntity) => {
    const buyPrice = positionEntity.buyPrice;
    if (!positionEntity.stopLossPrice || !buyPrice) {
      return -100;
    }
    let risk = ((positionEntity.stopLossPrice - buyPrice) / buyPrice) * 100;

    // Invert on short position.
    if (positionEntity.side === "SHORT") {
      risk *= -1;
    }

    return risk;
  };

  /**
   * Checks if value is currently at profit or loss color style.
   *
   * @param {number} entry Entry price.
   * @returns {('gain' | 'loss' | 'breakeven')} Profit result.
   */
  const getValueType = (entry) => {
    if (entry > 0) {
      return "gain";
    } else if (entry < 0) {
      return "loss";
    }

    return "breakeven";
  };

  /**
   * Checks if price is currently at profit or loss color style.
   *
   * @param {number} price Price.
   * @param {number} basePrice Current price.
   * @param {string} side Position side.
   * @returns {('gain' | 'loss' | 'breakeven')} Profit result.
   */
  const getPriceColorType = (price, basePrice, side) => {
    if (side.toUpperCase() === "LONG") {
      if (price > basePrice) {
        return "gain";
      } else if (price < basePrice) {
        return "loss";
      }
    }

    if (side.toUpperCase() === "SHORT") {
      if (price < basePrice) {
        return "gain";
      } else if (price > basePrice) {
        return "loss";
      }
    }

    return "breakeven";
  };

  const parseRealInvestment = () => {
    if (positionItem.realInvestment && positionItem.realInvestment.$numberDecimal) {
      return safeParseFloat(positionItem.realInvestment.$numberDecimal);
    }

    if (positionItem.realInvestment) {
      return safeParseFloat(positionItem.realInvestment);
    }

    return 0;
  };

  // Override the empty entity with the values that came in from API and augment
  // with pre-calculated fields.
  const positionEntity = assign(createEmptyPositionEntity(), positionItem, {
    amount: safeParseFloat(positionItem.amount),
    buyPrice: safeParseFloat(positionItem.buyPrice),
    buyTTL: safeParseFloat(positionItem.buyTTL),
    closeDate: Number(positionItem.closeDate),
    fees: safeParseFloat(positionItem.fees),
    fundingFees: safeParseFloat(positionItem.fundingFees),
    netProfit: safeParseFloat(positionItem.netProfit),
    netProfitPercentage: safeParseFloat(positionItem.netProfitPercentage),
    openDate: Number(positionItem.openDate),
    positionSizeQuote: safeParseFloat(positionItem.positionSizeQuote),
    realInvestment: parseRealInvestment(),
    invested: safeParseFloat(positionItem.invested),
    pair: `${positionItem.base}/${positionItem.quote}`,
    symbol: `${positionItem.base}/${positionItem.quote}`,
    priceDifference: safeParseFloat(positionItem.priceDifference) || 0,
    profit:
      safeParseFloat(positionItem.profit) || safeParseFloat(positionItem.unrealizedProfitLosses),
    profitPercentage:
      safeParseFloat(positionItem.profitPercentage) ||
      safeParseFloat(positionItem.unrealizedProfitLossesPercentage),
    profitSharing: positionItem.profitSharing,
    leverage: safeParseFloat(positionItem.leverage),
    unrealizedProfitLosses: safeParseFloat(positionItem.unrealizedProfitLosses),
    unrealizedProfitLossesPercentage: safeParseFloat(positionItem.unrealizedProfitLossesPercentage),
    reBuyTargets: isObject(positionItem.reBuyTargets)
      ? positionRebuyTargetsTransforrm(positionItem.reBuyTargets)
      : false,
    remainAmount: safeParseFloat(positionItem.remainAmount),
    sellPrice: safeParseFloat(positionItem.sellPrice),
    side: positionItem.side ? positionItem.side.toUpperCase() : "",
    stopLossPrice: safeParseFloat(positionItem.stopLossPrice),
    signalId: positionItem.signalId ? positionItem.signalId : "",
    takeProfitTargets: isObject(positionItem.takeProfitTargets)
      ? positionTakeProfitTargetsTransforrm(positionItem.takeProfitTargets)
      : false,
    positionSizePercentage: safeParseFloat(positionItem.positionSizePercentage),
    currentAllocatedBalance: safeParseFloat(positionItem.currentAllocatedBalance),
    liquidationPrice: safeParseFloat(positionItem.liquidationPrice),
    markPrice: safeParseFloat(positionItem.markPrice),
    margin: safeParseFloat(positionItem.margin),
    isolated: positionItem.isolated,
    isolatedReadable: positionItem.isolated ? "ISOLATED" : "CROSS",
    takeProfitTargetsCountSuccess: safeParseFloat(positionItem.takeProfitTargetsCountSuccess),
  });

  const risk = calculateRisk(positionEntity);
  const augmentedEntity = assign(positionEntity, {
    // Hide age for PS because positions doesn't include time
    age: positionItem.profitSharing ? null : openDateMoment.toNow(true),
    ageSeconds: positionItem.profitSharing ? null : openDateMoment.diff(nowDate),
    closeDateReadable: positionEntity.closeDate ? closeDateMoment.format(dateFormat) : "-",
    exitPriceStyle: getPriceColorType(
      positionEntity.sellPrice,
      positionEntity.buyPrice,
      positionEntity.side,
    ),
    markPriceStyle: getPriceColorType(
      positionEntity.markPrice,
      positionEntity.buyPrice,
      positionEntity.side,
    ),
    netProfitStyle: getValueType(positionEntity.netProfit),
    openDateMoment: openDateMoment,
    openDateReadable: positionEntity.openDate ? openDateMoment.format(dateFormat) : "-",
    priceDifferenceStyle: getPriceColorType(positionEntity.priceDifference, 0, positionEntity.side),
    profitStyle: getValueType(positionEntity.profit),
    providerLink: composeProviderLink(),
    providerLogo: positionEntity.logoUrl.includes("http")
      ? positionEntity.logoUrl
      : defaultProviderLogo,
    risk,
    riskStyle: getValueType(risk),
    stopLossStyle: getPriceColorType(
      positionEntity.stopLossPrice,
      positionEntity.buyPrice,
      positionEntity.side,
    ),
    unrealizedProfitStyle: getValueType(positionEntity.unrealizedProfitLosses),
  });

  return augmentedEntity;
}

/**
 * Transform position take profit targets to typed object.
 *
 * @param {*} rebuyTargets Trade API take rebuy targets response.
 * @returns {Object<string, ReBuyTarget>} Typed rebuy target.
 */
function positionRebuyTargetsTransforrm(rebuyTargets) {
  return mapValues(fixedTargets(rebuyTargets), (/** @type {any} */ rebuyTarget) => {
    return {
      targetId: parseInt(rebuyTarget.targetId) || 0,
      triggerPercentage: parseFloat(rebuyTarget.triggerPercentage) || 0,
      pricePriority: rebuyTarget.pricePriority || "percentage",
      priceTarget: rebuyTarget.priceTarget || 1000,
      quantity: parseFloat(rebuyTarget.quantity) || 0,
      buying: rebuyTarget.buying || false,
      done: rebuyTarget.done || false,
      orderId: rebuyTarget.orderId || "",
      cancel: rebuyTarget.cancel || false,
      skipped: rebuyTarget.skipped || false,
      buyType: rebuyTarget.buyType || "",
      errorMSG: rebuyTarget.errorMSG || "",
      postOnly: rebuyTarget.postOnly || false,
    };
  });
}

/**
 * Fix targets to make sure no id is missing
 * @template T
 * @param {T} targets targets
 * @returns {T} targets
 */
const fixedTargets = (targets) => {
  /** @type {*} */
  let newTargets = {};
  let i = 1;
  for (const target of Object.values(targets)) {
    if (target.targetId < 1000) {
      target.targetId = i;
      newTargets[i] = target;
      i++;
    } else {
      newTargets[target.targetId] = target;
    }
  }
  return newTargets;
};

/**
 * Transform position take profit targets to typed object.
 *
 * @param {*} profitTargets Trade API take profit targets response.
 * @returns {Object<string, ProfitTarget>} Typed profit target.
 */
function positionTakeProfitTargetsTransforrm(profitTargets) {
  // Ensure that targets is an indexed targets object.
  return mapValues(fixedTargets(profitTargets), (profitTarget) => {
    return {
      amountPercentage: parseFloat(profitTarget.amountPercentage) || 0,
      priceTargetPercentage: parseFloat(profitTarget.priceTargetPercentage) || 0,
      targetId: parseInt(profitTarget.targetId) || 0,
      orderId: profitTarget.orderId || "",
      done: profitTarget.done || false,
      updating: profitTarget.updating || false,
      cancel: profitTarget.cancel || false,
      skipped: profitTarget.skipped || false,
      postOnly: profitTarget.postOnly || false,
      priceTarget: profitTarget.priceTarget || 0,
      pricePriority: profitTarget.pricePriority || "",
    };
  });
}

/**
 * Map position side to typed value.
 *
 * @param {string} entrySide Entry side.
 * @returns {PositionEntrySide} Typed value.
 */
export function mapSideToEnum(entrySide) {
  switch (entrySide) {
    case "SHORT":
      return POSITION_SIDE_SHORT;

    case "LONG":
      return POSITION_SIDE_LONG;

    default:
      return POSITION_SIDE_LONG;
  }
}

/**
 * Map position entry type to typed value.
 *
 * @param {string} entryType Entry type.
 * @returns {PositionOrderType} Typed value.
 */
export function mapEntryTypeToEnum(entryType) {
  switch (entryType) {
    case "market":
      return POSITION_ENTRY_TYPE_MARKET;
    case "limit":
      return POSITION_ENTRY_TYPE_LIMIT;
    case "stop_limit":
      return POSITION_ENTRY_TYPE_SLLIMIT;
    case "import":
      return POSITION_ENTRY_TYPE_IMPORT;
    case "multi":
      return POSITION_ENTRY_TYPE_MULTI;
    default:
      throw new Error(`${entryType} entry type is invalid.`);
  }
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
    ageSeconds: 0,
    amount: 0,
    base: "",
    buyPrice: 0,
    buyTTL: 0,
    closeDate: 0,
    closeDateReadable: "",
    closed: false,
    exchange: "",
    exchangeType: "",
    exchangeInternalName: "",
    exitPriceStyle: "",
    fees: 0,
    fundingFees: 0,
    internalExchangeId: "",
    exchangeInternalId: "",
    invested: 0,
    investedQuote: "",
    isCopyTrader: false,
    isCopyTrading: false,
    profitSharing: false,
    leverage: 0,
    logoUrl: "",
    netProfit: 0,
    netProfitPercentage: 0,
    netProfitStyle: "",
    openDate: 0,
    openDateReadable: "",
    pair: "",
    paperTrading: false,
    positionId: "",
    positionSize: "",
    positionSizeQuote: 0,
    profit: 0,
    profitPercentage: 0,
    profitStyle: "",
    unrealizedProfitStyle: "",
    providerId: "",
    providerOwnerUserId: "",
    providerLink: "",
    providerLogo: "",
    providerName: "",
    quote: "",
    reBuyTargets: {},
    reBuyTargetsCountFail: 0,
    reBuyTargetsCountPending: 0,
    reBuyTargetsCountSuccess: 0,
    realInvestment: 0,
    remainAmount: 0,
    availableAmount: 0,
    risk: 0,
    riskStyle: "",
    sellPrice: 0,
    side: "",
    signalId: "",
    status: 0,
    stopLossPercentage: 0,
    stopLossPrice: null,
    stopLossStyle: "",
    symbol: "",
    takeProfitTargets: {},
    takeProfitTargetsCountFail: 0,
    takeProfitTargetsCountPending: 0,
    takeProfitTargetsCountSuccess: 0,
    trailingStopPercentage: 0,
    trailingStopTriggerPrice: null,
    trailingStopTriggerPercentage: 0,
    trailingStopTriggered: false,
    type: "",
    updating: false,
    userId: "",
    copyTradingTotals: {
      totalPositions: 0,
      soldPositions: 0,
      totalPositionSize: 0,
      openPositions: 0,
    },
    subPositions: 0,
    returnFromAllocated: 0,
    returnFromInvestment: 0,
    priceDifference: 0,
    priceDifferenceStyle: "",
    unrealizedProfitLosses: 0,
    unrealizedProfitLossesPercentage: 0,
    positionSizePercentage: 0,
    currentAllocatedBalance: 0,
    reduceOrders: [],
    liquidationPrice: 0,
    markPrice: 0,
    markPriceStyle: "",
    margin: 0,
    unitsInvestment: "",
    unitsAmount: "",
    short: "",
    tradeViewSymbol: "",
    isolated: false,
    isolatedReadable: "",
    stopLossPriority: "",
    trailingStopTriggerPriority: "",
    stopLossToBreakEven: false,
    stopLossFollowsTakeProfit: false,
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
 * @property {boolean} balanceSynced
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

/**
 *
 * @returns {ExchangeConnectionEntity} Exchange connection entity.
 */
export function createExchangeConnectionEmptyEntity() {
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
    balanceSynced: false,
  };
}

/**
 * @typedef {Object} UserBalanceEntity
 * @property {Number} totalPnlUSDT
 * @property {Number} totalPnlBTC
 * @property {Number} totalBTC
 * @property {Number} totalFreeBTC
 * @property {Number} totalFreeUSDT
 * @property {Number} totalLockedBTC
 * @property {Number} totalLockedUSDT
 * @property {Number} totalUSDT
 * @property {Number} totalAvailableBTC
 * @property {Number} totalAvailableUSDT
 * @property {Number} totalCurrentMarginBTC
 * @property {Number} totalCurrentMarginUSDT
 * @property {Number} totalMarginBTC
 * @property {Number} totalMarginUSDT
 * @property {Number} totalUnrealizedProfitBTC
 * @property {Number} totalUnrealizedProfitUSDT
 * @property {Number} totalWalletBTC
 * @property {Number} totalWalletUSDT
 */

/**
 * Transform user balance response to typed UserBalanceEntity.
 *
 * @param {*} response Trade API get user balance raw response.
 * @returns {UserBalanceEntity} User balance entity.
 */
export function userBalanceResponseTransform(response) {
  return assign(createEmptyUserBalanceEntity(), response, {
    totalUSDT: response["1USDT"] || response.totalUSDT || 0,
    totalBTC: response["1BTC"] || response.totalBTC || 0,
    totalAvailableBTC: response.totalMarginBTC - response.totalCurrentMarginBTC || 0,
    totalAvailableUSDT: response.totalMarginUSDT - response.totalCurrentMarginUSDT || 0,
  });
}

export function createEmptyUserBalanceEntity() {
  return {
    totalPnlBTC: 0,
    totalPnlUSDT: 0,
    totalBTC: 0,
    totalFreeBTC: 0,
    totalFreeUSDT: 0,
    totalLockedBTC: 0,
    totalLockedUSDT: 0,
    totalUSDT: 0,
    totalAvailableBTC: 0,
    totalAvailableUSDT: 0,
    totalCurrentMarginBTC: 0,
    totalCurrentMarginUSDT: 0,
    totalMarginBTC: 0,
    totalMarginUSDT: 0,
    totalUnrealizedProfitBTC: 0,
    totalUnrealizedProfitUSDT: 0,
    totalWalletBTC: 0,
    totalWalletUSDT: 0,
  };
}

/**
 *
 * @typedef {Object} DefaultDailyBalanceEntity
 * @property {Array<UserEquityEntity>} balances
 * @property {Array<String>} quotes
 * @property {Boolean} loading
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
 * @property {Number} availablePercentage
 * @property {Number} investedPercentage
 * @property {Number} netTransferBTC
 * @property {Number} netTransferUSDT
 * @property {Number} pnlBTC
 * @property {Number} pnlUSDT
 * @property {Number} sumPnlBTC
 * @property {Number} sumPnlUSDT
 * @property {Number} totalWalletBTC
 * @property {Number} totalWalletUSDT
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
  const emptyEquityEntity = createEmptyUserEquityEntity();

  function prepareAvailablePercentage() {
    if (userEquityItem.totalFreeUSDT && userEquityItem.totalUSDT) {
      return (userEquityItem.totalFreeUSDT / userEquityItem.totalUSDT) * 100;
    }
    return 0;
  }

  function prepareInvestedPercentage() {
    if (userEquityItem.totalLockedUSDT && userEquityItem.totalUSDT) {
      return (userEquityItem.totalLockedUSDT / userEquityItem.totalUSDT) * 100;
    }
    return 0;
  }

  // Override the empty entity with the values that came in from API.
  const transformedResponse = assign(emptyEquityEntity, userEquityItem, {
    availablePercentage: prepareAvailablePercentage(),
    investedPercentage: prepareInvestedPercentage(),
  });

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
    loading: false,
  };
}

/**
 * Create user balance entity.
 *
 * @returns {UserEquityEntity} User balance entity.
 */
export function createEmptyUserEquityEntity() {
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
    date: "",
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
    availablePercentage: 0,
    investedPercentage: 0,
    netTransferBTC: 0,
    netTransferUSDT: 0,
    pnlBTC: 0,
    pnlUSDT: 0,
    sumPnlBTC: 0,
    sumPnlUSDT: 0,
    totalWalletBTC: 0,
    totalWalletUSDT: 0,
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
 * @property {number} serverTime Server time expressed in unix time epoch seconds.
 * @property {number} dbTime Database time expressed in unix time epoch seconds.
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
 * @property {string} id Pair ID, i.e. BTCUSDT.
 * @property {string} symbol Separated pair ID, i.e. BTC/USDT.
 * @property {string} base Base currency, i.e. BTC.
 * @property {string} quote Quote currency, i.e. USDT.
 * @property {string} baseId Same as base.
 * @property {string} quoteId Same as quote.
 * @property {string} unitsInvestment Units displayed for the investment.
 * @property {string} unitsAmount Units displayed when bought.
 * @property {PricePrecision} precision Symbol required price precision details.
 * @property {SymbolLimits} limits Symbol cost, price and amount min/max limits.
 * @property {string} coinrayBase Base currency ID adapted to CoinRay.
 * @property {string} coinrayQuote Quote currency ID adapted to CoinRay.
 * @property {number} multiplier Multiplier to calculate bitmex contract values/PnL.
 * @property {number} maxLeverage Max leverage (futures).
 * @property {string} tradeViewSymbol TradingView symbol.
 * @property {string} zignalyId Symbol used internally.
 * @property {string} short Short symbol name displayed in Zignaly.
 * @property {string} contractType Bitmex contract type (inverse, quanto, linear)
 */

/**
 * @typedef {Object} SymbolLimits
 * @property {AmountLimit} cost Cost limits.
 * @property {AmountLimit} price Price limits.
 * @property {AmountLimit} amount Amount limits.
 */

/**
 * @typedef {Object} AmountLimit
 * @property {number} min Minimum allowed value, when null no limit is imposed.
 * @property {number} max Maximum allowed value, when null no limit is imposed.
 */

/**
 * @typedef {Object} PricePrecision
 *
 * @property {number} amount Fractional digits amount precision.
 * @property {number} price Fractional digits price precision.
 * @property {number} base Fractional digits base size precision.
 * @property {number} quote Fractional digits quote size precision.
 */

/**
 * Collection of market symbols objects.
 *
 * @typedef {Array<MarketSymbol>} MarketSymbolsCollection
 */

/**
 * Create empty market symbol value object.
 *
 * @returns {MarketSymbol} Empty market symbol value object.
 */
export function createMarketSymbolEmptyValueObject() {
  return {
    id: "",
    symbol: "",
    base: "",
    quote: "",
    baseId: "",
    quoteId: "",
    precision: { amount: 0, price: 0, quote: 0, base: 0 },
    limits: {
      cost: { min: 0, max: 0 },
      price: { min: 0, max: 0 },
      amount: { min: 0, max: 0 },
    },
    coinrayQuote: "",
    coinrayBase: "",
    multiplier: 0,
    maxLeverage: 125,
    tradeViewSymbol: "",
    zignalyId: "",
    unitsInvestment: "",
    unitsAmount: "",
    short: "",
    contractType: "",
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
    throw new Error("Response must be object of key value pairs.");
  }

  /** @type {QuoteAssetsDict} */
  let transformed = {};
  let obj = {
    quote: "",
    minNotional: 0,
  };
  Object.values(response).forEach((item) => {
    obj.quote = item;
    obj.minNotional = 0;
    transformed[item] = obj;
  });
  return transformed;
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
    allocatedBalance: response.allocatedBalance,
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
 * @property {Boolean} useLeverageFromSignal
 * @property {Boolean} customerKey
 * @property {Boolean} allowClones
 * @property {String} disclaimer
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
 * @typedef {Object} DefaultProviderPerformanceWeeklyStats
 * @property {String} week
 * @property {Number} return
 * @property {String} day
 * @property {Number} positions
 */

/**
 *
 * @typedef {Object} DefaultProviderPermormanceObject
 * @property {Number} closePositions
 * @property {Array<DefaultProviderPerformanceWeeklyStats>} weeklyStats
 * @property {Number} openPositions
 * @property {Number} totalBalance
 * @property {Number} totalTradingVolume
 */

/**
 *
 * @typedef {Object} DefaultProviderExchangeIDsObject
 * @property {Boolean} disconnecting
 * @property {String} disconnectionType
 * @property {String} internalId
 * @property {String} profitsMode
 * @property {Number} profitsShare
 * @property {Number} retain
 */

/**
 * Default Single Provider object from 'getProvider' endpoint.
 *
 * @typedef {Object} DefaultProviderGetObject
 * @property {Boolean} connected
 * @property {String} copyTradingQuote
 * @property {String} description
 * @property {Boolean} disable True when provider is not connected.
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
 * @property {Boolean} acceptUpdateSignal
 * @property {Boolean} allowSendingBuyOrdersAsMarket
 * @property {String} customerKey
 * @property {Boolean} disclaimer
 * @property {Boolean} enablePanicSellSignals
 * @property {Boolean} enableSellSignals
 * @property {Boolean} limitPriceFromSignal
 * @property {String} limitReBuys
 * @property {Boolean} long
 * @property {Boolean} mid
 * @property {Number} quantityPercentage
 * @property {Boolean} reBuyAll
 * @property {Boolean} reBuyFirst
 * @property {Boolean} reBuyLast
 * @property {Boolean} reBuysFromSignal
 * @property {Boolean} reUseSignalIdIfClosed
 * @property {String} risk
 * @property {Boolean} shortmid
 * @property {Boolean} short
 * @property {Boolean} stopLossFromSignal
 * @property {String} successRate
 * @property {Boolean} takeProfitAll
 * @property {Boolean} takeProfitFirst
 * @property {Boolean} takeProfitLast
 * @property {Boolean} takeProfitsFromSignal
 * @property {Boolean} trailingStopFromSignal
 * @property {Boolean} useLeverageFromSignal
 * @property {Number} price
 * @property {Boolean} loading
 * @property {Array<String>} signalProviderQuotes
 * @property {Boolean} profitSharing
 * @property {Number} profitsShare
 * @property {String} profitsMode
 * @property {false} notificationsPosts Flag to turn on emails notifications when new posts are created.
 * @property {Array<DefaultProviderExchangeIDsObject>} exchangeInternalIds
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

  function checkClones() {
    if (response.options.allowClones !== undefined) {
      return response.options.allowClones;
    }
    return true;
  }

  let emptyProviderEntity = createEmptyProviderGetEntity();
  let transformed = assign(emptyProviderEntity, response, {
    minAllocatedBalance:
      response.minAllocatedBalance && response.minAllocatedBalance !== "false"
        ? parseFloat(response.minAllocatedBalance)
        : 0,
    options:
      !response.options || isArray(response.options)
        ? emptyProviderEntity.options
        : response.options,
  });
  transformed.options.allowClones = checkClones();
  return transformed;
}

function createEmptyProviderGetEntity() {
  return {
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
      price: "",
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
    signalProviderQuotes: [""],
    profitSharing: false,
    profitsShare: 0,
    profitsMode: "",
    exchangeInternalIds: [{}],
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
 * @property {string} internalExchangeId Exchange connection ID associated to the copy trading provider owned services.
 */

/**
 * @typedef {Object} CopyTradersProvidersOption
 * @property {string} providerName Provider name.
 * @property {number} providerConsumedBalance Balance (amount in quote currency) that is currently consumed.
 * @property {number} providerConsumedBalancePercentage Balance (percentage) that is currently consumed.
 * @property {number} providerPayableBalance Copy trader provider allocated balance for this signals service.
 * @property {number|string} providerId Provider ID.
 * @property {string|boolean} providerQuote Currency quote traded by the copy trading provider service.
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
export function ownedCopyTraderProvidersOptionsResponseTransform(response) {
  if (!isArray(response)) {
    throw new Error("Response must be an array of copy trader providers options.");
  }

  return response.map(ownedCopyTraderProviderOptionResponseTransform);
}

/**
 * Transform own copy traders providers option to typed CopyTradersProvidersOption.
 *
 * @param {*} option Trade API own copy traders providers options raw response.
 * @returns {CopyTradersProvidersOption} Options collection.
 */

function ownedCopyTraderProviderOptionResponseTransform(option) {
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
    providerQuote: "",
    providerConsumedBalance: 0,
    providerConsumedBalancePercentage: 0,
    providerPayableBalance: 0,
  };
}

/**
 * Transform user exchange connection to typed ExchangeConnectionEntity.
 *
 * @param {*} response Trade API get exchanges raw response.
 * @returns {Array<ProviderCopiersEntity>} User exchange connections collection.
 */

export function providerCopiersResponseTransform(response) {
  if (!isArray(response)) {
    throw new Error("Response must be an array of positions.");
  }

  let list = response.map((providerFollowersItem) => {
    return providerCopiersResponseItemTransform(providerFollowersItem);
  });
  list = list.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  return list;
}

/**
 * @typedef {Object} ProviderCopiersEntity
 * @property {String} date
 * @property {Boolean} enabled
 * @property {String} id
 * @property {String} name
 * @property {Array<*>} requiredAuthFields
 * @property {Array<*>} testNet
 * @property {Array<*>} type
 * @property {Number} followers
 * @property {Number} totalFollowers
 */

/**
 * Transform API exchange connection item to typed object.
 *
 * @param {*} providerFollowersItem Trade API exchange connection item.
 * @returns {ProviderCopiersEntity} Exchange connection entity.
 */
function providerCopiersResponseItemTransform(providerFollowersItem) {
  const emptyExchangeListEntity = createProviderCopiersEmptyEntity();
  const transformedResponse = assign(emptyExchangeListEntity, providerFollowersItem);

  return transformedResponse;
}

/**
 * Function to create an empty provider entity.
 *
 * @return {ProviderCopiersEntity} Provoer Follower empty entity
 */
export function createProviderCopiersEmptyEntity() {
  return {
    date: "",
    enabled: false,
    id: "",
    name: "",
    requiredAuthFields: [""],
    testNet: [""],
    type: [""],
    followers: 0,
    totalFollowers: 0,
  };
}

/**
 * Transform provider followers list response item to ProviderFollowersListEntity.
 *
 * @param {*} response Trade API get provider followers list response.
 * @returns {Array<ProviderFollowersEntity>} Provider followers list collection.
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
 * @typedef {Object} ProviderFollowersEntity
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
 * @property {Number} originalAllocated
 * @property {String} profitsMode
 * @property {Number} profitsShare
 * @property {Number} retain
 * @property {String} unit
 */

/**
 * Transform provider followers list response item to typed object.
 *
 * @param {*} providerFollowersListItem Provider followers list response item.
 * @returns {ProviderFollowersEntity} Provider Followers List Item entity.
 */
function providerFollowersListItemTransform(providerFollowersListItem) {
  const emptyProviderFollowersListEntity = createProviderFollowersListEmptyEntity();
  const transformedResponse = assign(emptyProviderFollowersListEntity, providerFollowersListItem);

  return transformedResponse;
}

/**
 * @returns {ProviderFollowersEntity} Provider follower entity.
 */
function createProviderFollowersListEmptyEntity() {
  return {
    active: false,
    allocatedBalance: "",
    cancelDate: "-",
    code: "-",
    connected: false,
    email: "",
    lastTransactionId: "-",
    name: "",
    profitsFromClosedBalance: "",
    realExchangeConnected: false,
    suspended: false,
    userId: "",
    originalAllocated: 0,
    profitsMode: "",
    profitsShare: 0,
    retain: 0,
    unit: "",
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
 * @property {string} integerMultiple
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
 * @property {string} maxWithdrawAmount
 * @property {Array<CoinNetwork>} networks
 * @property {string} coin
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
      [key]: exchangeAssetsItemTransform(key, val),
    }),
    {},
  );
}

/**
 *
 * @param {*} coin Exchange assets coin.
 * @param {*} exchangeAssetItem Exchange assets list response item.
 * @returns {ExchangeAssetsDict} Exchange assets.
 */
function exchangeAssetsItemTransform(coin, exchangeAssetItem) {
  const emptyExchangeAssetsEntity = createExchangeAssetsEmptyEntity();
  const transformedResponse = assign(emptyExchangeAssetsEntity, exchangeAssetItem, {
    coin: coin,
  });

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
    maxWithdrawAmount: "0.000000000000",
    exchCoin: "",
    networks: [],
    coin: "",
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
 * @property {Array<DefaultProviderPerformanceWeeklyStats>} weeklyStats
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
  return {
    ...emptyProviderEntity,
    ...response,
    weeklyStats: response.weeklyStats
      .map((/** @type {*} */ s) => ({
        ...s,
        day: dayjs(s.day).toDate(),
      }))
      .sort((/** @type {*} */ a, /** @type {*} */ b) => a.day.getTime() - b.day.getTime()),
  };
}

export function createProviderPerformanceEmptyEntity() {
  return {
    closePositions: 0,
    openPositions: 0,
    totalBalance: 0,
    totalTradingVolume: 0,
    weeklyStats: [{}],
  };
}

/**
 * Transform exchange deposit list response item to TransactionEntity list.
 *
 * @param {*} response Trade API get exchange deposits list response.
 * @returns {Array<TransactionEntity>} Exchange Deposits list collection.
 */
export function exchangeDepositsResponseTransform(response) {
  if (!isArray(response)) {
    throw new Error("Response must be an array of deposit.");
  }

  return response.map((exchangeDepositItem) => {
    return exchangeDepositItemTransform(exchangeDepositItem);
  });
}

/**
 * @typedef {Object} TransactionEntity
 * @property {String} [id]
 * @property {String} txid
 * @property {Number} timestamp
 * @property {String} datetime
 * @property {String} address
 * @property {String} tag
 * @property {String} type
 * @property {Number} amount
 * @property {String} currency
 * @property {String} status
 * @property {String} [statusTx]
 * @property {FeeType} [fee] Fees (For withdrawals)
 */

/**
 * @typedef {Object} FeeType
 * @property {string} currency
 * @property {number} cost
 */

/**
 * Transform exchange deposits list response item to typed object.
 *
 * @param {*} exchangeDepositItem Exchange Deposit response item.
 * @returns {TransactionEntity} Exchange Deposit Item entity.
 */
function exchangeDepositItemTransform(exchangeDepositItem) {
  const emptyTransactionEntity = createExchangeDepositEmptyEntity();
  const transformedResponse = assign(emptyTransactionEntity, exchangeDepositItem);

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
    currency: "",
    status: "",
  };
}

/**
 * Transform exchange withdraw list response item to TransactionEntity list.
 *
 * @param {*} response Trade API get exchange withdraws list response.
 * @returns {Array<TransactionEntity>} Exchange withdraws list collection.
 */
export function exchangeWithdrawsResponseTransform(response) {
  if (!isArray(response)) {
    throw new Error("Response must be an array of withdraw.");
  }

  return response.map((exchangeWithdrawItem) => {
    return exchangeWithdrawItemTransform(exchangeWithdrawItem);
  });
}

/**
 * Transform exchange withdraws list response item to typed object.
 *
 * @param {*} exchangeWithdrawItem Exchange withdraw response item.
 * @returns {TransactionEntity} Exchange withdraw Item entity.
 */
function exchangeWithdrawItemTransform(exchangeWithdrawItem) {
  const emptyTransactionEntity = createExchangeWithdrawEmptyEntity();
  const transformedResponse = assign(emptyTransactionEntity, exchangeWithdrawItem);

  return transformedResponse;
}

function createExchangeWithdrawEmptyEntity() {
  return {
    id: "",
    txid: "",
    timestamp: 0,
    datetime: "",
    address: "",
    tag: "",
    type: "",
    amount: 0,
    currency: "",
    status: "",
    statusTx: "",
    fee: { currency: "", cost: "" },
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

/**
 * Transform convert asset reply to typed ConvertReply
 *
 * @param {*} response Trade API convert asset response.
 * @returns {ConvertReply} Convert asset reply object.
 */
export function convertAssetResponseTransform(response) {
  return {
    totalServiceCharge: response.totalServiceCharge,
    totalTransferred: response.totalTransferred,
    trans: response.trans,
  };
}

/**
 *
 * @typedef {Object} ProviderSettingsTargetObject
 * @property {String} targetId
 * @property {String} priceTargetPercentage
 * @property {String} amountPercentage
 */

/**
 *
 * @typedef {Object} ProviderExchangeSettingsObject
 * @property {Boolean} blacklist
 * @property {Number} buyTTL
 * @property {Boolean} disable
 * @property {Boolean} internal
 * @property {String} internalId
 * @property {String} internalName
 * @property {Number} leverage
 * @property {Boolean} managed
 * @property {String} maxPositions
 * @property {String} minVolume
 * @property {String} name
 * @property {Number} positionSize
 * @property {String} positionSizeBKRWUnit
 * @property {String} positionSizeBKRWValue
 * @property {String} positionSizeBNBUnit
 * @property {String} positionSizeBNBValue
 * @property {String} positionSizeBTCUnit
 * @property {String} positionSizeBTCValue
 * @property {String} positionSizeBUSDUnit
 * @property {String} positionSizeBUSDValue
 * @property {String} positionSizeETHUnit
 * @property {String} positionSizeETHValue
 * @property {String} positionSizeEURUnit
 * @property {String} positionSizeEURValue
 * @property {String} positionSizeIDRTUnit
 * @property {String} positionSizeIDRTValue
 * @property {String} positionSizeNGNUnit
 * @property {String} positionSizeNGNValue
 * @property {String} positionSizePAXUnit
 * @property {String} positionSizePAXValue
 * @property {String} positionSizeRUBUnit
 * @property {String} positionSizeRUBValue
 * @property {String} positionSizeTRXUnit
 * @property {String} positionSizeTRXValue
 * @property {String} positionSizeTRYUnit
 * @property {String} positionSizeTRYValue
 * @property {String} positionSizeTUSDUnit
 * @property {String} positionSizeTUSDValue
 * @property {String} positionSizeUSDCUnit
 * @property {String} positionSizeUSDCValue
 * @property {String} positionSizeUSDSUnit
 * @property {String} positionSizeUSDSValue
 * @property {String} positionSizeUSDTUnit
 * @property {String} positionSizeUSDTValue
 * @property {String} positionSizeXRPUnit
 * @property {String} positionSizeXRPValue
 * @property {String} positionSizeZARUnit
 * @property {String} positionSizeZARValue
 * @property {String} maxPositions
 * @property {String} positionsPerMarket
 * @property {String} priceDeviation
 * @property {Array<ProviderSettingsTargetObject>} reBuyTargets
 * @property {Number} sellByTTL
 * @property {String} sellPriceDeviation
 * @property {String} stopLoss
 * @property {Array<ProviderSettingsTargetObject>} takeProfitTargets
 * @property {String} trailingStop
 * @property {String} trailingStopTrigger
 * @property {Boolean} whitelist
 * @property {String} allowedSide
 */

/**
 * Transform provider exchange settings response.
 *
 * @param {*} response .
 * @returns {ProviderExchangeSettingsObject} Provider exchange settings entity.
 */
export function providerExchangeSettingsResponseTransform(response) {
  const emptySettingsEntity = creatEmptySettingsEntity();
  let reBuyTargets = response.reBuyTargets ? Object.values(response.reBuyTargets) : [];
  let takeProfitTargets = response.takeProfitTargets
    ? Object.values(response.takeProfitTargets)
    : [];
  const transformedResponse = assign(emptySettingsEntity, response, {
    reBuyTargets: reBuyTargets,
    takeProfitTargets: takeProfitTargets,
    buyTTL: response.buyTTL ? response.buyTTL / 60 : response.buyTTL, // Convert seconds to minutes.
    sellByTTL: response.sellByTTL ? response.sellByTTL / 3600 : response.sellByTTL, // Convert seconds to hours.
  });

  return transformedResponse;
}

/**
 * Create provider exchange settings empty entity.
 *
 * @returns {ProviderExchangeSettingsObject} Provider exchange settings empty entity.
 */
export function creatEmptySettingsEntity() {
  return {
    blacklist: false,
    buyTTL: 0,
    disable: false,
    internal: false,
    internalId: "",
    internalName: "",
    leverage: 1,
    managed: false,
    maxPositions: "",
    minVolume: "",
    name: "",
    positionSize: 0,
    positionSizeBKRWUnit: "#",
    positionSizeBKRWValue: "",
    positionSizeBNBUnit: "#",
    positionSizeBNBValue: "",
    positionSizeBTCUnit: "#",
    positionSizeBTCValue: "",
    positionSizeBUSDUnit: "#",
    positionSizeBUSDValue: "",
    positionSizeETHUnit: "#",
    positionSizeETHValue: "",
    positionSizeEURUnit: "#",
    positionSizeEURValue: "",
    positionSizeIDRTUnit: "#",
    positionSizeIDRTValue: "",
    positionSizeNGNUnit: "#",
    positionSizeNGNValue: "",
    positionSizePAXUnit: "#",
    positionSizePAXValue: "",
    positionSizeRUBUnit: "#",
    positionSizeRUBValue: "",
    positionSizeTRXUnit: "#",
    positionSizeTRXValue: "",
    positionSizeTRYUnit: "#",
    positionSizeTRYValue: "",
    positionSizeTUSDUnit: "#",
    positionSizeTUSDValue: "",
    positionSizeUSDCUnit: "#",
    positionSizeUSDCValue: "",
    positionSizeUSDSUnit: "#",
    positionSizeUSDSValue: "",
    positionSizeUSDTUnit: "#",
    positionSizeUSDTValue: "",
    positionSizeXRPUnit: "#",
    positionSizeXRPValue: "",
    positionSizeZARUnit: "#",
    positionSizeZARValue: "",
    positionsPerMarket: "",
    priceDeviation: "",
    reBuyTargets: [{ targetId: "", priceTargetPercentage: "", amountPercentage: "" }],
    sellByTTL: 0,
    sellPriceDeviation: "",
    stopLoss: "",
    takeProfitTargets: [{ targetId: "1", priceTargetPercentage: "", amountPercentage: "" }],
    trailingStop: "",
    trailingStopTrigger: "",
    whitelist: false,
    allowedSide: "both",
  };
}

/**
 *
 * @typedef {Object} ProviderDataPointsEntity
 * @property {Number} float
 * @property {Number} floatPercentage
 * @property {Number} floatUSDT
 * @property {Number} followersTrialing
 * @property {Number} freeBalance
 * @property {Number} freeBalancePercentage
 * @property {Number} freeBalanceUSDT
 * @property {String} quote
 * @property {Number} totalAllocated
 * @property {Number} totalAllocatedFromFollowers
 * @property {Number} totalAllocatedUSDT
 * @property {Number} totalAllocatedUSDTFromFollowers
 * @property {Number} totalFollowers
 * @property {Number} totalProfit
 * @property {Number} totalProfitPercentage
 * @property {Number} totalProfitUSDT
 */

/**
 * Format number for display.
 *
 * @param {number} value Number to format.
 *
 * @returns {number} Formatter number for display.
 */
export const formatValue = (value) => {
  if (!value || isNaN(value)) {
    return 0;
  }

  return toNumber(value);
};

/**
 * Transform Provider data points get response.
 *
 * @param {*} response .
 * @returns {ProviderDataPointsEntity} Provider Data points entity.
 */
export function providerDataPointsResponseTransform(response) {
  return creatProviderDataPointsEntity(response);
}

/**
 * Create provider data points entity.
 * @param {*} response .
 *
 * @returns {ProviderDataPointsEntity} Provider data points entity.
 */
export function creatProviderDataPointsEntity(response) {
  return {
    float: response ? formatValue(response.float) : 0,
    floatPercentage: response ? formatValue(response.floatPercentage) : 0,
    floatUSDT: response ? formatValue(response.floatUSDT) : 0,
    followersTrialing: response ? formatValue(response.followersTrialing) : 0,
    freeBalance: response ? formatValue(response.freeBalance) : 0,
    freeBalancePercentage: response ? formatValue(response.freeBalancePercentage) : 0,
    freeBalanceUSDT: response ? formatValue(response.freeBalanceUSDT) : 0,
    quote: response ? response.quote : "",
    totalAllocated: response ? formatValue(response.totalAllocated) : 0,
    totalAllocatedFromFollowers: response ? formatValue(response.totalAllocatedFromFollowers) : 0,
    totalAllocatedUSDT: response ? formatValue(response.totalAllocatedUSDT) : 0,
    totalAllocatedUSDTFromFollowers: response
      ? formatValue(response.totalAllocatedUSDTFromFollowers)
      : 0,
    totalFollowers: response ? formatValue(response.totalFollowers) : 0,
    totalProfit: response ? formatValue(response.totalProfit) : 0,
    totalProfitPercentage: response ? formatValue(response.totalProfitPercentage) : 0,
    totalProfitUSDT: response ? formatValue(response.totalProfitUSDT) : 0,
  };
}

/**
 *
 * @typedef {Object} ProviderBalanceEntity
 * @property {Number} totalWalletBTC
 * @property {Number} totalWalletUSDT
 * @property {Number} totalCurrentMarginBTC
 * @property {Number} totalCurrentMarginUSDT
 * @property {Number} totalInvestedBTC
 * @property {Number} totalInvestedUSDT
 * @property {Number} totalUnrealizedProfitBTC
 * @property {Number} totalUnrealizedProfitUSDT
 * @property {Number} totalPnlBTC
 * @property {Number} totalPnlUSDT
 * @property {Number} totalFreeBTC
 * @property {Number} totalFreeUSDT
 * @property {Number} totalMarginBTC
 * @property {Number} totalMarginUSDT
 * @property {Number} abstractPercentage
 */

/**
 * Transform Provider data points get response.
 *
 * @param {*} response .
 * @returns {ProviderBalanceEntity} Provider Data points entity.
 */
export function providerBalanceResponseTransform(response) {
  return creatProviderBalanceEntity(response);
}

/**
 * Create provider data points entity.
 * @param {*} response .
 *
 * @returns {ProviderBalanceEntity} Provider data points entity.
 */
export function creatProviderBalanceEntity(response) {
  return {
    totalWalletBTC: response ? formatValue(response.totalWalletBTC) : 0,
    totalWalletUSDT: response ? formatValue(response.totalWalletUSDT) : 0,
    totalCurrentMarginBTC: response ? formatValue(response.totalCurrentMarginBTC) : 0,
    totalCurrentMarginUSDT: response ? formatValue(response.totalCurrentMarginUSDT) : 0,
    totalInvestedBTC: response ? formatValue(response.totalInvestedBTC) : 0,
    totalInvestedUSDT: response ? formatValue(response.totalInvestedUSDT) : 0,
    totalUnrealizedProfitBTC: response ? formatValue(response.totalUnrealizedProfitBTC) : 0,
    totalUnrealizedProfitUSDT: response ? formatValue(response.totalUnrealizedProfitUSDT) : 0,
    totalPnlBTC: response ? formatValue(response.totalPnlBTC) : 0,
    totalPnlUSDT: response ? formatValue(response.totalPnlUSDT) : 0,
    totalFreeBTC: response ? formatValue(response.totalFreeBTC) : 0,
    totalFreeUSDT: response ? formatValue(response.totalFreeUSDT) : 0,
    totalMarginBTC: response ? formatValue(response.totalMarginBTC) : 0,
    totalMarginUSDT: response ? response.totalMarginUSDT : 0,
    abstractPercentage: response ? formatValue(response.abstractPercentage) : 0,
  };
}

/**
 *
 * @typedef {Object} ProviderFollowersCountEntity
 * @property {Number} followers
 */

/**
 * Transform Provider data points get response.
 *
 * @param {*} response .
 * @returns {ProviderFollowersCountEntity} Provider Data points entity.
 */
export function providerFollowersCountResponseTransform(response) {
  return creatProviderFollowersCountEntity(response);
}

/**
 * Create provider data points entity.
 * @param {*} response .
 *
 * @returns {ProviderFollowersCountEntity} Provider data points entity.
 */
export function creatProviderFollowersCountEntity(response) {
  return {
    followers: response ? formatValue(response.followers) : 0,
  };
}

/**
 *
 * @typedef {Object} ManagementPositionsEntity
 * @property {PositionEntity} position
 * @property {Array<PositionEntity>} subPositions
 */

/**
 * Transform management positions response to typed object mapping.
 *
 * @param {*} response Management positions list response.
 * @returns {Array<ManagementPositionsEntity>} Positions entities mapping with management ids.
 */
export function managementPositionsResponseTransform(response) {
  if (!isObject(response)) {
    throw new Error("Response must be an object of user positions positions mapping");
  }
  /**
   * @type {Array<ManagementPositionsEntity>}
   */
  let transformedResponse = [];
  Object.keys(response).forEach((item) => {
    /* @ts-ignore */
    transformedResponse.push(managementPositionsItemTransform(response[item]));
  });
  return transformedResponse;
}

/**
 * Transform Management positions item..
 *
 * @param {*} positionList Management positions list.
 * @returns {ManagementPositionsEntity} Management positions entitiy.
 */
function managementPositionsItemTransform(positionList) {
  /* @ts-ignore */
  positionList = positionList.map((item) => {
    return positionItemTransform(item);
  });

  let managementPositionEntity = createEmptyManagementPositionsEntity();
  managementPositionEntity.position = positionList.length ? positionList.splice(0, 1)[0] : {};
  managementPositionEntity.subPositions = positionList.length
    ? positionList.splice(0, positionList.length)
    : [];
  managementPositionEntity.position.subPositions = managementPositionEntity.subPositions.length;
  return managementPositionEntity;
}

/**
 * @returns {ManagementPositionsEntity} Empty management positions entity.
 */
function createEmptyManagementPositionsEntity() {
  return {
    position: createEmptyPositionEntity(),
    subPositions: [],
  };
}

/**
 *
 * @typedef {Object} ManagementBalanceAndPositionsEntity
 * @property {Array<ManagementPositionsEntity>} positions
 * @property {ProviderBalanceEntity} balance
 */

/**
 * Transform management positions response to typed object mapping.
 *
 * @param {*} response Management balance and positions list response.
 * @returns {ManagementBalanceAndPositionsEntity} Balance and Positions entities mapping with management ids.
 */
export function managementBalanceAndPositionsResponseTransform(response) {
  let transformedResponse = createEmptyManagementBalanceAndPositionsEntity();
  transformedResponse.positions = managementPositionsResponseTransform(response.positions);
  transformedResponse.balance = providerBalanceResponseTransform(response.balance);
  return transformedResponse;
}

/**
 * @returns {ManagementBalanceAndPositionsEntity} Empty management positions entity.
 */
function createEmptyManagementBalanceAndPositionsEntity() {
  return {
    positions: [],
    balance: null,
  };
}

/**
 * Transform Profile notifications response.
 *
 * @param {*} response .
 * @returns {ProfileNotifications} Provider Data points entity.
 */
export function profileNotificationsResponseTransform(response) {
  const emptyProfileNotificationsEntity = createEmptyProfileNotificationsEntity();
  // Override the empty entity with the values that came in from API.
  const transformedResponse = assign(emptyProfileNotificationsEntity, response);

  return transformedResponse;
}

/**
 * Create profile notifications entity.
 * @returns {ProfileNotifications} User entity.
 */
function createEmptyProfileNotificationsEntity() {
  return {
    emailEnable: false,
    emailNews: false,
    emailOpenPosition: false,
    emailUpdatePosition: false,
    emailSubscriptionWarning: false,
    telegramEnable: false,
    telegramNews: false,
    telegramUpdatePosition: false,
    telegramSubscriptionWarning: false,
    telegramCode: "",
  };
}

/**
 * @typedef {Object} CopyTraderCreatePayload
 * @property {string} name
 * @property {string} exchange
 * @property {string} exchangeType
 * @property {string} [minAllocatedBalance]
 * @property {string} quote
 * @property {boolean} [profitSharing]
 * @property {number} [profitsShare]
 */

/**
 * @typedef {Object} ProviderOptions
 * @property {boolean} acceptUpdateSignal
 * @property {boolean} allowClones
 * @property {boolean} allowSendingBuyOrdersAsMarket
 * @property {boolean} enablePanicSellSignals
 * @property {boolean} enableSellSignals
 * @property {boolean} limitPriceFromSignal
 * @property {boolean} reBuyFromProvider
 * @property {boolean} reBuysFromSignal
 * @property {boolean} reUseSignalIdIfClosed
 * @property {boolean} riskFilter
 * @property {boolean} stopLossFromSignal
 * @property {boolean} successRateFilter
 * @property {boolean} takeProfitsFromSignal
 * @property {boolean} terms
 * @property {boolean} useLeverageFromSignal
 */

/**
 * @typedef {ProviderOptions & Object} ProviderCreatePayload
 * @property {string} name
 * @property {string} description
 * @property {string} disclaimer
 * @property {string} exchangeType
 * @property {string} projectId
 * @property {string} providerId
 * @property {Array<string>} quotes
 * @property {Array<string>} exchanges
 * @property {Number} version
 */

/**
 * @typedef {Object} NewProviderEntity
 * @property {string} id
 * @property {string} name
 * @property {string} key
 * @property {string} userId
 * @property {string} projectId
 * @property {string} description
 * @property {Array<string>} exchanges
 * @property {string} exchangeType
 * @property {DefaultProviderOptions} options
 * @property {string} minAllocatedBalance
 * @property {boolean} isCopyTrading
 * @property {string} quote
 * @property {boolean} public
 * @property {boolean} list
 * @property {Object} signalsLastUpdate
 * @property {boolean} updatingSignal
 * @property {Array<string>} disabledMarkets
 * @property {boolean} locked
 * @property {Object} lockedAt
 * @property {string} lockedBy
 * @property {string} lockedFrom
 * @property {Object} copyTradingStatsLastUpdate
 */

/**
 * Transform Create Provider response.
 *
 * @param {*} response Trade API create provider response.
 * @returns {NewProviderEntity} Provider
 */
export function providerCreateResponseTransform(response) {
  const emptyNewProviderEntity = createEmptyNewProviderEntity();
  const normalizedId = response._id
    ? response._id.$oid || response._id
    : response.providerId
    ? response.providerId
    : "";
  const normalizeduserId = isObject(response.userId) ? response._id.$oid : "";
  // Override the empty entity with the values that came in from API.
  const transformedResponse = assign(emptyNewProviderEntity, response, {
    id: normalizedId,
    userId: normalizeduserId,
  });

  return transformedResponse;
}

/**
 * Create an empty Created Provider Entity
 * @returns {NewProviderEntity} New Provider entity.
 */
const createEmptyNewProviderEntity = () => {
  return {
    id: "",
    name: "",
    key: "",
    userId: "",
    projectId: "",
    description: "",
    exchanges: [],
    exchangeType: "",
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
      allowClones: true,
      customerKey: false,
      disclaimer: "",
    },
    minAllocatedBalance: "",
    isCopyTrading: false,
    quote: "",
    public: false,
    list: false,
    signalsLastUpdate: null,
    updatingSignal: false,
    disabledMarkets: [],
    locked: false,
    lockedAt: null,
    lockedBy: "",
    lockedFrom: "",
    copyTradingStatsLastUpdate: null,
  };
};

/**
 * @typedef {Object} CloneActionResponseObject
 * @property {String} providerId
 */

/**
 * Transform Clone Provider response.
 *
 * @param {*} response Trade API create provider response.
 * @returns {CloneActionResponseObject} Provider
 */
export function cloneProviderResponseTransform(response) {
  if (!isString(response)) {
    throw new Error("Response must be a string of provider ID.");
  }

  return { providerId: response };
}

/**
 * @typedef {Object} UserAvailableBalanceObject
 * @property {Number} BNB
 * @property {Number} BNT
 * @property {Number} PERL
 * @property {Number} ARK
 * @property {Number} ATOM
 * @property {Number} EOS
 * @property {Number} KAVA
 * @property {Number} KMD
 * @property {Number} LOOM
 * @property {Number} ONE
 * @property {Number} TFUEL
 * @property {Number} TOMO
 * @property {Number} VTHO
 * @property {Number} USDT
 */

/**
 * Transform User's available balance response.
 *
 * @param {*} response User's available balance response.
 * @returns {UserAvailableBalanceObject} User's available balance entity.
 */
export function userAvailableBalanceResponseTransform(response) {
  if (!isObject(response)) {
    throw new Error("Response must be an object of user exchange coins.");
  }

  return assign(createEmptyAvailableBalanceEntity(), response);
}

/**
 * Create User's available balance emoty entity.
 *
 * @returns {UserAvailableBalanceObject} User's available balance empty entity.
 */
const createEmptyAvailableBalanceEntity = () => {
  return {
    BNB: 0,
    BNT: 0,
    PERL: 0,
    ARK: 0,
    ATOM: 0,
    EOS: 0,
    KAVA: 0,
    KMD: 0,
    LOOM: 0,
    ONE: 0,
    TFUEL: 0,
    TOMO: 0,
    VTHO: 0,
    USDT: 0,
  };
};

/**
 *
 * @typedef {Object} SessionResponseObject
 * @property {String} status
 * @property {Number} validUntil
 */

/**
 * Transform session response to session entity.
 *
 * @param {*} response Response from backend.
 * @returns {SessionResponseObject} Session entity.
 */
export function sessionDataResponseTransform(response) {
  return {
    status: response.status,
    validUntil: response.validUntil * 1000,
  };
}

/**
 * @typedef {Object} ExchangeOpenOrdersObject
 * @property {String} id
 * @property {String} orderId
 * @property {String} positionId
 * @property {String} symbol
 * @property {Number} amount
 * @property {Number} price
 * @property {String} side
 * @property {String} type
 * @property {Number} timestamp
 * @property {String} datetime
 * @property {String} status
 * @property {String} datetimeReadable
 */

/**
 * Transform exchange open orders response.
 *
 * @param {*} response Exchange open orders response.
 * @returns {Array<ExchangeOpenOrdersObject>} Exchange open orders response entity.
 */
export function exchangeOpenOrdersResponseTransform(response) {
  if (!isArray(response)) {
    throw new Error("Response must be an array of objects");
  }

  return response.map((item) => {
    return exchangeOrdersItemTransform(item);
  });
}

/**
 * Transform open orders entity from response.
 *
 * @param {*} order Exchange open orders entity from response.
 * @returns {ExchangeOpenOrdersObject} Transformed open orders entity.
 */
function exchangeOrdersItemTransform(order) {
  const time = moment(Number(order.timestamp));
  const orderEntity = assign(createEmptyExchangeOpenOrdersEntity(), order, {
    id: Math.random().toString(),
    datetimeReadable: time.format("YYYY/MM/DD HH:mm"),
  });
  return orderEntity;
}

/**
 * Create an empty exchange order Entity.
 *
 * @returns {ExchangeOpenOrdersObject} Empty exchange order entity.
 */
const createEmptyExchangeOpenOrdersEntity = () => {
  return {
    id: "",
    orderId: "",
    positionId: "",
    symbol: "",
    amount: 0,
    price: 0,
    side: "",
    type: "",
    timestamp: 0,
    datetime: "",
    datetimeReadable: "",
    status: "",
  };
};

/**
 * @typedef {Object} ExchangeContractsObject
 * @property {String} id
 * @property {String} positionId
 * @property {Number} amount
 * @property {Number} entryprice
 * @property {Number} leverage
 * @property {Number} liquidationprice
 * @property {Number} margin
 * @property {Number} markprice
 * @property {String} side
 * @property {String} symbol
 */

/**
 * Transform exchange contract response.
 *
 * @param {*} response Exchange contract response.
 * @returns {Array<ExchangeContractsObject>} Exchange contract entity.
 */
export function exchangeContractsResponseTransform(response) {
  if (!isArray(response)) {
    throw new Error("Response must be an array of objects");
  }

  return response.map((item) => {
    return exchangeContractsItemTransform(item);
  });
}

/**
 * Transform exchange contract entity from response.
 *
 * @param {*} contract Exchange contracts entity from response.
 * @returns {ExchangeContractsObject} Transformed contracts entity.
 */
function exchangeContractsItemTransform(contract) {
  const orderEntity = assign(createEmptyExchangeContractsEntity(), contract, {
    id: Math.random().toString(),
    positionId: contract.position,
  });
  return orderEntity;
}

/**
 * Create an empty exchange contract entity
 *
 * @returns {ExchangeContractsObject} Empty exchaneg conytract entity.
 */
export const createEmptyExchangeContractsEntity = () => {
  return {
    id: "",
    positionId: "",
    amount: 0,
    entryprice: 0,
    leverage: 0,
    liquidationprice: 0,
    margin: 0,
    markprice: 0,
    side: "",
    symbol: "",
  };
};

/**
 * @typedef {Object} ProfitStatsObject
 * @property {String} date
 * @property {String} invested
 * @property {Number} profit
 * @property {Number} profitFromInvestmentPercentage
 * @property {String} quote
 * @property {String} returned
 * @property {Number} totalPositions
 * @property {Number} totalWins
 */

/**
 * Transform profile profits stats response.
 *
 * @param {*} response Profile profits response.
 * @returns {Array<ProfitStatsObject>} Profile profits entity collection.
 */
export function profitStatsResponseTransform(response) {
  if (!isArray(response)) {
    throw new Error("Response must be an array of objects");
  }

  return response.map((item) => {
    return profitStatsItemTransform(item);
  });
}

/**
 * Transform profile profits stats response item.
 *
 * @param {*} item Profile profits response entity.
 * @returns {ProfitStatsObject} Profile profits entity.
 */
function profitStatsItemTransform(item) {
  return assign(createEmptyProfitStatsEntity(), item, {
    profit: formatFloat(item.profit),
    profitFromInvestmentPercentage: formatFloat2Dec(item.profitFromInvestmentPercentage),
  });
}

/**
 * Create an empty profile profits entity
 *
 * @returns {ProfitStatsObject} Empty profile profits entity.
 */
const createEmptyProfitStatsEntity = () => {
  return {
    date: "",
    invested: "",
    profit: 0,
    profitFromInvestmentPercentage: 0,
    quote: "",
    returned: "",
    totalPositions: 1,
    totalWins: 0,
  };
};

/**
 * Transform profile profits stats response.
 *
 * @param {*} response Profile profits response.
 * @returns {ProfileProviderStatsObject} Profile profits entity collection.
 */
export function profileProviderStatsResponseTransform(response) {
  if (!isObject(response)) {
    throw new Error("Response must be an object");
  }

  let transformedResponse = assign(createEmptyProfileProviderStatsEntity(), response);
  transformedResponse.signalsInfo = transformedResponse.signalsInfo
    ? transformedResponse.signalsInfo.map((item) => {
        return createEmptyProfileProviderSignalsEntity(item);
      })
    : [];
  return transformedResponse;
}

/**
 * @typedef {Object} ProfileProviderStatsObject
 * @property {ProviderEntity} providerInfo
 * @property {Array<ProfileProviderStatsSignalsObject>} signalsInfo
 */

/**
 * @typedef {Object} ProfileProviderStatsSignalsObject
 * @property {String} date
 * @property {String} dateReadable
 * @property {String} pair
 * @property {String} base
 * @property {String} quote
 * @property {String} exchange
 * @property {String} averageEntryPrice
 * @property {String} i24HighPercentage
 * @property {String} i24LowPercentage
 * @property {String} i3DHighPercentage
 * @property {String} i3DLowPercentage
 * @property {String} iweekHighPercentage
 * @property {String} iweekLowPercentage
 * @property {String} imonthHighPercentage
 * @property {String} imonthLowPercentage
 * @property {String} i3MonthHighPercentage
 * @property {String} i3MonthLowPercentage
 */

/**
 * Create an empty profile profits entity
 *
 * @returns {ProfileProviderStatsObject} Empty profile profits entity.
 */
export const createEmptyProfileProviderStatsEntity = () => {
  return {
    providerInfo: {
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
      floating: 0,
      openPositions: 0,
      closedPositions: 0,
      exchangeType: "",
      exchangeInternalId: "",
      profitSharing: false,
      profitsShare: 0,
      profitsMode: "",
      provType: "copytrading",
      providerLink: "",
    },
    signalsInfo: [],
  };
};

/**
 * Create an empty profile profits entity
 * @param {*} item response signals item.
 * @returns {ProfileProviderStatsSignalsObject} Empty profile profits entity.
 */
const createEmptyProfileProviderSignalsEntity = (item) => {
  return {
    date: item.createdAt,
    dateReadable: moment(Number(item.createdAt)).format("YYYY/MM/DD HH:mm"),
    pair: `${item.base}/${item.quote}`,
    base: item.base,
    quote: item.quote,
    exchange: item.exchange,
    averageEntryPrice: item.averageEntryPrice,
    i24HighPercentage: item.i24h_higherPricePercentage,
    i24LowPercentage: item.i24h_lowerPricePercentage,
    i3DHighPercentage: item.i3d_higherPricePercentage,
    i3DLowPercentage: item.i3d_lowerPricePercentage,
    iweekHighPercentage: item.i1w_higherPricePercentage,
    iweekLowPercentage: item.i1w_lowerPricePercentage,
    imonthHighPercentage: item.i1m_higherPricePercentage,
    imonthLowPercentage: item.i1m_lowerPricePercentage,
    i3MonthHighPercentage: item.i3m_higherPricePercentage,
    i3MonthLowPercentage: item.i3m_lowerPricePercentage,
  };
};

/**
 * Transform profits sharing balance history response.
 *
 * @param {*} response Profits sharing balance history response.
 * @returns {ProfitSharingBalanceHistory} Profits sharing balance history entity.
 */
export function profitSharingBalanceHistoryResponseTransform(response) {
  return {
    ...response,
    entries: response.entries.map((/** @type {*} */ e) => ({
      ...e,
      date: dayjs(Number(e.date)).toDate(),
    })),
  };
}

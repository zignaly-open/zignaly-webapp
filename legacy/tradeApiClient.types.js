/**
 * Default Single Provider object from 'getProvider' endpoint.
 *
 * @typedef {Object} DefaultProviderGetObject
 * @property {Boolean} connected
 * @property {String} copyTradingQuote
 * @property {Boolean} disable True when provider is not connected.
 * @property {String} exchangeInternalId
 * @property {String} exchangeType
 * @property {Array<String>} exchanges
 * @property {String} id
 * @property {DefaulProviderInternalPaymentObject} internalPaymentInfo
 * @property {Boolean} isAdmin
 * @property {Boolean} isClone
 * @property {Boolean} isCopyTrading
 * @property {Boolean} key
 * @property {Boolean} list
 * @property {Boolean} liquidated
 * @property {String} logoUrl
 * @property {Number} minAllocatedBalance
 * @property {String} name
 * @property {DefaultProviderOptions} options
 * @property {Boolean} public
 * @property {DefaultProviderUserPaymentObject} userPaymentInfo
 * @property {String} website
 * @property {Number} allocatedBalance User's allocated balance
 * @property {DefaultProviderAllocatedUpdatedAtObject} allocatedBalanceUpdatedAt
 * @property {Boolean} balanceFilter
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
 * @property {Number} maxDrawdown
 * @property {Number} maxAllocatedBalance
 * @property {Number} maxPositions
 * @property {String} privacy
 * @property {Boolean} verified KYC passed
 * @property {false} notificationsPosts Flag to turn on emails notifications when new posts are created.
 * @property {Array<DefaultProviderExchangeIDsObject>} exchangeInternalIds
 * @property {string} userId
 * @property {boolean} acceptZigFee
 */

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
 * @typedef {Object} ExchangeDepositAddress
 * @property {string} currency
 * @property {string} address
 * @property {string} tag
 */

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
 * @typedef {Object} ProviderEntity
 * @property {string} id
 * @property {string} name
 * @property {number} price
 * @property {Array<string>} exchanges
 * @property {boolean} disable False if user is copying
 * @property {string} logoUrl
 * @property {boolean} isClone
 * @property {boolean} isCopyTrading
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
 * @property {string} providerLink
 * @property {Array<DefaultProviderExchangeIDsObject>} exchangeInternalIds
 * @property {boolean} isAdmin True if the current user is provider's admin
 * @property {number} currentAllocated Allocated balance with unrealized pnl.
 * @property {number} allocatedBalance Allocated balance without unrealized pnl.
 * @property {number} profitsSinceCopying
 * @property {boolean} CTorPS
 * @property {boolean} copyTrader
 * @property {boolean} liquidated
 * @property {number} globalReturn
 * @property {Number} maxDrawdown
 * @property {Number} maxAllocatedBalance
 * @property {Number} maxPositions
 * @property {String} privacy
 * @property {Boolean} verified KYC passed
 */

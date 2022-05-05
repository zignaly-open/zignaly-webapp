interface MultiSideData {
  amount: number;
  price: string;
  priceDifference: number;
}

interface ReBuyTarget {
  targetId: number;
  triggerPercentage: number;
  priceTarget?: number;
  pricePriority: "percentage" | "price";
  quantity: number;
  buying: boolean;
  done: boolean;
  orderId: string;
  cancel: boolean;
  skipped: boolean;
  buyType: string;
  errorMSG: string;
  postOnly: boolean;
}

interface ReduceOrder {
  targetId: number;
  type: string;
  targetPercentage: number;
  availablePercentage: number;
  done: boolean;
  recurring: boolean;
  persistent: boolean;
  orderId: string;
  errorMSG: string;
  price: string;
  amount: string;
}

interface ProfitTarget {
  targetId: number;
  amountPercentage: number;
  done: boolean;
  orderId: string;
  priceTargetPercentage: number;
  priceTarget: number;
  pricePriority: number;
  cancel: boolean;
  skipped: boolean;
  updating: boolean;
  postOnly: boolean;
}

interface PositionBase {
  /**
   * DCA/Rebuy targets.
   */
  reBuyTargets: Record<number, ReBuyTarget>;
  /**
   * Reduce position orders.
   */
  reduceOrders: Record<number, ReduceOrder>;
  /**
   * Take profit targets.
   */
  takeProfitTargets: Record<number, ProfitTarget>;
  /**
   * Invested amount without including the leveraged part.
   */
  realInvestment: number;
  /**
   * Flag that indicate when a position is closed.
   */
  closed: boolean;
  /**
   * Flag that indicates that this position owner and copy trader signal provider owner are the same.
   */
  isCopyTrader: boolean;
  /**
   * Flag that indicates that position is derived from copy trader signal.
   */
  isCopyTrading: boolean;
  /**
   * Flag that indicates that position is executed in paper trading (demo) exchange.
   */
  paperTrading: boolean;
  /**
   * Flag that indicates when trailing stop is triggered.
   */
  trailingStopTriggered: boolean;
  /**
   * Flag that indicates that some position updates are in progress.
   */
  updating: boolean;
  /**
   * Expiration time of the entry order, if not filled during this seconds will be aborted.
   */
  buyTTL: number;
  /**
   * Flag to indicate if it is a profit sharing service position.
   */
  profitSharing: boolean;
  /**
   * Futures position leverage level, X times real position size borrowed from exchange.
   */
  leverage: number;
  /**
   * Profit style (coloring) based on gain/loss.
   */
  netProfitStyle: string;
  /**
   * Open date represented in unix time epoch seconds.
   */
  openDate: number;
  /**
   * Position size represented in quote currency.
   */
  positionSizeQuote: number;
  /**
   * Profit amount without fees substraction.
   */
  profit: number;
  /**
   * Invested amount percentage that is still in risk relative to current price and exit protections (stop loss / trailing stop).
   */
  risk: number;
  /**
   * Position status, see translations/en.yml STATUS section for detailed list.
   */
  status: number;
  /**
   * Price percentage stop loss, relative to entry price.
   */
  stopLossPercentage: number;
  /**
   * Stop loss price.
   */
  stopLossPrice: number;
  /**
   * Stop loss priority (price or percentage).
   */
  stopLossPriority: string;
  /**
   * Take profit targets that was executed with failures counter.
   */
  takeProfitTargetsCountFail: number;
  /**
   * Take profit targets not yet reached and not executed counter.
   */
  takeProfitTargetsCountPending: number;
  /**
   * Take profit targets succesfully executed counter.
   */
  takeProfitTargetsCountSuccess: number;
  /**
   * Rebuy / DCA targets that was executed with failures counter.
   */
  reBuyTargetsCountFail: number;
  /**
   * Rebuy / DCA targets not yet reached and not executed counter.
   */
  reBuyTargetsCountPending: number;
  /**
   * Rebuy / DCA targets succesfully executed counter.
   */
  reBuyTargetsCountSuccess: number;
  /**
   * Trailing stop distance percentage, the stop will move dynamically following the trend at this distance.
   */
  trailingStopPercentage: number;
  /**
   * Trailing stop trigger price or false when not enabled.
   */
  trailingStopTriggerPrice: number | boolean;
  /**
   * Trailing stop entry price percentage increase that will trigger the trailing stop start.
   */
  trailingStopTriggerPercentage: number;
  /**
   * Trailing stop loss priority (price or percentage).
   */
  trailingStopTriggerPriority: string;
  /**
   * Elapsed time since position was opened in human readable format.
   */
  age: string;
  /**
   * Elapsed seconds since position was opened.
   */
  ageSeconds: number;
  /**
   * Position invested amount in quote currency.
   */
  amount: number;
  /**
   * Base currency ID, i.e. "BTC".
   */
  base: string;
  /**
   * Quote currency price at the moment of order entry was filled.
   */
  buyPrice: number;
  /**
   * Close date in human readable format.
   */
  closeDateReadable: string;
  /**
   * Allocated copy trading balance when the trade was open.
   */
  currentAllocatedBalance: number;
  /**
   * Exchange name where position was filled.
   */
  exchange: string;
  /**
   * Exchange type (futures / spot) used to operate the position.
   */
  exchangeType: string;
  /**
   * Exchange connection name where position was filled.
   */
  exchangeInternalName: string;
  /**
   * Exit price style (coloring) based on gain/loss.
   */
  exitPriceStyle: string;
  /**
   * Exchange connection ID, reference the connection of an exchange to Zignaly account.
   */
  internalExchangeId: string;
  /**
   * Exchange connection ID, reference the connection of an exchange to Zignaly account.
   */
  exchangeInternalId: string;
  /**
   * Invested amount on this position, including leveraged part.
   */
  invested: number;
  /**
   * Currency ID of the invested amount.
   */
  investedQuote: string;
  /**
   * Open date in human readable format.
   */
  openDateReadable: string;
  /**
   * Zignaly position ID.
   */
  positionId: string;
  /**
   * Position size in base currency.
   */
  positionSize: number;
  /**
   * Percentage gain/loss of the position based on current price in relation to entry price.
   */
  profitPercentage: number;
  /**
   * Profit style (coloring) based on gain/loss.
   */
  profitStyle: string;
  /**
   * Copy trader provider ID that originated the signal for position entry.
   */
  providerId: string;
  /**
   * Copy trader service owner user ID.
   */
  providerOwnerUserId: string;
  /**
   * Copy trader provider profile page URL.
   */
  providerLink: string;
  /**
   * Copy trader provider logo (will be deprecated in favor of provideerLogo).
   */
  logoUrl: string;
  /**
   * Copy trader provider logo.
   */
  providerLogo: string;
  /**
   * Copy trader provider name.
   */
  providerName: string;
  /**
   * Quote currency ID.
   */
  quote: string;
  /**
   * Remaining position amount after apply take profits (decrease) / rebuy (increase).
   */
  remainAmount: number;
  /**
   * Remaining position amount minus locked amount from pending buy/sell orders.
   */
  availableAmount: number;
  /**
   * Risk style (coloring) based on gain/loss.
   */
  riskStyle: string;
  /**
   * Exit price for closed position, current price for open positions.
   */
  sellPrice: number;
  /**
   * Position side (LONG / SHORT).
   */
  side: string;
  /**
   * Copy trader signal ID.
   */
  signalId: string;
  /**
   * Stop loss style (coloring) based on gain / loss.
   */
  stopLossStyle: string;
  /**
   * Currency pair in separated format, i.e. "BTC/USDT".
   */
  pair: string;
  /**
   * Currency pair in separated format, i.e. "BTC/USDT".
   */
  symbol: string;
  /**
   * Zignaly user ID.
   */
  userId: string;
  /**
   * Position status category.
   */
  type: "unsold" | "sold" | "unopened" | "open" | "log" | "closed" | "";
  /**
   * Position totals stats, only apply for position of copy trader provider.
   */
  copyTradingTotals: PositionEntityTotals;
  /**
   * Followers copied positions derived from this position, only apply for position of copy trader provider.
   */
  subPositions: number;
  /**
   * Price difference from entry price.
   */
  priceDifference: number;
  /**
   * Price difference style (coloring) based on gain/loss.
   */
  priceDifferenceStyle: string;
  /**
   * Unrealized profit style (coloring) based on gain/loss.
   */
  unrealizedProfitStyle: string;
  /**
   * % of the balance that was allocated (Copy Traders).
   */
  positionSizePercentage: number;
  liquidationPrice: number;
  markPrice: number;
  markPriceStyle: string;
  margin: number;
  /**
   * Units displayed for the investment.
   */
  unitsInvestment: string;
  /**
   * Units displayed when bought.
   */
  unitsAmount: string;
  /**
   * Short symbol name displayed in Zignaly.
   */
  short: string;
  /**
   * TradingView symbol.
   */
  tradeViewSymbol: string;
  /**
   * Price/Amount info for MULTI side position
   */
  multiData?: { long: MultiSideData; short: MultiSideData };
  /**
   * Stop Loss moves each time a take profit target is reached
   */
  stopLossFollowsTakeProfit: boolean;
  /**
   * Stop Loss moves to break even (entry price) when take profit target is reached.
   */
  stopLossToBreakEven: boolean;
  /**
   * Stop loss order id
   */
  stopLossOrderId: string;
  isolated: boolean;
}

interface PositionClosed extends PositionBase {
  /**
   * Close date represented in unix time epoch seconds.
   */
  closeDate: number;
  /**
   * Exchange transaction fees.
   */
  fees: number;
  /**
   * Exchange transaction funding fees.
   */
  fundingFees: number;
  /**
   * Net profit amount.
   */
  netProfit: string;
  /**
   * Net percentage profit.
   */
  netProfitPercentage: number;
  /**
   * Percentage return from copy trader service allocated balance.
   */
  returnFromAllocated: number;
  /**
   * Percentage return from copy trader service invested balance.
   */
  returnFromInvestment: number;
}

interface PositionOpen extends PositionBase {
  /**
   * Unrealized profit / loss amount expressed in quote currency.
   */
  unrealizedProfitLosses: number;
  /**
   * Unrealized profit / loss percentage.
   */
  unrealizedProfitLossesPercentage: number;
}

type Position = PositionOpen & PositionClosed;

interface ProviderOptions {
  allowClones?: boolean;
}

interface TerminalProviderOption {
  providerId: string;
  providerName: string;
  providerQuote: string | boolean;
}

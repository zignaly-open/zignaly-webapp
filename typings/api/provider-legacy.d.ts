interface DefaultProviderExchangeIDsObject {
  disconnecting: boolean;
  disconnectionType: string;
  internalId: string;
  profitsMode: string;
  profitsShare: number;
  retain: number;
}

interface ProviderEntity {
  id: string;
  name: string;
  price: number;
  exchanges: Array<string>;
  /**
   * False if user is copying
   */
  disable: boolean;
  logoUrl: string;
  isClone: boolean;
  isCopyTrading: boolean;
  createdAt: number;
  isFromUser: boolean;
  quote: string;
  dailyReturns: Array<DailyReturn>;
  risk?: number;
  followers: number;
  /**
   * New followers in the past 7 days
   */
  newFollowers: number;
  returns: number;
  floating: number;
  openPositions: number;
  closedPositions: number;
  exchangeType: string;
  exchangeInternalId: string;
  profitSharing: boolean;
  profitsShare: number;
  profitsMode: string;
  exchangeInternalIds: Array<DefaultProviderExchangeIDsObject>;
  isAdmin: boolean;
  currentAllocated: number;
  allocatedBalance: number;
  profitsSinceCopying: number;
  copyTrader: boolean;
  liquidated: boolean;
  globalReturn: number;
  maxDrawdown: number;
  maxAllocatedBalance: number;
  maxPositions: number;
  privacy: string;
  verified: boolean;
}

interface ProviderDetails {
  connected: boolean;
  copyTradingQuote: string;
  /** True when provider is not connected. */
  disable: boolean;
  exchangeInternalId: string;
  exchangeType: string;
  exchanges: Array<string>;
  id: string;
  isAdmin: boolean;
  isClone: boolean;
  isCopyTrading: boolean;
  key: string;
  list: boolean;
  liquidated: boolean;
  logoUrl: string;
  minAllocatedBalance: number;
  name: string;
  options: DefaultProviderOptions;
  public: boolean;
  userPaymentInfo: DefaultProviderUserPaymentObject;
  website: string;
  allocatedBalance: number;
  allocatedBalanceUpdatedAt: DefaultProviderAllocatedUpdatedAtObject;
  balanceFilter: boolean;
  createdAt: string;
  enableInProvider: boolean;
  originalBalance: string;
  profitsFromClosedBalance: string;
  reBuyFromProvider: boolean;
  riskFilter: boolean;
  successRateFilter: boolean;
  terms: boolean;
  team: Array<DefaultProviderTeamObject>;
  social: Array<DefaultProviderSocialObject>;
  about: string;
  strategy: string;
  performance: DefaultProviderPermormanceObject;
  avgHoldingTime: number;
  activeSince: number;
  avgTradesPerWeek: number;
  profitableWeeks: number;
  followers: number;
  stripe: DefaultProviderStripeObject;
  acceptUpdateSignal: boolean;
  allowSendingBuyOrdersAsMarket: boolean;
  customerKey: string;
  disclaimer: boolean;
  enablePanicSellSignals: boolean;
  enableSellSignals: boolean;
  limitPriceFromSignal: boolean;
  limitReBuys: string;
  long: boolean;
  mid: boolean;
  quantityPercentage: number;
  reBuyAll: boolean;
  reBuyFirst: boolean;
  reBuyLast: boolean;
  reBuysFromSignal: boolean;
  reUseSignalIdIfClosed: boolean;
  risk: string;
  shortmid: boolean;
  short: boolean;
  stopLossFromSignal: boolean;
  successRate: string;
  takeProfitAll: boolean;
  takeProfitFirst: boolean;
  takeProfitLast: boolean;
  takeProfitsFromSignal: boolean;
  trailingStopFromSignal: boolean;
  useLeverageFromSignal: boolean;
  price: number;
  loading: boolean;
  signalProviderQuotes: Array<string>;
  profitSharing: boolean;
  profitsShare: number;
  profitsMode: string;
  maxDrawdown: number;
  maxAllocatedBalance: number;
  maxPositions: number;
  privacy: string;
  verified: boolean;
  notificationsPosts: false;
  exchangeInternalIds: Array<DefaultProviderExchangeIDsObject>;
  userId: string;
  acceptZigFee: boolean;
}

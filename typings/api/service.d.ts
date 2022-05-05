interface InvestorsRes {
  investment: string;
  profitLosses: string;
  profitLossesPercent: string;
  profitLossesTotal: string;
  totalFeesPaid: string;
  status: string;
  successFee: number;
  feesInZig: boolean;
  userExchangeId: string;
  email: string;
  userId: string;
}

interface GetProviderFollowersReq extends PaginationOptions {
  providerId: string;
  connected: number;
  active: number;
  suspended: number;
}

interface GetProviderFollowersRes {
  pagination: PaginationsRes;
  data: ProviderFollowersEntity[];
}

interface Provider {
  id: string;
  name: string;
  exchanges: string[];
  exchangeType: string;
  logoUrl: string;
  isClone: boolean;
  createdAt: string;
  public: boolean;
  returns: number;
  floating: number;
  website: string;
  profitsShare?: number;
  profitMode?: string;
  profitSharing: boolean;
  isCopyTrading: boolean;
  exchangeInternalId: string;
  exchangeInternalIds: string[];
  followers: number;
  strategy: string;
  about: string;
  team: any[];
  social: any[];
  copyTradingQuote: string;
  quote: string;
  allocatedBalance: number;
  minAllocatedBalance: number;
  maxAllocatedBalance: number;
  maxDrawdown: number;
  /** KYC passed */
  verified: boolean;
  userId: string;
  isAdmin: boolean;
  options: ProviderOptions;
  privacy: "unlisted" | "listed_profile" | "listed_marketplace";
  profitsSinceCopying?: number;
  currentAllocated?: number;
}

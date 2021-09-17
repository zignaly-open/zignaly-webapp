interface User {
  id: string;
  firstName: string;
  email: string;
  "2FAEnable": boolean;
  isTrader: { copy_trading: boolean; profit_sharing: boolean; signal_providers: boolean };
  exchanges: ExchangeAccount[];
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
  options: object;
  exchangeInternalIds: any[];
  followers: number;
  strategy: string;
  about: string;
  team: any[];
  social: any[];
  copyTradingQuote: string;
  minAllocatedBalance: number;
  maxAllocatedBalance: number;
  verified: boolean;
  userId: string;
}

interface TerminalProviderOption {
  providerId: string;
  providerName: string;
  providerQuote: string | boolean;
}

interface ExchangeAccount {
  activated: boolean;
  exchangeId: string;
  exchangeName: string;
  exchangeType: "spot" | "futures";
  internal: boolean;
  internalId: string;
  internalName: string;
  name: string;
  isBrokerAccount: boolean;
  areKeysValid?: boolean;
}

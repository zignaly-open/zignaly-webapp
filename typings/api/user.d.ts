interface User {
  userId: string;
  firstName: string;
  email: string;
  "2FAEnable": boolean;
  isTrader: { copy_trading: boolean; profit_sharing: boolean; signal_providers: boolean };
  exchanges: ExchangeAccount[];
  isAdmin: boolean;
}

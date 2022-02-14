interface WalletNetwork {
  addressRegex: string;
  memoRegex: string;
  depositEnable: boolean;
  integerMultiple: string;
  isDefault: boolean;
  memoRegex: string;
  name: string;
  network: string;
  withdrawEnable: boolean;
}

interface WalletCoin {
  decimals: number;
  name: string;
  networks: WalletNetwork[];
  usdPrice: number;
}

type WalletCoins = Record<string, WalletCoin>;

interface WalletAddress {
  address: string;
  currency: string;
  memo: string;
}

interface BalanceData {
  balance: number;
  availableBalance: number;
}
type WalletBalance = Record<string, Record<string, BalanceData>>;

interface VaultOffer {
  id: number;
  minBalance: number;
  maxBalance: number;
  startDate: string;
  distributionDate: string;
  endDate: string;
  apr: number;
  distributionPeriod: string;
  // lockupDate: string;
  rewardsTotal: number;
  rewardsRemaining: number;
  coin: string;
  coinReward: string;
  stakingDays: number;
}

interface BalanceExchange {
  exchangeId: string;
  name: string;
  balance: number;
  networks: CoinNetwork[];
}

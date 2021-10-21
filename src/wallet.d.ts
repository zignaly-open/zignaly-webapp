interface WalletNetwork {
  addressRegex: string;
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
}

type WalletCoins = Record<string, WalletCoin>;

interface WalletAddress {
  address: string;
  currency: string;
  memo: string;
}

type WalletBalance = Record<string, Record<string, number>>;

interface AssetNetwork {
  name: string;
  network: string;
  coin: string;
  addressRegex: string;
  depositDesc: string;
  depositEnable: string;
  isDefault: boolean;
  memoRegex: string;
  resetAddressStatus: boolean;
  specialTips: string;
  withdrawDesc: string;
  withdrawEnable: boolean;
  withdrawFee: string;
  withdrawMin: string;
  integerMultiple: string;
}

interface ExchangeAsset {
  name: string;
  balanceFree: string;
  balanceLocked: string;
  balanceTotal: string;
  balanceFreeBTC: string;
  balanceLockedBTC: string;
  balanceTotalBTC: string;
  balanceFreeUSDT: string;
  balanceLockedUSDT: string;
  balanceTotalUSDT: string;
  balanceTotalExchCoin: string;
  exchCoin: string;
  maxWithdrawAmount: string;
  networks: Array<AssetNetwork>;
  coin: string;
}

type ExchangeAssets = Record<string, ExchangeAsset>;

interface ExchangeDepositAddress {
  currency: string;
  address: string;
  tag: string;
}

interface ExchangeContract {
  id: string;
  positionId: string;
  amount: number;
  entryprice: number;
  leverage: number;
  liquidationprice: number;
  margin: number;
  markprice: number;
  side: string;
  symbol: string;
}

interface ExchangeOpenOrder {
  id: string;
  orderId: string;
  positionId: string;
  symbol: string;
  amount: number;
  price: number;
  side: string;
  type: string;
  timestamp: number;
  datetime: string;
  status: string;
  datetimeReadable: string;
}

interface CoinNetwork {
  name: string;
  network: string;
  coin: string;
  addressRegex: string;
  depositDesc: string;
  depositEnable: string;
  isDefault: boolean;
  memoRegex: string;
  resetAddressStatus: boolean;
  specialTips: string;
  withdrawDesc: string;
  withdrawEnable: boolean;
  withdrawFee: string;
  withdrawMin: string;
  integerMultiple: string;
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

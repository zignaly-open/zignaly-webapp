interface ConvertPreviewRes {
  side: string;
  lastPrice: number;
  bridge: string;
  estimatedAmount: number;
}

interface TransactionsHistory {
  amount: string;
  formattedAmount: string;
  createdAt: string;
  currency: string;
  fees: string;
  fromAddress: string;
  fromName: string;
  toAddress: string;
  toName: string;
  providerId: string;
  providerName: string;
  transactionId: string;
  note: string;
  txUrl: string;
  network: string;
  status: string;
  type: string;
}

interface GetNetworkFeeRes {
  floatFee: string;
  expiration: number;
  key: string;
}

interface WidthdrawReq {
  network: string;
  currency: string;
  address: string;
  amount: string;
  fee: string;
  code?: string;
}

interface ConvertCoinPreviewReq {
  from: string;
  to: string;
  qty: string;
}

interface ConvertCoinReq {
  internalExchangeId: string;
  from: string;
  to: string;
  qty: string;
}

interface ConvertCoinRes {
  status: string;
  filled: string;
  remaining: string;
  feeCost: string;
  fee: string;
  id: string;
}

interface ConvertCoinPreviewRes {
  lastPrice: string;
  side: string;
  estimatedAmount: string;
  min: number;
}

interface GetQuoteAssetFromBaseReq {
  internalExchangeId: string;
  base: string;
}

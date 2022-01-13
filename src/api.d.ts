interface ConvertPreviewRes {
  side: string;
  lastPrice: number;
  bridge: string;
  estimatedAmount: number;
}

type TransactionType = "deposit" | "withdraw" | "internal" | "all";

interface GetTransactionsReq extends PaginationReq {
  type?: TransactionType;
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

interface DownloadTransactionsReq {
  type?: TransactionType;
}

interface GetNetworkFeeRes {
  floatFee: string;
  expiration: number;
  key: string;
  feeCurrency: string;
}

interface WidthdrawReq {
  network: string;
  memo: string;
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

interface PaginationReq {
  limit: number;
  offset: number;
}

interface InternalTransfersHistory {
  amount: number;
  asset: string;
  from: string;
  fromExchangeInternalId: string;
  fromExchangeName: string;
  processedAt: number;
  providerId: string;
  providerName: string;
  requestedAt: number;
  status: string;
  to: string;
  toExchangeInternalId: string;
  toExchangeName: string;
  transferType: string;
  txId: string;
  type: string;
}

interface GetInternalTransfersHistory extends PaginationReq {
  exchangeInternalId: string;
  type: string;
}

interface TotalSavings {
  total: number;
}

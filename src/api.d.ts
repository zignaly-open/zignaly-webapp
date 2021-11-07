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
  toAddress: string;
  transactionId: string;
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
}

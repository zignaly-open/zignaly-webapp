interface ConvertPreviewRes {
  side: string;
  lastPrice: number;
  bridge: string;
  estimatedAmount: number;
}

interface TransactionsHistory {
  amount: string;
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

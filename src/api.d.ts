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
  zigpadName: string;
  zigpadId: string;
  zigpadLogo: string;
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
  fromExchangeInternalName: string;
  processedAt: number;
  providerId: string;
  providerName: string;
  requestedAt: number;
  status: string;
  to: string;
  toExchangeInternalId: string;
  toExchangeName: string;
  toExchangeInternalName: string;
  transferType: string;
  txId: string;
  type: string;
  message: string;
}

interface GetInternalTransfersHistory extends PaginationReq {
  exchangeInternalId: string;
  type: string;
}

interface Social {
  name: string;
  url: string;
}
interface LaunchpadProject {
  id: number;
  pledged: number;
  coin: string;
  name: string;
  shortDescription: string;
  details: string;
  website: string;
  whitepaper: string;
  category: string;
  minAmount: number;
  maxAmount: number;
  offeredAmount: number;
  distributedAmount: number;
  startDate: string;
  calculationDate: string;
  distributionDates: DistributionDate[];
  socials: Social[];
  price: string;
  logo: string;
  progress: number;
  tokenReward: number;
}

interface Tokenomic {
  chain: string;
  publicSalePrice: number;
  supplyInitial: number;
  supplyTotalCap: number;
  hardCap: number;
  tokenDistributionDate: string;
  tokenSaleVestingPeriod: string;
  tokenDistribution: string;
  tokensOffered: number;
}

interface DistributionDate {
  date: string;
  percent: number;
}
interface LaunchpadProjectDetails {
  id: number;
  coin: string;
  name: string;
  shortDescription: string;
  details: string;
  website: string;
  whitepaper: string;
  category: string;
  minAmount: string;
  maxAmount: string;
  offeredAmount: number;
  distributedAmount: number;
  startDate: string;
  getReadyDate: string;
  calculationDate: string;
  distributionDates: DistributionDate[];
  vestingDate: string;
  socials: Social[];
  price: string;
  logo: string;
  highlights: string;
  additionalInfo: string;
  tokenomic: Tokenomic;
  tokenReward: number;
  privateRound: string;
  publicRound: string;
  returned: number;
  pledged: number;
  terms: string;
  launchpadRules: string;
}
interface TotalSavings {
  total: number;
}

interface PaginationOptions {
  page: number;
  maxPerPage: number;
  sort?: string;
  direction?: "asc" | "dsc";
}

interface PaginationsRes {
  page: number;
  max_per_page: number;
  from: number;
  to: number;
  total: number;
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

import faker from "faker";
import merge from "../../src/utils/merge";

export const makeProvider = (override?: NestedPartial<IDeepObj>, { type } = {}): IDeepObj => {
  const seed: IDeepObj = {
    id: faker.random.alphaNumeric(24),
    name: faker.commerce.productName(),
    exchanges: ["zignaly"],
    exchangeType: "spot",
    logoUrl: null,
    isClone: false,
    createdAt: "",
    public: true,
    returns: 2,
    floating: 10,
    options: {},
    website: "",
    exchangeInternalIds: [],
    profitMode: "",
    followers: 10,
    strategy: "",
    about: "",
    team: [],
    social: [],
    copyTradingQuote: "USDT",
    minAllocatedBalance: 0,
    maxAllocatedBalance: 50,
    ...(type === "profitSharing"
      ? {
          profitSharing: true,
          isCopyTrading: true,
          profitsShare: 5,
        }
      : type === "copyTrader"
      ? {
          profitSharing: false,
          isCopyTrading: true,
        }
      : {
          profitSharing: false,
          isCopyTrading: false,
        }),
  };
  return merge(seed, override);
};

const makeOption = (p) => ({
  providerId: p.id,
  providerName: p.name,
  providerQuote: "USDT",
  providerPayableBalance: 179.2811184496,
  providerAvailableBalance: 179.2811184496,
  providerConsumedBalance: 0,
  providerConsumedBalancePercentage: 0,
  providerAllocatedBalance: 180,
});

export const makeProviderOptions = (providers) => {
  const options = [
    {
      providerId: 1,
      providerName: "Manual Trading",
      providerQuote: false,
    },
  ];

  const providerOptions = providers.map((p) => makeOption(p));
  return options.concat(providerOptions);
};

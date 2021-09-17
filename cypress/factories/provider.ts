import faker from "faker";
import merge from "../../src/utils/merge";

interface MakeProviderOptions {
  type?: string;
}

export const makeProvider = (
  override?: Partial<Provider>,
  { type = "profitSharing" }: MakeProviderOptions = {},
): Provider => {
  const seed: Provider = {
    id: faker.random.alphaNumeric(24),
    name: faker.commerce.productName(),
    userId: faker.random.alphaNumeric(24),
    verified: false,
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
    followers: 10,
    strategy: "",
    about: "",
    team: [],
    social: [],
    copyTradingQuote: "USDT",
    minAllocatedBalance: 0,
    maxAllocatedBalance: 50,
    profitSharing: true,
    isCopyTrading: true,
    ...(type === "profitSharing"
      ? {
          profitsShare: 5,
          profitMode: "reinvest",
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
  return merge(seed, override) as Provider;
};

export const makeCopyTrader = (override: Partial<Provider>) => {
  return makeProvider({
    ...override,
    profitSharing: false,
    isCopyTrading: true,
  });
};

const makeOption = (p: Provider) => ({
  providerId: p.id,
  providerName: p.name,
  providerQuote: "USDT",
  providerPayableBalance: 179.2811184496,
  providerAvailableBalance: 179.2811184496,
  providerConsumedBalance: 0,
  providerConsumedBalancePercentage: 0,
  providerAllocatedBalance: 180,
});

export const makeProviderOptions = (providers: Provider[]) => {
  const options: TerminalProviderOption[] = [
    {
      providerId: "1",
      providerName: "Manual Trading",
      providerQuote: false,
    },
  ];

  const providerOptions = providers.map((p) => makeOption(p));
  return options.concat(providerOptions);
};

import faker from "faker";
import merge from "../../src/utils/merge";
import { generateExchangeId } from "./utils";

export const makeExchange = (override?: Partial<ExchangeAccount>): ExchangeAccount => {
  return {
    activated: true,
    exchangeId: faker.random.alphaNumeric(24),
    exchangeName: "Zignaly",
    exchangeType: "spot",
    internal: true,
    internalId: generateExchangeId(),
    internalName: "Zignaly Spot",
    isBrokerAccount: true,
    name: "Zignaly",
    ...override,
  };
};

export const makeFakeUser = (override?: Partial<User>): User => {
  const seed: User = {
    userId: faker.random.alphaNumeric(24),
    email: faker.internet.email(),
    firstName: faker.name.findName(),
    "2FAEnable": false,
    // eslint-disable-next-line
    isTrader: { copy_trading: false, profit_sharing: false, signal_providers: false },
    exchanges: [
      {
        activated: true,
        exchangeId: "5e662c1c3e3b24c186ed9c21",
        exchangeName: "Zignaly",
        exchangeType: "spot",
        internal: true,
        internalId: "Zignaly1585927408_5e8754f065080",
        internalName: "Zignaly Spot",
        isBrokerAccount: true,
        name: "Zignaly",
      },
      {
        activated: true,
        exchangeId: "5e662c1c3e3b24c186ed9c21",
        exchangeName: "Zignaly",
        exchangeType: "futures",
        internal: true,
        internalId: "Zignaly1185927111_068018f065acb",
        internalName: "Zignaly Futures",
        isBrokerAccount: true,
        name: "Zignaly",
      },
      {
        activated: false,
        exchangeId: "5e662c1c3e3b24c186ed9c21",
        exchangeName: "Zignaly",
        exchangeType: "spot",
        internal: true,
        internalId: "Zignaly1598187408_6acb54f060181",
        internalName: "Zignaly Not Activated",
        isBrokerAccount: true,
        name: "Zignaly",
      },
      {
        activated: true,
        exchangeId: "5b13fee5b233f6004cb8b884",
        exchangeName: "Binance",
        exchangeType: "spot",
        internal: true,
        internalId: "Zignaly9828187401_acb54faba182",
        internalName: "Binance Account",
        isBrokerAccount: true,
        name: "Binance",
        areKeysValid: true,
      },
    ],
  };
  return merge(seed, override) as User;
};

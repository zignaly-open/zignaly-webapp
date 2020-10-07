import { Userpilot } from "userpilot";

const appToken = "55mi72q1";

/**
 * @typedef {import("../services/tradeApiClient.types").UserEntity} UserEntity
 * @typedef {import("../services/tradeApiClient.types").ExchangeConnectionEntity} ExchangeConnectionEntity
 */

/**
 * @param {UserEntity} userData User Entity.
 * @returns {void} None.
 */
export const userPilotLogin = (userData) => {
  Userpilot.initialize(appToken);
  Userpilot.identify(userData.userId, {
    name: userData.firstName,
    email: userData.email,
    created_at: userData.createdAt,
    exchange_connected: userData.binanceConnected,
    provider_enabled: userData.providerEnable,
    buys_count: userData.buysCount,
    sells_count: userData.sellsCount,
  });
};

/**
 * @param {ExchangeConnectionEntity} exchange Added Exchange.
 * @returns {void} None.
 */
export const userPilotExchangeConnected = (exchange) => {
  Userpilot.initialize(appToken);
  Userpilot.track("Exchange Connected", {
    exchangeType: exchange.paperTrading ? "demo" : "real",
  });
};

export const userPilotProviderEnabled = () => {
  Userpilot.initialize(appToken);
  Userpilot.track("Provider Enabled", {});
};

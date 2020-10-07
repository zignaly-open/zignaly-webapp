import { Userpilot } from "userpilot";

const appToken = "55mi72q1";

/**
 * @typedef {import("../services/tradeApiClient.types").UserEntity} UserEntity
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
    createdAt: userData.createdAt,
    exchangeConnected: userData.binanceConnected,
    providerEnabled: userData.providerEnable,
    buysCount: userData.buysCount,
    sellsCount: userData.sellsCount,
  });
};

/**
 * @param {string} exchangeType Added Exchange.
 * @returns {void} None.
 */
export const userPilotExchangeConnected = (exchangeType) => {
  Userpilot.initialize(appToken);
  Userpilot.track("Exchange Connected", {
    exchangeType: exchangeType,
  });
};

export const userPilotProviderEnabled = () => {
  Userpilot.initialize(appToken);
  Userpilot.track("Provider Enabled", {});
};

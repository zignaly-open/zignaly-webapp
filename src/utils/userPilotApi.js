/**
 * @typedef {import("../services/tradeApiClient.types").UserEntity} UserEntity
 * @typedef {Object} UserPilotApi
 * @property {GlobalUserPilot} userpilot
 */

/**
 * @typedef {Object} GlobalUserPilot
 * @prop {Function} init Connect to user pilot remote API.
 * @prop {Function} track Track custom events in dashly.
 * @prop {Function} identify Eevnt to create or update user data.
 * @prop {Function} track
 * @prop {Function} trigger
 * @prop {Function} reset
 */

/**
 * User Pilot API object.
 *
 * @returns {UserPilotApi} User Pilot API object.
 */
const userPilotApi = () => {
  /**
   * @type {GlobalUserPilot}
   */
  let userpilot = null;

  // @ts-ignore
  if (typeof window !== "undefined" && window.userpilot) {
    // @ts-ignore
    userpilot = window.userpilot;
  }

  return { userpilot: userpilot };
};

export default userPilotApi;

/**
 * @param {UserEntity} userData User Entity.
 * @returns {void} None.
 */
export const userPilotLogin = (userData) => {
  const { userpilot } = userPilotApi();

  userpilot.identify(userData.userId, {
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
  const { userpilot } = userPilotApi();

  userpilot.track("Exchange Connected", {
    exchangeType: exchangeType,
  });
};

export const userPilotProviderEnabled = () => {
  const { userpilot } = userPilotApi();

  userpilot.track("Provider Enabled", {});
};

// @ts-ignore
import mixpanel from "mixpanel-browser";

/**
 * @typedef {import("../services/tradeApiClient.types").UserEntity} UserEntity
 * @typedef {Object} mixpanelApi
 * @property {GlobalMixpanel} mixPanel mixPanel API push function.
 */

/**
 * @typedef {Object} GlobalMixpanel
 * @prop {Function} init Connect to mixPanel remote API.
 * @prop {Function} track Track custom events in mixPanel.
 * @prop {Function} identify Eevnt to create or update user data.
 * @prop {Function} people Eevnt to set user data
 */

/**
 * mixPanel API function to track custom events.
 *
 * @returns {mixpanelApi} GTM push hook object.
 */
const mixpanelApi = () => {
  /**
   * @type {GlobalMixpanel}
   */
  let mixPanel = null;
  mixPanel = mixpanel;
  mixPanel.init("138797cddaa0676cd9c705bb533ddd9b");

  // if (process.env.NODE_ENV === "production") {
  //   mixPanel = mixpanel;
  //   mixPanel.init("2894-173f0edb1738610ede1cd7296e4");
  // }

  return { mixPanel: mixPanel };
};

export default mixpanelApi;

/**
 * Triger exchange connected event for mixPanel.
 *
 * @param {string} exchangeType Exchange type either demo or real
 * @returns {void} None.
 */
export const mixpanelExchangeConnected = (exchangeType) => {
  const { mixPanel } = mixpanelApi();

  if (mixPanel) {
    mixPanel.track("Exchange Linked", {
      exchangeType: exchangeType,
    });
  }
};

export const mixpanelProviderEnabled = () => {
  const { mixPanel } = mixpanelApi();

  if (mixPanel) {
    mixPanel.track("Provider Enabled", {});
  }
};

export const mixpanelPositionCreated = () => {
  const { mixPanel } = mixpanelApi();

  if (mixPanel) {
    mixPanel.track("Manual Position Created");
  }
};

/**
 * Triger path change event.
 *
 * @param {string} path Path of current page
 * @returns {void} None.
 */
export const mixpanelPageView = (path) => {
  const { mixPanel } = mixpanelApi();

  if (mixPanel) {
    mixPanel.track("Pageview", { "Page Path": path });
  }
};

/**
 * Trigger login/signup events for mixPanel.
 *
 * @param {UserEntity} userData User Entity.
 * @param {'login'|'signup'} type Type of event to trigger .
 * @returns {void} None.
 */
export const mixPanelTrigger = (userData, type) => {
  const { mixPanel } = mixpanelApi();
  const eventToTrigger = type === "login" ? "Login" : "Signup";

  if (mixPanel) {
    if (type === "login") {
      mixpanel.identify(userData.userId);
    } else {
      mixpanel.alias(userData.userId);
    }
    /* eslint-disable */
    mixpanel.people.set({
      $email: userData.email || "",
      $created: userData.createdAt || "",
      $first_name: userData.firstName,
      $last_login: new Date(),
      Plan: "",
      "Plan Id": "",
      "Plan Type": "",
      "Cookie-Ref": "",
      // Ref: userData.ref || "",
      "2FA": userData.twoFAEnable,
      Notify: userData.subscribe,
      Providers: userData.providerEnable,
      Id: userData.userId,
      "Binance Connected": userData.binanceConnected,
      "Buys Count": userData.buysCount,
      "Sells Count": userData.sellsCount,
      // Status: userData.status,
    });
    /* eslint-enable */
    mixPanel.track(eventToTrigger);
  }
};

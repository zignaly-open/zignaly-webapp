/**
 * @typedef {import("../services/tradeApiClient.types").UserEntity} UserEntity
 * @typedef {Object} DashlyApi
 * @property {GlobalDashly} dashly Dashly API push function.
 */

import user from "../reducers/user";

/**
 * @typedef {Object} GlobalDashly
 * @prop {Function} connect Connect to dashly remote API.
 * @prop {Function} track Track custom events in dashly.
 * @prop {Function} auth Trigger Auth event and start user session.
 * @prop {Function} onReady Event Triggered when connection is made to remote API.
 * @prop {Function} identify Eevnt to create or update user data.
 */

/**
 * Dashly API function to track custom events.
 *
 * @returns {DashlyApi} GTM push hook object.
 */
const dashlyApi = () => {
  /**
   * @type {GlobalDashly}
   */
  let dashly = null;

  // @ts-ignore
  if (typeof window !== "undefined" && window.dashly) {
    // @ts-ignore
    dashly = window.dashly;
    dashly.connect("2894-173f0edb1738610ede1cd7296e4");
  }

  return { dashly: dashly };
};

export default dashlyApi;

/**
 * Triger exchange connected event for dashly.
 *
 * @param {string} exchangeType Exchange type either demo or real
 * @returns {void} None.
 */
export const dashlyExchangeConnected = (exchangeType) => {
  const { dashly } = dashlyApi();

  if (dashly) {
    dashly.track("Exchange Connected", {
      exchangeType: exchangeType,
    });
  }
};

export const dashlyProviderEnabled = () => {
  const { dashly } = dashlyApi();

  if (dashly) {
    dashly.track("Provider Enabled", {});
  }
};

/**
 * Trigger login/signup events for dashly.
 *
 * @param {UserEntity} userData User Entity.
 * @param {'login'|'signup'} type Type of event to trigger .
 * @returns {void} None.
 */
export const dashlyTrigger = (userData, type) => {
  const { dashly } = dashlyApi();
  const eventToTrigger = type === "login" ? "$authorized" : "$registered";

  if (dashly) {
    dashly.auth(userData.userId || "", userData.dashlyHash || "");

    dashly.track(eventToTrigger, {
      $email: userData.email || "",
      $name: userData.firstName || "",
      subscribed: userData.subscribe,
      created: userData.createdAt || 0,
    });

    dashly.onReady(() => {
      dashly.identify([
        { op: "update_or_create", key: "$email", value: userData.email || "" },
        { op: "update_or_create", key: "$name", value: userData.firstName || "" },
      ]);

      dashly.identify([
        { op: "update_or_create", key: "ref", value: userData.ref || "" },
        { op: "update_or_create", key: "subscribed", value: userData.subscribe },
        { op: "update_or_create", key: "created", value: userData.createdAt || "" },
        { op: "update_or_create", key: "2fa", value: userData.twoFAEnable },
        { op: "update_or_create", key: "providers_enabled", value: userData.providerEnable },
        {
          op: "update_or_create",
          key: "demoExchangeConnected",
          value: userData.demoExchangeConnected,
        },
        {
          op: "update_or_create",
          key: "realExchangeConnected",
          value: userData.realExchangeConnected,
        },
        { op: "update_or_create", key: "buys_count", value: userData.buysCount || 0 },
        { op: "update_or_create", key: "sells_count", value: userData.sellsCount || 0 },
        { op: "update_or_create", key: "status", value: userData.status || 0 },

        {
          op: "update_or_create",
          key: "firstPositionOpenedAt",
          value: userData.firstPositionOpenedAt || "",
        },
        {
          op: "update_or_create",
          key: "firstPositionClosedAt",
          value: userData.firstPositionClosedAt || "",
        },
        {
          op: "update_or_create",
          key: "lastPositionOpenedAt",
          value: userData.lastPositionOpenedAt || "",
        },
        {
          op: "update_or_create",
          key: "lastPositionClosedAt",
          value: userData.lastPositionClosedAt || "",
        },
        {
          op: "update_or_create",
          key: "firstRealPositionOpenedAt",
          value: userData.firstRealPositionOpenedAt || "",
        },
        {
          op: "update_or_create",
          key: "firstRealPositionClosedAt",
          value: userData.firstRealPositionClosedAt || "",
        },
        {
          op: "update_or_create",
          key: "lastRealPositionOpenedAt",
          value: userData.lastRealPositionOpenedAt || "",
        },
        {
          op: "update_or_create",
          key: "lastRealPositionClosedAt",
          value: userData.lastRealPositionClosedAt || "",
        },
      ]);
    });
  }
};

/**
 * @typedef {import("../services/tradeApiClient.types").UserEntity} UserEntity
 * @typedef {Object} DashlyApi
 * @property {Object} dashly GTM API push function.
 */

/**
 * GTM push API function to track custom events.
 *
 * Note that GTM is disabled in local and push function is not available in
 * order to prevent that testing actions pollute the production data. In order
 * to enable during development enable includeInDevelopment flag at
 * gatsby-plugin-google-tagmanager gatsby-config.js
 *
 * @returns {DashlyApi} GTM push hook object.
 */
const dashlyApi = () => {
  let dashly = null;

  // Check that GTM is loaded and available for usage.
  // @ts-ignore
  if (typeof window !== "undefined" && window.dashly) {
    // @ts-ignore
    dashly = window.dashly;
  }

  return { dashly: dashly };
};

export default dashlyApi;

export const dashlyExchangeConnection = () => {
  const { dashly } = dashlyApi();

  if (dashly) {
    // @ts-ignore
    dashly.track("Exchange Connected");
  }
};

/**
 * @param {UserEntity} userData User Entity.
 * @returns {void} None.
 */
export const dashlyLogin = (userData) => {
  const { dashly } = dashlyApi();

  if (dashly) {
    // @ts-ignore
    dashly.auth(userData.userId, userData.dashlyHash);

    // @ts-ignore
    dashly.track("$authorized", {
      $email: userData.email,
      $name: userData.firstName,
      subscribed: userData.subscribe,
      created: userData.createdAt,
    });

    // @ts-ignore
    dashly.onReady(() => {
      // @ts-ignore
      dashly.identify([
        { op: "update_or_create", key: "$email", value: userData.email },
        { op: "update_or_create", key: "$name", value: userData.firstName },
      ]);

      // @ts-ignore
      dashly.identify([
        { op: "update_or_create", key: "ref", value: userData.ref },
        { op: "update_or_create", key: "subscribed", value: userData.subscribe },
        { op: "update_or_create", key: "created", value: userData.createdAt },
        { op: "update_or_create", key: "2fa", value: userData.twoFAEnable },
        { op: "update_or_create", key: "providers_enabled", value: userData.providerEnable },
        { op: "update_or_create", key: "exchange_connected", value: userData.binanceConnected },
        { op: "update_or_create", key: "buys_count", value: userData.buysCount },
        { op: "update_or_create", key: "sells_count", value: userData.sellsCount },
        { op: "update_or_create", key: "status", value: userData.status },
      ]);
    });
  }
};

/**
 * @param {UserEntity} userData User Entity.
 * @returns {void} None.
 */
export const dashlyRegister = (userData) => {
  const { dashly } = dashlyApi();

  if (dashly) {
    // @ts-ignore
    dashly.auth(userData.userId, userData.dashlyHash);

    // @ts-ignore
    dashly.track("$registered", {
      $email: userData.email,
      $name: userData.firstName,
      subscribed: userData.subscribe,
      created: userData.createdAt,
    });

    // @ts-ignore
    dashly.onReady(() => {
      // @ts-ignore
      dashly.identify([
        { op: "update_or_create", key: "$email", value: userData.email },
        { op: "update_or_create", key: "$name", value: userData.firstName },
      ]);

      // @ts-ignore
      dashly.identify([
        { op: "update_or_create", key: "ref", value: userData.ref },
        { op: "update_or_create", key: "subscribed", value: userData.subscribe },
        { op: "update_or_create", key: "created", value: userData.createdAt },
        { op: "update_or_create", key: "2fa", value: userData.twoFAEnable },
        { op: "update_or_create", key: "providers_enabled", value: userData.providerEnable },
        { op: "update_or_create", key: "exchange_connected", value: userData.binanceConnected },
        { op: "update_or_create", key: "buys_count", value: userData.buysCount },
        { op: "update_or_create", key: "sells_count", value: userData.sellsCount },
        { op: "update_or_create", key: "status", value: userData.status },
      ]);
    });
  }
};

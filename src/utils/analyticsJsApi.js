/**
 * @typedef {import("../services/tradeApiClient.types").UserEntity} UserEntity
 * @typedef {Object} AnalyticsJsApi
 * @property {GlobalAnalytics} analytics Dashly API push function.
 */

/**
 * @typedef {Object} GlobalAnalytics
 * @prop {Function} load Connect to analytics remote API.
 * @prop {Function} track Track custom events in analytics.
 * @prop {Function} page Trigger page change event.
 * @prop {Function} identify Trigger identify event.
 */

/**
 * Dashly API function to track custom events.
 *
 * @returns {AnalyticsJsApi} GTM push hook object.
 */
const analyticsJsApi = () => {
  /**
   * @type {GlobalAnalytics}
   */
  let analytics = null;

  // @ts-ignore
  if (typeof window !== "undefined" && window.dashly && process.env.NODE_ENV === "production") {
    // @ts-ignore
    analytics = window.dashly;
    analytics.load("0HvrNP6DRGdxvlOoKFzUwAXyKobYH3oA");
    analytics.page();
  }

  return { analytics: analytics };
};

export default analyticsJsApi;

/**
 * Trigger login/signup events for dashly.
 *
 * @param {UserEntity} userData User Entity.
 * @param {'login'|'signup'} type Type of event to trigger .
 * @returns {void} None.
 */
export const analyticsTrigger = (userData, type) => {
  const { analytics } = analyticsJsApi();
  const eventToTrigger = type === "login" ? "login" : "signup";

  if (analytics) {
    analytics.track(eventToTrigger);

    analytics.identify(userData.userId, {
      email: userData.email,
    });
  }
};

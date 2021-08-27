import Analytics from "analytics";
// @ts-ignore
import segmentPlugin from "@analytics/segment";

/**
 * @typedef {import("../services/tradeApiClient.types").UserEntity} UserEntity
 * @typedef {Object} AnalyticsJsApi
 * @property {GlobalAnalytics} analytics Analytics API push function.
 */

/**
 * @typedef {Object} GlobalAnalytics
 * @prop {Function} load
 * @prop {Function} track
 * @prop {Function} page
 * @prop {Function} identify
 * @prop {Function} use
 * @prop {Function} initialize
 */

/**
 * Analytics API function to track custom events.
 *
 * @returns {AnalyticsJsApi} Analytics api hook object.
 */
const analyticsJsApi = () => {
  /**
   * @type {GlobalAnalytics}
   */
  let analytics = null;

  // @ts-ignore
  if (process.env.GATSBY_ENABLE_TRACKING && !window.Cypress) {
    // @ts-ignore
    analytics = Analytics({
      app: "zignaly",
      plugins: [
        segmentPlugin({
          writeKey: "0HvrNP6DRGdxvlOoKFzUwAXyKobYH3oA",
        }),
      ],
    });
  }

  return { analytics: analytics };
};

export default analyticsJsApi;

/**
 * Triger path change event.
 *
 * @param {string} userId userId
 * @returns {void} None.
 */
export const analyticsPageView = (userId) => {
  const { analytics } = analyticsJsApi();

  if (analytics) {
    analytics.page(userId);
  }
};

/**
 * Trigger login/signup events for dashly.
 *
 * @param {UserEntity} userData User Entity.
 * @param {String} eventType User Entity.
 * @returns {void} None.
 */
export const analyticsTrigger = (userData, eventType) => {
  const { analytics } = analyticsJsApi();

  if (analytics) {
    if (eventType === "signup") {
      analytics.track("newUser", {
        userId: userData.userId,
      });
    }

    analytics.identify(userData.userId, {
      email: userData.email,
    });
  }
};

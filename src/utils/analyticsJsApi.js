import Analytics from "@segment/analytics.js-core/build/analytics";
// @ts-ignore
import SegmentIntegration from "@segment/analytics.js-integration-segmentio";

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

  if (process.env.NODE_ENV === "production") {
    // @ts-ignore
    analytics = new Analytics();
    analytics.use(SegmentIntegration);
    const integrationSettings = {
      "Segment.io": {
        apiKey: "0HvrNP6DRGdxvlOoKFzUwAXyKobYH3oA",
        retryQueue: true,
        addBundledMetadata: true,
      },
    };
    analytics.initialize(integrationSettings);
    analytics.page();
  }

  return { analytics: analytics };
};

export default analyticsJsApi;

/**
 * Triger path change event.
 *
 * @param {string} path Path of current page
 * @returns {void} None.
 */
export const analyticsPageView = (path) => {
  const { analytics } = analyticsJsApi();

  if (analytics) {
    analytics.page({ url: path });
  }
};

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

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
  if (process.env.GATSBY_ENABLE_TRACKING === "true" && !window.Cypress) {
    // @ts-ignore
    analytics = Analytics({
      app: "zignaly",
      plugins: [
        segmentPlugin({
          writeKey: "0HvrNP6DRGdxvlOoKFzUwAXyKobYH3oA",
          // v2 is better?
          customScriptSrc:
            "https://segment-cdn.zignaly.com/analytics.js/v1/0HvrNP6DRGdxvlOoKFzUwAXyKobYH3oA/analytics.min.js",
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

    analytics.identify(
      userData.userId,
      {
        email: userData.email,
      },
      {
        integrations: {
          Intercom: {
            user_hash: userData.intercomHash,
          },
        },
      },
    );

    _cio?.identify({ email: userData.email, id: userData.userId, name: userData.firstName });
    console.log(_cio?.identify);
  }
};

export const trackConversion = () => {
  if (process.env.GATSBY_ENABLE_TRACKING !== "true") return;

  const img = document.createElement("img");
  img.src =
    "https://cnv.event.prod.bidr.io/log/cnv?tag_id=88&buzz_key=askpermission&value=&segment_key=askpermission-142&account_id=2&order=&ord=" +
    Math.random();
  img.height = 0;
  img.width = 0;
  document.body.append(img);
};

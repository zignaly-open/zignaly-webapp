import { noop } from "lodash";

/**
 * @typedef {Object} GtmPushApi
 * @property {Function} gtmEventPush GTM API push function.
 */

/**
 * GTM push API function to track custom events.
 *
 * Note that GTM is disabled in local and push function is not available in
 * order to prevent that testing actions pollute the production data. In order
 * to enable during development enable includeInDevelopment flag at
 * gatsby-plugin-google-tagmanager gatsby-config.js
 *
 * @returns {GtmPushApi} GTM push hook object.
 */
const gtmPushApi = () => {
  /**
   * @type {Function}
   */
  let dataLayerPush = noop;

  let dataLayer = null;

  // Check that GTM is loaded and available for usage.
  // @ts-ignore
  if (typeof window !== "undefined" && window.dataLayer) {
    // @ts-ignore
    dataLayerPush = window.dataLayer.push;
    // @ts-ignore
    dataLayer = window.dataLayer;
  }

  // @ts-ignore
  return { gtmEventPush: dataLayerPush, gtmEvent: dataLayer };
};

export default gtmPushApi;

/**
 * @typedef {Object} GtmPushApi
 * @property {Array<*>} gtmEvent GTM API push function.
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
  let dataLayer = null;

  // Check that GTM is loaded and available for usage.
  // @ts-ignore
  if (typeof window !== "undefined" && window.dataLayer) {
    // @ts-ignore
    dataLayer = window.dataLayer;
  }

  return { gtmEvent: dataLayer };
};

export default gtmPushApi;

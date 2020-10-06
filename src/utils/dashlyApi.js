/**
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

import { store } from "../store/store.js";

/**
 * @typedef {Object} tzData
 * @property {string} action
 * @property {string} [urlReferer]
 * @property {string} [urlDestination]
 * @property {string} [userId]
 * @property {string} [tzid]
 */

/**
 * Send tz action.
 * @param {tzData} data data
 * @returns {Promise<*>} response
 */
const sendTz = (data) => {
  const options = {
    method: "POST",
    body: JSON.stringify(data),
  };

  return fetch(process.env.GATSBY_TRADEAPI_URL + "/fe/tz.php", options);
};

/**
 * Trigger internal tracking event.
 * @param {Location} location New location
 * @param {Location} prevLocation Previous location
 * @returns {Promise<void>} Promise
 */
export const triggerTz = async (location, prevLocation) => {
  const state = store.getState();
  // @ts-ignore
  const { isAdmin, userId } = state.user.userData;
  if (isAdmin || process.env.NODE_ENV !== "production") return;

  const data = {
    action: "sData",
    urlReferer: prevLocation ? prevLocation.href : document.referrer,
    urlDestination: location.href,
    userId,
    tzid: localStorage.getItem("tzid"),
  };

  if (!data.tzid) {
    // get tzid
    sendTz({
      action: "gTid",
    })
      .then((response) => response.json())
      .then((response) => {
        if (!response.error) {
          data.tzid = response;
          localStorage.setItem("tzid", response);
          sendTz(data);
        }
      });
  } else {
    sendTz(data);
  }
};

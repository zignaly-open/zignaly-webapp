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
    headers: {
      "Content-Type": "application/json",
    },
  };

  return fetch(process.env.GATSBY_TRADEAPI_URL + "/fe/tz.php", options);
};

/**
 * Trigger internal tracking event.
 * @param {Location} location New location
 * @param {String} prevLocation Previous location href
 * @param {import("./tradeApiClient.types.js").UserEntity} userData
 * @returns {Promise<void>} Promise
 */
export const triggerTz = async (location, prevLocation, userData) => {
  // Root page will be redirected
  if (location.pathname === "/") return;
  if (userData.isAdmin || process.env.GATSBY_ENABLE_TRACKING !== "true") return;

  const data = {
    action: "sData",
    urlReferer: prevLocation || document.referrer,
    urlDestination: location.href,
    userId: userData.userId,
    tid: localStorage.getItem("tid"),
  };

  if (!data.tid) {
    // get tid
    sendTz({
      action: "gTid",
    }).then(async (response) => {
      const json = await response.json();
      if (!response.ok) {
        const customError = json.error || json;
        throw customError;
      }
      data.tid = json;
      localStorage.setItem("tid", json);
      sendTz(data);
    });
  } else {
    sendTz(data);
  }
};

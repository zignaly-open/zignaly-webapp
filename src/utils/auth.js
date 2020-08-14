/**
 * @typedef {import('../store/initialState').DefaultSessionData} DefaultSessionData
 */
/**
 * @param {number} milliseconds Expiration date
 * @returns {boolean} Returns if still valid.
 */
const isExpirationValid = (milliseconds) => {
  let currentTime = new Date().getTime();
  return currentTime < milliseconds;
};

/**
 * @param {string} token Token
 * @param {DefaultSessionData} sessionData Session data
 * @returns {boolean} Returns if the session is valid.
 */
export const verifySessionData = (token, sessionData) => {
  return (
    token && sessionData && sessionData.validUntil && isExpirationValid(sessionData.validUntil)
  );
};

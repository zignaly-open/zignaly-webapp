/**
 * Convert seconds to millseconds.
 *
 * @param {number} seconds Seconds to convert.
 *
 * @returns {number} Milliseconds.
 */
export const secToMillisec = (seconds) => seconds * 1000;

/**
 * Convert minutes to seconds.
 *
 * @param {number} minutes Minutes to convert.
 *
 * @returns {number} Seconds.
 */
export const minToSeconds = (minutes) => minutes * 60;

/**
 * Convert minutes to milliseconds.
 *
 * @param {number} minutes Minutes to convert.
 *
 * @returns {number} Milliseconds.
 */
export const minToMillisec = (minutes) => minutes * 60 * 1000;

/**
 * Convert Trading View resolution to milliseconds.
 *
 * @param {string} resolution Trading View resolution (1, 30, D, W, etc)
 *
 * @returns {number} Milliseconds.
 */
export const resolutionToMilliseconds = (resolution) => {
  const minutes = {
    D: 1440,
    W: 10080,
  };
  let e = parseInt(resolution);
  // @ts-ignore
  if (isNaN(e)) e = minutes[resolution];

  return minToMillisec(e);
};

/**
 * Convert hours to seconds.
 *
 * @param {number} hours Seconds to convert.
 *
 * @returns {number} Seconds.
 */
export const hourToSeconds = (hours) => hours * 3600;

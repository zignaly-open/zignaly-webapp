import moment from "moment";

/**
 * Format string to float with 2 decimals.
 *
 * @param {string} val Value to format
 * @returns {string} Value formatted
 */
export const formatFloat2Dec = (val) => parseFloat(val).toFixed(2);

/**
 * Format string to float with the best number of decimals.
 *
 * @param {string} val Value to format
 * @returns {string} Value formatted
 */
export const formatFloat = (val) => {
  const valueFloat = parseFloat(val);
  return valueFloat >= 1 || valueFloat <= -1 ? valueFloat.toFixed(2) : valueFloat.toFixed(8);
};

/**
 * Format number of seconds into humanized string.
 *
 * @param {string} val Value to format
 * @returns {string} Value formatted
 */
export const formatTime = (val) => moment.duration(parseInt(val, 10), "second").humanize();

/**
 * Format string to camelCase
 * Ex: avgI1w_higherPricePercentage -> avgI1wHigherPricePercentage
 *
 * @param {string} text String to format
 * @returns {string} String formatted
 */
export const toCamelCase = (text) => {
  text = text.replace(/[-_\s.]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ""));
  return text.substr(0, 1).toLowerCase() + text.substr(1);
};

/**
 * Format object keys to camelCase
 *
 * @param {Object} obj Object to format
 * @returns {Object} Object formatted
 */
export const toCamelCaseKeys = (obj) => {
  return Object.entries(obj).reduce(
    (result, [key, value]) => ({
      ...result,
      [toCamelCase(key)]: value,
    }),
    {},
  );
};

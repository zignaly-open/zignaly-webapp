import moment from "moment";
import _ from "lodash";

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
 * Format object keys to camelCase
 *
 * @param {Object} obj Object to format
 * @returns {Object} Object formatter
 */
export const toCamelCase = (obj) => {
  return _.reduce(
    obj,
    (result, value, key) => {
      return { ...result, [_.camelCase(key)]: value };
    },
    {},
  );
};

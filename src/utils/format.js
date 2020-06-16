import moment from "moment";
import { capitalize, isNil } from "lodash";

/**
 * Format string to float with 2 decimals.
 *
 * @param {string|number} val Value to format
 * @returns {string} Value formatted
 */
export const formatFloat2Dec = (val) => {
  const valueFloat = typeof val === "string" ? parseFloat(val) : val;
  if (isNil(valueFloat)) {
    return "-";
  }
  return (Math.round(valueFloat * 100) / 100).toString();
};

/**
 * Format string to float with the best number of decimals.
 *
 * @param {string|number} val Value to format
 * @returns {string} Value formatted
 */
export const formatFloat = (val) => {
  const valueFloat = typeof val === "string" ? parseFloat(val) : val;
  if (isNil(valueFloat)) {
    return "-";
  }
  return valueFloat >= 1 || valueFloat <= -1 ? valueFloat.toFixed(2) : valueFloat.toFixed(8);
};

/**
 * Format number of seconds into humanized string.
 *
 * @param {string} val Value to format
 * @returns {string} Value formatted
 */
export const formatTime = (val) =>
  capitalize(moment.duration(parseInt(val, 10), "second").humanize());

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

/**
 * Function to format a number according to unit places.
 *
 * @param {Number} value Number to format.
 * @returns {String} Returns formatted unit value string.
 */
export const formatCurrency = (value) => {
  /**
   * Function to get unit places of a number.
   *
   * @param {Number} n Number to ghet unit places.
   * @returns {Number} Unit places of the number.
   */
  function log10(n) {
    return Math.round((100 * Math.log(n)) / Math.log(10)) / 100;
  }

  switch (Math.round(log10(value))) {
    case 1:
      return `${value}`;
    case 2:
      return `${value}`;
    case 3:
      return `${(value / 1000).toFixed(1)} Thousand`;
    case 4:
      return `${(value / 1000).toFixed(1)} Thousand`;
    case 5:
      return `${(value / 100000).toFixed(1)} Thousand`;
    case 6:
      return `${(value / 1000000).toFixed(1)} Million`;
    case 7:
      return `${(value / 1000000).toFixed(1)}. Million`;
    case 8:
      return `${(value / 1000000).toFixed(1)} Million`;
    case 9:
      return `${(value / 1000000).toFixed(1)} Million`;
    case 10:
      return `${(value / 1000000).toFixed(1)} Million`;
    default:
      return "";
  }
};

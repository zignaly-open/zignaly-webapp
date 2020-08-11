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
  return valueFloat >= 1 || valueFloat <= -1
    ? valueFloat.toFixed(2).toLocaleString()
    : valueFloat.toFixed(8).toLocaleString();
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
  const numberLength = Math.round(log10(value));
  switch (numberLength) {
    case 1:
      return `${formatFloat2Dec(value)}`;
    case 2:
      return `${formatFloat2Dec(value)}`;
    case 3:
      return `${formatFloat2Dec(value)}`;
    case 4:
      return `${formatFloat2Dec(value)}`;
    case 5:
      return `${formatFloat2Dec(value)}`;
    case 6:
      return `${formatFloat2Dec(value / 1000000)} Million`;
    case 7:
      return `${formatFloat2Dec(value / 1000000)}. Million`;
    case 8:
      return `${formatFloat2Dec(value / 1000000)} Million`;
    case 9:
      return `${formatFloat2Dec(value / 1000000)} Million`;
    case 10:
      return `${formatFloat2Dec(value / 1000000)} Million`;
    default:
      return "";
  }
};

/**
 * Function to format seconds to readable duration
 *
 * @param {Number} time Time received in seconds format.
 * @returns {String} Formatted string.
 */
export const formatDuration = (time) => {
  let duration = moment.duration(time * 1000);
  let minutes = duration.get("minutes");
  let hours = duration.get("hours");
  let days = duration.get("days");
  let months = duration.get("months");
  let years = duration.get("years");
  let formatted = "";

  if (years > 0) {
    formatted += years + (years > 1 ? " Years " : " Year ");
    if (months > 0) {
      formatted += months + (months > 1 ? " Months " : " Month ");
    }
    return formatted;
  } else if (months > 0) {
    formatted += months + (months > 1 ? " Months " : " Month ");
    if (days > 0) {
      formatted += days + (days > 1 ? " Days " : " Day ");
    }
    return formatted;
  } else if (days > 0) {
    formatted += days + (days > 1 ? " Days " : " Day ");
    if (hours > 0) {
      formatted += hours + (hours > 1 ? " Hours " : " Hour ");
    }
    return formatted;
  } else if (hours > 0) {
    formatted += hours + (hours > 1 ? " Hours " : " Hour ");
    if (minutes > 0) {
      formatted += minutes + (minutes > 1 ? " Minutes " : " Minute ");
    }
    return formatted;
  } else if (minutes > 0) {
    return (formatted += minutes + (minutes > 1 ? " Minutes " : " Minute "));
  }

  return formatted;
};

/**
 * Format unixtime date with given Moment format rule.
 *
 * @param {Number} date Unix time.
 * @param {String} format Moment format rule.
 *
 * @returns {String} Formatted date.
 */
export const formatDate = (date, format) => {
  if (typeof date === "string") {
    date = parseFloat(date);
  }
  return moment(new Date(date)).format(format);
};

/**
 * Format date with time
 *
 * @param {Date|string} date Date.
 * @returns {string} Formatted date.
 */
export const FormatedDateTime = (date) =>
  //   <FormattedDate
  //     day="numeric"
  //     hour="numeric"
  //     minute="numeric"
  //     month="numeric"
  //     value={date}
  //     year="numeric"
  //   />
  moment(date).format("YYYY/MM/DD HH:mm");

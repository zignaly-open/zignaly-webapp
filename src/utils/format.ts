import moment from "moment";
import { capitalize } from "lodash";
import dayjs from "dayjs";
const utc = require("dayjs/plugin/utc");
dayjs.extend(utc);

/**
 * Format string to float with 2 decimals.
 *
 * @param {string|number} val Value to format
 * @returns {string} Value formatted
 */
export const formatFloat2Dec = (val) => {
  const valueFloat = typeof val === "string" ? parseFloat(val) : val;
  if (typeof valueFloat !== "number") {
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
  if (typeof valueFloat !== "number") {
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
 * @param {Number|Date} date Unix time.
 * @param {String} [format] Moment format rule.
 *
 * @returns {String} Formatted date.
 */
export const formatDate = (date, format = "YYYY/MM/DD HH:mm") => {
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

export const formatUTC = (date: string) => dayjs(date).utc().format("MMMM DD, YYYY hh:mm A UTC");

/**
 * Format number for display.
 *
 * @param {number} value Number to format.
 * @param {number} [precision=8] Decimals precision.
 *
 * @returns {string} Formatter number for display.
 */
export const formatNumber = (value, precision = 8) => {
  if (isNaN(value)) {
    return "-";
  }

  return value.toFixed(precision);
};

/**
 * Add thousands separator in string numeric value.
 *
 * @param {string} value String numeric value.
 * @param {string} [separator=" "] Thousands separator character.
 * @returns {string} String numeric value with added thousands separator chars.
 */
export const addThousandsSeparator = (value, separator = " ") => {
  return value.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, separator);
};

/**
 * Format price for display.
 *
 * Numbers greater than 1 show 2 digits precision, floats show 8 digits precision.
 *
 * @param {number} price Price to format.
 * @param {string} nanDisplay Value to display when price is NaN.
 * @param {string} thousandSeparator Character to use for thousand separator.
 *
 * @returns {string} Formatter price for display.
 */
export const formatPrice = (price, nanDisplay = "-", thousandSeparator = " ") => {
  if (isNaN(price)) {
    return nanDisplay;
  }

  let formattedPrice = price.toFixed(8);
  if (price > 1 || price < -1) {
    formattedPrice = price.toFixed(2);
  }

  if (thousandSeparator) {
    return addThousandsSeparator(formattedPrice);
  }

  return formattedPrice;
};

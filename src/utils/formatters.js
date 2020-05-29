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
 * Format price for display.
 *
 * Numbers greater than 1 show 2 digits precision, floats show 8 digits precision.
 *
 * @param {number} price Price to format.
 *
 * @returns {string} Formatter price for display.
 */
export const formatPrice = (price) => {
  if (isNaN(price)) {
    return "-";
  }

  if (price > 1) {
    return price.toFixed(2);
  }

  return price.toFixed(8);
};

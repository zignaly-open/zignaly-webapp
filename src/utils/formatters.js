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

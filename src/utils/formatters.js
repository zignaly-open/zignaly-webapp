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
 * Round number
 // https://www.jacklmoore.com/notes/rounding-in-javascript/
 *
 * @param {string|number} value Number to round.
 * @param {number} [decimals=8] Decimals precision.
 *
 * @returns {string} Rounded number as string.
 */
export const round = (value, decimals) => {
  // @ts-ignore
  const valueNumber = typeof value === "number" ? value : parseFloat(value);

  if (decimals === undefined) {
    if (valueNumber > 1 || valueNumber < -1) {
      // Default 2 decimals for numbers > 1
      decimals = 2;
    } else {
      decimals = 8;
    }
  }

  // @ts-ignore
  const roundedNumber = Number(Math.round(valueNumber + "e" + decimals) + "e-" + decimals);
  return roundedNumber.toString();
};

/**
 * Round number with 2 decimals
 *
 * @param {string|number} value Number to round.
 *
 * @returns {string} Rounded number as string.
 */
export const format2Dec = (value) => round(value, 2);

/**
 * Add thousands separator in string numeric value.
 *
 * @param {string} value String numeric value.
 * @param {string} [separator=" "] Thousands separator character.
 * @param {number} [precision=2] Fractional digits precision.
 * @param {boolean} [compact=false] Abbreviate big numbers
 * @returns {string} String numeric value with added thousands separator chars.
 */
export const addThousandsSeparator = (value, separator = " ", precision = 2, compact = false) => {
  const valueNumber = parseFloat(value);

  if (typeof valueNumber === "number") {
    let finalValue = String(
      new Intl.NumberFormat("en-US", {
        minimumFractionDigits: precision,
        maximumFractionDigits: precision,
        ...(compact && {
          notation: "compact",
          compactDisplay: "short",
        }),
      }).format(valueNumber),
    );

    return finalValue.replace(/,/g, separator);
  }

  return "";
};

/**
 * Format price for display.
 *
 * Numbers greater than 1 show 2 digits precision, floats show 8 digits precision.
 *
 * @param {number|string} price Price to format.
 * @param {string} [nanDisplay] Value to display when price is NaN.
 * @param {string} [thousandSeparator] Character to use for thousand separator.
 * @param {boolean} [compact=false] Abbreviate big numbers
 *
 * @returns {string} Formatter price for display.
 */
export const formatPrice = (price, nanDisplay = "-", thousandSeparator = " ", compact = false) => {
  const priceFloat = typeof price === "string" ? parseFloat(price) : price;
  if (isNaN(priceFloat)) {
    return nanDisplay;
  }

  let precision = 8;
  let formattedPrice = priceFloat.toFixed(precision);
  if (priceFloat > 1 || priceFloat < -1) {
    precision = 2;
  }

  return addThousandsSeparator(formattedPrice, thousandSeparator, precision, compact);
};

/**
 * Prefix link with http to avoid xss attacks
 * @param {string} url Url
 * @return {string} url
 */
export const prefixLinkForXSS = (url) => {
  if (url && !url.startsWith("http")) {
    return "https://" + url;
  }
  return url;
};

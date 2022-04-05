import l from "./config/languages";
export const languages = l;

/**
 * Function to get country code from locale.
 *
 * @param {String} locale given locale
 * @returns {String} country code value
 */
export const getLanguageCodefromLocale = (locale) => {
  const langData = l.find((item) => item.locale === locale);
  return langData.languageCode;
};

/**
 * Function to get locale from country code.
 *
 * @param {String} code given country code
 * @returns {String} locale value
 */
export const getLocaleFromLanguageCode = (code) => {
  const langData = l.find((item) => item.countryCode === code);
  return langData.locale;
};

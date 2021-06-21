const languages = require("./config/languages");

/**
 * Function to get country code from locale.
 *
 * @param {String} locale given locale
 * @returns {String} country code value
 */
const getLanguageCodefromLocale = (locale) => {
  const langData = languages.find((item) => item.locale === locale);
  return langData.languageCode;
};

/**
 * Function to get locale from country code.
 *
 * @param {String} code given country code
 * @returns {String} locale value
 */
const getLocaleFromLanguageCode = (code) => {
  const langData = languages.find((item) => item.countryCode === code);
  return langData.locale;
};

module.exports = {
  languages,
  getLanguageCodefromLocale,
  getLocaleFromLanguageCode,
};

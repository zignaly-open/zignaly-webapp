/**
 * @typedef {Object} LocalizationLanguage
 * @property {String} locale
 * @property {String} label
 * @property {String} countryCode
 * @property {Boolean=} default
 */

/**
 * @type {Array<LocalizationLanguage>} LocalizationLanguages
 */
const LocalizationLanguages = [
  {
    default: true,
    locale: "en",
    label: "English",
    countryCode: "gb",
  },
];

if (process.env.GATSBY_ENABLE_TEST_TRANSLATIONS.toLowerCase() === "true") {
  // Test localization
  LocalizationLanguages.push(
    {
      locale: "cs",
      label: "Čeština",
      countryCode: "cz",
    },
    {
      locale: "vn",
      label: "Tiếng Việt",
      countryCode: "vn",
    },
  );
}

module.exports = LocalizationLanguages;

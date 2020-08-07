/**
 * @typedef {Object} LocalizationLanguage
 * @property {String} locale
 * @property {String} label
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
  },
];

if (process.env.GATSBY_ENABLE_TEST_TRANSLATIONS) {
  // Test localization
  LocalizationLanguages.push(
    {
      locale: "vn",
      label: "Vietnamese",
    },
    {
      locale: "cs",
      label: "Čeština",
    },
  );
}

module.exports = LocalizationLanguages;

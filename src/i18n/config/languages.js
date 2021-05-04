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
  {
    locale: "de",
    label: "German",
    countryCode: "de",
  },
  {
    locale: "vn",
    label: "Tiếng Việt",
    countryCode: "vn",
  },
  {
    locale: "pl",
    label: "Polski",
    countryCode: "pl",
  },
  {
    locale: "es",
    label: "Español",
    countryCode: "es",
  },
];

if (process.env.GATSBY_ENABLE_TEST_TRANSLATIONS.toLowerCase() === "true") {
  // Test localization
  LocalizationLanguages.push({
    locale: "cs",
    label: "Čeština",
    countryCode: "cz",
  });
  LocalizationLanguages.push({
    locale: "tr",
    label: "Türkçe",
    countryCode: "tr",
  });
}

module.exports = LocalizationLanguages;

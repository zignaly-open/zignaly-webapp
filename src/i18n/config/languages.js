/**
 * @typedef {Object} LocalizationLanguage
 * @property {String} locale
 * @property {String} label
 * @property {String} countryCode
 * @property {String} languageCode
 * @property {Boolean=} default
 */

/**
 * @type {Array<LocalizationLanguage>} LocalizationLanguages
 */
const LocalizationLanguages = [
  {
    default: true,
    locale: "en_US",
    label: "English",
    countryCode: "gb",
    languageCode: "en",
  },
  {
    locale: "de_DE",
    label: "Deutsche",
    countryCode: "de",
    languageCode: "de",
  },
  {
    locale: "vi",
    label: "Tiếng Việt",
    countryCode: "vn",
    languageCode: "vn",
  },
  {
    locale: "pl",
    label: "Polskie",
    countryCode: "pl",
    languageCode: "pl",
  },
  {
    locale: "es_ES",
    label: "Español",
    countryCode: "es",
    languageCode: "es",
  },
  {
    locale: "fr_FR",
    label: "Française",
    countryCode: "fr",
    languageCode: "fr",
  },
  {
    locale: "pt_PT",
    label: "Português",
    countryCode: "pt",
    languageCode: "pt",
  },
  {
    locale: "fr",
    label: "French",
    countryCode: "fr",
  },
  {
    locale: "pt",
    label: "Portugese",
    countryCode: "pt",
  },
];

if (process.env.GATSBY_ENABLE_TEST_TRANSLATIONS.toLowerCase() === "true") {
  // Test localization
  LocalizationLanguages.push({
    locale: "cs",
    label: "Čeština",
    countryCode: "cz",
    languageCode: "cz",
  });
  LocalizationLanguages.push({
    locale: "tr",
    label: "Türkçe",
    countryCode: "tr",
    languageCode: "tr",
  });
}

module.exports = LocalizationLanguages;

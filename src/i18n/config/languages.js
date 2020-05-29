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
    locale: "cs",
    label: "Čeština",
  },
  {
    default: true,
    locale: "en",
    label: "English",
  },
];

module.exports = LocalizationLanguages;

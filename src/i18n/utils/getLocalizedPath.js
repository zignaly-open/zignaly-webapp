const languages = require("../config/languages");

/**
 * Find the default language.
 *
 * @typedef {import("../config/languages").LocalizationLanguage} LocalizationLanguage
 * @param {LocalizationLanguage} lang
 * @returns {LocalizationLanguage} Default language locale object.
 */
const defaultLanguage = languages.find((lang) => lang.default);

if (!defaultLanguage) {
  throw new Error("Default language has to be specified in the language configuration.");
}

/**
 * Get localized path for an original path.
 *
 * @param {String} originalPath Original path to find localization for.
 * @param {String} locale Locale laguage code.
 *
 * @returns {String} Localized path.
 */
const getLocalizedPath = (originalPath, locale) => {
  const keyPath = originalPath.replace(/(\w+)\/$/, "$1");
  /**
   * @type {LocalizationLanguage} selectedLanguage
   */
  const selectedLanguage = languages.find((lang) => lang.locale === locale);
  const isDefault = locale === defaultLanguage.locale;
  const localizedPath =
    selectedLanguage && selectedLanguage.routes && selectedLanguage.routes[keyPath];

  if (!localizedPath) {
    throw new Error(
      `You have to specify a translation for all of your routes.\n There is no translation for ${originalPath} in language ${locale}.`,
    );
  }
  return isDefault ? localizedPath : `/${locale}${localizedPath}`;
};

module.exports = getLocalizedPath;

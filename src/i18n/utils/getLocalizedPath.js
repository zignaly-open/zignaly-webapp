const languages = require("../config/languages");

const defaultLanguage = languages.find((lang) => lang.default);

if (!defaultLanguage) {
  throw new Error("Default language has to be specified in the language configuration.");
}

const getLocalizedPath = (originalPath, locale) => {
  const keyPath = originalPath.replace(/(\w+)\/$/, "$1");
  const selectedLanguage = languages.find((lang) => lang.locale === locale);
  const isDefault = locale === defaultLanguage.locale;
  const localizedPath = selectedLanguage && selectedLanguage.routes && selectedLanguage.routes[keyPath];

  if (!localizedPath) {
    throw new Error(
      `You have to specify a translation for all of your routes.\n There is no translation for ${originalPath} in language ${locale}.`,
    );
  }
  return isDefault ? localizedPath : `/${locale}${localizedPath}`;
};

module.exports = getLocalizedPath;

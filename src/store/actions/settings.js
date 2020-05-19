const SELECT_LANGUAGE = "SELECT_LANGUAGE_ACTION";
const SELECT_THEME = "SELECT_THEME_ACTION";

/**
 * Dark style flag selected by user.
 *
 * @param {Boolean} darkStyle
 */

export const selectDarkTheme = (darkStyle) => {
  return {
    type: SELECT_THEME,
    payload: darkStyle,
  };
};

/**
 * User's selected language.
 *
 * @param {String} langCode
 */

export const changeLanguage = (langCode) => {
  return {
    type: SELECT_LANGUAGE,
    payload: langCode,
  };
};

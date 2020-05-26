import tradeApi from "../../services/tradeApiClient";

const SELECT_LANGUAGE = "SELECT_LANGUAGE_ACTION";
const SELECT_THEME = "SELECT_THEME_ACTION";
const START_TRADE_API_SESSION = "START_TRADE_API_SESSION";

/**
 * @typedef {import("../../services/tradeApiClient.types").UserLoginPayload} UserLoginPayload
 * @typedef {import('../../store/store').AppThunk} AppThunk
 */

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

/**
 * Set user session.
 *
 * @param {UserLoginPayload} payload User login payload.
 * @returns {AppThunk} Thunk action function.
 */
export const startTradeApiSession = (payload) => {
  return async (dispatch) => {
    try {
      const responseData = await tradeApi.userLogin(payload);
      dispatch({
        type: START_TRADE_API_SESSION,
        payload: responseData,
      });
    } catch (e) {
      // TODO: Display error in alert.
    }
  };
};

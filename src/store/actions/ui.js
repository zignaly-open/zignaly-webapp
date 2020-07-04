export const OPEN_EXCHANGE_CONNECTION_VIEW = "OPEN_EXCHANGE_CONNECTION_VIEW_ACTION";
export const OPEN_SSETTINGS_VIEW = "OPEN_SETTINGS_VIEW_ACTION";
export const SHOW_LOADER = "SHOW_LOADER_ACTION";
export const SHOW_ERROR_ALERT = "SHOW_ERROR_ALERT";
export const HIDE_ERROR_ALERT = "HIDE_ERROR_ALERT";
export const SHOW_SUCCESS_ALERT = "SHOW_SUCCESS_ALERT";
export const HIDE_SUCCESS_ALERT = "HIDE_SUCCESS_ALERT";
export const ASK_2FA = "ASK_2FA";

/**
 * @typedef {import('../../store/store').AppThunk} AppThunk
 * @typedef {import('redux').AnyAction} AnyAction
 */

/**
 * Flag to open user cexchange connecgions view.
 *
 * @param {Boolean} flag
 */

export const openExchangeConnectionView = (flag) => {
  return {
    type: OPEN_EXCHANGE_CONNECTION_VIEW,
    payload: flag,
  };
};

/**
 * Flag to open user settings view.
 *
 * @param {Boolean} flag
 */

export const openSettingsView = (flag) => {
  return {
    type: OPEN_SSETTINGS_VIEW,
    payload: flag,
  };
};

/**
 * Flag to open user settings view.
 *
 * @param {Boolean} flag
 */

export const showLoader = (flag) => {
  return {
    type: SHOW_LOADER,
    payload: flag,
  };
};

/**
 * Action to show error alert.
 *
 * @param {*} error Error object from the backend
 * @returns {AnyAction} Action object.
 */
export const showErrorAlert = (error) => {
  return {
    type: SHOW_ERROR_ALERT,
    payload: {
      title: "error.occured",
      body: error && error.code ? `error.${error.code}` : "error.noidea",
    },
  };
};

/**
 * Action to hide error alert.
 *
 * @returns {AnyAction} Action object.
 */
export const hideErrorAlert = () => {
  return {
    type: HIDE_ERROR_ALERT,
  };
};

/**
 * Action to show success alert.
 *
 * @param {string} title Alert title.
 * @param {string} body Alert body.
 * @returns {AnyAction} Action object.
 */
export const showSuccessAlert = (title, body) => {
  return {
    type: SHOW_SUCCESS_ALERT,
    payload: {
      title,
      body,
    },
  };
};

/**
 * Action to hide success alert.
 *
 * @returns {AnyAction} Action object.
 */
export const hideSuccessAlert = () => {
  return {
    type: HIDE_SUCCESS_ALERT,
  };
};

/**
 * @param {boolean} payload Flag to indicate if we should ask for 2FA code.
 * @returns {AnyAction} return action object.
 */
export const ask2FA = (payload) => {
  return {
    type: ASK_2FA,
    payload,
  };
};

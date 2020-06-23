export const OPEN_EXCHANGE_CONNECTION_VIEW = "OPEN_EXCHANGE_CONNECTION_VIEW_ACTION";
export const OPEN_SSETTINGS_VIEW = "OPEN_SETTINGS_VIEW_ACTION";
export const SHOW_LOADER = "SHOW_LOADER_ACTION";
export const SHOW_ERROR_ALERT = "SHOW_ERROR_ALERT_ACTION";
export const HIDE_ERROR_ALERT = "HIDE_ERROR_ALERT_ACTION";

/**
 *
 * @typedef {import('../../store/store').AppThunk} AppThunk
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
 * @returns {AppThunk} Action object.
 */
export const showErrorAlert = (error) => {
  return async (dispatch) => {
    let payload = {
      title: "error.occured",
      body: error && error.code ? `error.${error.code}` : "error.noidea",
      open: true,
    };
    const action = {
      type: HIDE_ERROR_ALERT,
      payload: payload,
    };

    dispatch(action);
  };
};

/**
 * Action to hide error alert.
 *
 * @returns {AppThunk} Action object.
 */
export const hideErrorAlert = () => {
  return async (dispatch) => {
    let payload = {
      title: "",
      body: "",
      open: false,
    };
    const action = {
      type: HIDE_ERROR_ALERT,
      payload: payload,
    };

    dispatch(action);
  };
};

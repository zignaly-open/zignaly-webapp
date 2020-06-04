export const OPEN_EXCHANGE_CONNECTION_VIEW = "OPEN_EXCHANGE_CONNECTION_VIEW_ACTION";
export const OPEN_SSETTINGS_VIEW = "OPEN_SETTINGS_VIEW_ACTION";

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

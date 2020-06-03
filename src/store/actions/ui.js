export const OPEN_EXCHANGE_CONNECTION_VIEW = "OPEN_EXCHANGE_CONNECTION_VIEW";

/**
 * Dark style flag selected by user.
 *
 * @param {Boolean} flag
 */

export const openExchangeConnectionView = (flag) => {
  return {
    type: OPEN_EXCHANGE_CONNECTION_VIEW,
    payload: flag,
  };
};

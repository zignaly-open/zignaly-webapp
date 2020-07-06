import { useSelector } from "react-redux";

/**
 * @typedef {import("../store/initialState").DefaultState} DefaultStateType
 */

/**
 * Select Redux store ui modal data.
 *
 * @returns {Boolean} Store ui modal state.
 */
const useStoreUIAsk2FASelector = () => {
  /**
   * Select store ui modal data.
   *
   * @param {DefaultStateType} state Application store data.
   * @returns {Boolean} Store ui modal data.
   */
  const selectStoreUIAsk2FA = (state) => state.ui.ask2FA;

  return useSelector(selectStoreUIAsk2FA);
};

export default useStoreUIAsk2FASelector;

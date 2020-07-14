import { useSelector } from "react-redux";

/**
 * @typedef {import("../store/initialState").DefaultState} DefaultStateType
 * @typedef {import("../store/initialState").DefaultUIObject} DefaultUIObject
 */

/**
 * Select Redux store ui modal data.
 *
 * @returns {Boolean} Store ui modal state.
 */
const useStoreUIBalanceLoader = () => {
  /**
   * Select store ui modal data.
   *
   * @param {DefaultStateType} state Application store data.
   * @returns {Boolean} Store ui modal data.
   */
  const selectStoreUILoader = (state) => state.ui.balanceLoader;

  return useSelector(selectStoreUILoader);
};

export default useStoreUIBalanceLoader;

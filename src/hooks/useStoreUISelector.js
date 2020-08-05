import { useSelector } from "react-redux";

/**
 * @typedef {import("../store/initialState").DefaultState} DefaultStateType
 * @typedef {import("../store/initialState").DefaultUIObject} DefaultUIObject
 */

/**
 * Select Redux store ui data.
 *
 * @returns {DefaultUIObject} Store ui state.
 */
const useStoreUISelector = () => {
  /**
   * Select store ui data.
   *
   * @param {DefaultStateType} state Application store data.
   * @returns {DefaultUIObject} Store ui data.
   */
  const selectStoreUI = (state) => state.ui;

  return useSelector(selectStoreUI);
};

export default useStoreUISelector;

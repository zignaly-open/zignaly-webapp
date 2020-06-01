import { useSelector } from "react-redux";

/**
 * @typedef {import("../store/initialState").DefaultState} DefaultStateType
 * @typedef {import("../store/initialState").DefaultUIModalObject} DefaultUIModalObject
 */

/**
 * Select Redux store ui modal data.
 *
 * @returns {DefaultUIModalObject} Store ui modal state.
 */
const useStoreUIModalSelector = () => {
  /**
   * Select store ui modal data.
   *
   * @param {DefaultStateType} state Application store data.
   * @returns {DefaultUIModalObject} Store ui modal data.
   */
  const selectStoreUIModal = (state) => state.ui.modal;

  return useSelector(selectStoreUIModal);
};

export default useStoreUIModalSelector;

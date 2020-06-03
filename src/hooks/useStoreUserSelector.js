import { useSelector } from "react-redux";

/**
 * @typedef {import("../store/initialState").DefaultState} DefaultStateType
 * @typedef {import("../store/initialState").UserObject} UserObject
 */

/**
 * Select Redux store session data.
 *
 * @returns {UserObject} Store session state.
 */
const useStoreUserSelector = () => {
  /**
   * Select store session data.
   *
   * @param {DefaultStateType} state Application store data.
   * @returns {UserObject} Store session data.
   */
  const selectStoreSettings = (state) => state.user;

  return useSelector(selectStoreSettings);
};

export default useStoreUserSelector;

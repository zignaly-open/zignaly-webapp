import { useSelector } from "react-redux";

/**
 * @typedef {import("../store/initialState").DefaultState} DefaultStateType
 * @typedef {import("../store/initialState").DefaultViewsObject} DefaultViewsObject
 */

/**
 * Select Redux store session data.
 *
 * @returns {DefaultViewsObject} Store session state.
 */
const useStoreViewsSelector = () => {
  /**
   * Select store session data.
   *
   * @param {DefaultStateType} state Application store data.
   * @returns {DefaultViewsObject} Store session data.
   */
  const selectStoreSettings = (state) => state.views;

  return useSelector(selectStoreSettings);
};

export default useStoreViewsSelector;

import { useSelector } from "react-redux";

/**
 * @typedef {import("../store/initialState").DefaultState} DefaultStateType
 * @typedef {import("../store/initialState").DefaultViewsObject} DefaultViewsObject
 */

/**
 * Select Redux store views data.
 *
 * @returns {DefaultViewsObject} Views object from redux store.
 */
const useStoreViewsSelector = () => {
  /**
   * Select store views data.
   *
   * @param {DefaultStateType} state Application store data.
   * @returns {DefaultViewsObject} Store views data.
   */
  const selectStoreViews = (state) => state.views;

  return useSelector(selectStoreViews);
};

export default useStoreViewsSelector;

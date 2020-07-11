import { useSelector } from "react-redux";

/**
 * @typedef {import("../store/initialState").DefaultState} DefaultStateType
 * @typedef {import("../store/initialState").TimeframeObject}
 */

/**
 * Select Redux store ui modal data.
 *
 * @returns {import("../store/initialState").TimeframeObject} Store ui timeframe state.
 */
const useStoreUITimeframeSelector = () => {
  /**
   * Select store ui timeframe data.
   *
   * @param {DefaultStateType} state Application store data.
   * @returns {import("../store/initialState").TimeframeObject} Store ui timeframe data.
   */
  const selectStoreUIModal = (state) => state.ui.timeFrame;

  return useSelector(selectStoreUIModal);
};

export default useStoreUITimeframeSelector;

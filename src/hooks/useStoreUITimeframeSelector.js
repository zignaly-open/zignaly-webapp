import { useSelector } from "react-redux";

/**
 * @typedef {import("../store/initialState").DefaultState} DefaultStateType
 * @typedef {import("../store/initialState").TimeframeObject} TimeframeObject
 */

/**
 * Select Redux store ui modal data.
 *
 * @returns {TimeframeObject} Store ui timeframe state.
 */
const useStoreUITimeframeSelector = () => {
  /**
   * Select store ui timeframe data.
   *
   * @param {DefaultStateType} state Application store data.
   * @returns {TimeframeObject} Store ui timeframe data.
   */
  const selectStoreUIModal = (state) => state.ui.timeFrame;

  return useSelector(selectStoreUIModal);
};

export default useStoreUITimeframeSelector;

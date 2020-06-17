import { useSelector } from "react-redux";

/**
 * @typedef {import("../store/initialState").DefaultState} DefaultStateType
 * @typedef {import("../store/initialState").DefaultUIAlertsObject} DefaultUIAlertsObject
 */

/**
 * Select Redux store ui alerts data.
 *
 * @returns {DefaultUIAlertsObject} Store ui alerts state.
 */
const useStoreUIAlertsSelector = () => {
  /**
   * Select store ui alerts data.
   *
   * @param {DefaultStateType} state Application store data.
   * @returns {DefaultUIAlertsObject} Store ui alerts data.
   */
  const selectStoreUIAlerts = (state) => state.ui.alerts;

  return useSelector(selectStoreUIAlerts);
};

export default useStoreUIAlertsSelector;

import { useSelector } from "react-redux";

/**
 * @typedef {import("../store/initialState").DefaultState} DefaultStateType
 * @typedef {import("../store/initialState").DefaultStateSettings} StateSettingsType
 */

/**
 * Select Redux store session data.
 *
 * @returns {StateSettingsType} Store session state.
 */
const useStoreSettingsSelector = () => {
  /**
   * Select store session data.
   *
   * @param {DefaultStateType} state Application store data.
   * @returns {StateSettingsType} Store session data.
   */
  const selectStoreSettings = (state) => state.settings;

  return useSelector(selectStoreSettings);
};

export default useStoreSettingsSelector;

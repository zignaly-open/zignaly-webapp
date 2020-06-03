import { useSelector } from "react-redux";

/**
 * @typedef {import("../store/initialState").DefaultState} DefaultStateType
 * @typedef {import("../store/initialState").DefaultStateSession} StateSessionType
 */

/**
 * Select Redux store session data.
 *
 * @returns {StateSessionType} Store session state.
 */
const useStoreSessionSelector = () => {
  /**
   * Select store session data.
   *
   * @param {DefaultStateType} state Application store data.
   * @returns {StateSessionType} Store session data.
   */
  const selectStoreSession = (state) => state.session;

  return useSelector(selectStoreSession);
};

export default useStoreSessionSelector;

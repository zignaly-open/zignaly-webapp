import { useSelector, shallowEqual } from "react-redux";

/**
 * @typedef {import("../store/initialState").DefaultState} DefaultStateType
 * @typedef {import("../store/initialState").UserObject} UserObject
 * @typedef {UserObject["balance"]} UserExchangeBalance
 * @typedef {UserObject["dailyBalance"]} UserExchangeDailyBalance
 * @typedef {UserObject["userData"]} UserEntity
 * @typedef {UserEntity["exchanges"]} UserExchangeConnections
 *
 */

/**
 * Select Redux store user data.
 *
 * @returns {UserObject} Store session state.
 */
const useStoreUserSelector = () => {
  /**
   * Select store session data.
   *
   * @param {DefaultStateType} state Application store data.
   * @returns {UserObject} All user state.
   */
  const selector = (state) => state.user;

  return useSelector(selector, shallowEqual);
};

/**
 * Select Redux store user exchange connections.
 *
 * @returns {UserExchangeConnections} User exchange connections.
 */
const useStoreUserExchangeConnections = () => {
  /**
   * Select store session data.
   *
   * @param {DefaultStateType} state Application store data.
   * @returns {UserExchangeConnections} User exchange conections.
   */
  const selector = (state) => state.user.userData.exchanges;

  return useSelector(selector, shallowEqual);
};

/**
 * Select Redux store user exchange balance.
 *
 * @returns {UserExchangeBalance} User exchange balance.
 */
const useStoreUserBalance = () => {
  /**
   * Select store user balance.
   *
   * @param {DefaultStateType} state Application store data.
   * @returns {UserExchangeBalance} User exchange balance.
   */
  const selector = (state) => state.user.balance;

  return useSelector(selector, shallowEqual);
};

/**
 * Select Redux store user exchange daily balance.
 *
 * @returns {UserExchangeDailyBalance} User exchange daily balance.
 */
const useStoreUserDailyBalance = () => {
  /**
   * Select store user daily balance.
   *
   * @param {DefaultStateType} state Application store data.
   * @returns {UserExchangeDailyBalance} User exchange daily balance.
   */
  const selector = (state) => state.user.dailyBalance;

  return useSelector(selector, shallowEqual);
};

/**
 * Select Redux store user exchange daily balance.
 *
 * @returns {UserEntity} User exchange daily balance.
 */
const useStoreUserData = () => {
  /**
   * Select store user data.
   *
   * @param {DefaultStateType} state Application store data.
   * @returns {UserEntity} User profile data.
   */
  const selector = (state) => state.user.userData;

  return useSelector(selector, shallowEqual);
};

export {
  useStoreUserBalance,
  useStoreUserDailyBalance,
  useStoreUserExchangeConnections,
  useStoreUserSelector,
  useStoreUserData,
};

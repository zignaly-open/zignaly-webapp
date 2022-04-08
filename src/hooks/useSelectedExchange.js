import { useSelector } from "react-redux";
import { useStoreUserExchangeConnections } from "hooks/useStoreUserSelector";
/**
 * @typedef {import("../store/initialState").DefaultState} DefaultStateType
 * @typedef {import("../store/initialState").ExchangeConnectionEntity} ExchangeConnectionEntity
 */

/**
 * Select Redux store session data.
 *
 * @returns {ExchangeConnectionEntity} Exchange
 */
const useStoreSettingsSelector = () => {
  const exchangeConnections = useStoreUserExchangeConnections();

  /**
   * Select store session data.
   *
   * @param {DefaultStateType} state Application store data.
   * @returns {ExchangeConnectionEntity} Exchange
   */
  const selectStoreSettings = (state) => {
    const { selectedExchangeId } = state.settings;
    return exchangeConnections.find((c) => c.internalId === selectedExchangeId);
  };

  return useSelector(selectStoreSettings);
};

export default useStoreSettingsSelector;

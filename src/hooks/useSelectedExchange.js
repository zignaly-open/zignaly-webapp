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
    return (
      exchangeConnections.find((c) => c.internalId === selectedExchangeId) || {
        id: "",
        name: "",
        exchangeId: "",
        exchangeName: "",
        internalId: "",
        internalName: "",
        key: false,
        secret: false,
        areKeysValid: false,
        paperTrading: false,
        exchangeType: "",
        isTestnet: false,
        disable: false,
        positionSize: 0,
        managed: false,
        internal: false,
        isBrokerAccount: false,
        subAccountId: "",
        binanceBrokerId: "",
        checkAuthCount: 0,
        globalDelisting: false,
        globalBlacklist: false,
        globalMaxPositions: false,
        globalMinVolume: false,
        globalPositionsPerMarket: false,
        globalWhitelist: false,
        balanceSynced: false,
        activated: false,
      }
    );
  };

  return useSelector(selectStoreSettings);
};

export default useStoreSettingsSelector;

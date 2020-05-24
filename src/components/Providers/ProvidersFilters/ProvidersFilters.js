import React, { useState, useEffect, useCallback } from "react";
import CustomFilters from "../../CustomFilters";
import CustomSelect from "../../CustomSelect";

/**
 * @typedef {Object} ProvidersFiltersPropTypes
 * @property {function} onChange Callback that delegate filters changes to caller.
 * @property {function} onClose Callback that delegate filters toggle state to caller.
 */

/**
 * Provides filters for filtering providers.
 *
 * @param {ProvidersFiltersPropTypes} props Component properties.
 * @returns {JSX.Element} Component JSX.
 */
const ProvidersFilters = ({ onChange, onClose }) => {
  const coins = ["BTC", "USDT"];
  const exchanges = ["Binance", "KuCoin"];

  const [coin, setCoin] = useState("");
  const [exchange, setExchange] = useState("");

  const clearFilters = () => {
    setCoin("");
    setExchange("");
  };

  // Memoized callback to satisfy exhaustive-deps
  const triggerChange = useCallback((...args) => {
    onChange(...args);
  }, []);

  useEffect(() => {
    triggerChange(coin, exchange);
  }, [coin, exchange, triggerChange]);

  return (
    <CustomFilters onClear={clearFilters} onClose={onClose} title="Filters">
      <CustomSelect label="Coin" onChange={setCoin} options={coins} value={coin} />
      <CustomSelect label="Exchange" onChange={setExchange} options={exchanges} value={exchange} />
    </CustomFilters>
  );
};

export default ProvidersFilters;

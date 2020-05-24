import React, { useState, useEffect } from "react";
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
  const coins = [
    { label: "BTC", val: "BTC" },
    { label: "USDT", val: "USDT" },
  ];
  const exchanges = [
    { label: "Binance", val: "BINANCE" },
    { label: "KuCoin", val: "KUCOIN" },
  ];

  const [coin, setCoin] = useState(coins[0].val);
  const [exchange, setExchange] = useState(exchanges[0].val);

  const clearFilters = () => {
    setCoin("");
    setExchange("");
  };

  useEffect(() => {
    onChange(coin, exchange);
  }, [coin, exchange, onChange]);

  return (
    <CustomFilters onClear={clearFilters} onClose={onClose} title="Filters">
      <CustomSelect label="Coin" onChange={setCoin} options={coins} value={coin} />
      <CustomSelect label="Exchange" onChange={setExchange} options={exchanges} value={exchange} />
    </CustomFilters>
  );
};

export default ProvidersFilters;

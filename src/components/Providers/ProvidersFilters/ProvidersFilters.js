import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
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

  const [coin, setCoin] = useState(coins[0]);
  const [exchange, setExchange] = useState(exchanges[0]);

  const clearFilters = () => {
    setCoin("");
    setExchange("");
  };

  useEffect(() => {
    if (onChange) {
      onChange(coin, exchange);
    }
  }, [coin, exchange]);

  return (
    <CustomFilters onClear={clearFilters} onClose={onClose} title="Filters">
      <CustomSelect label="Coin" onChange={setCoin} options={coins} value={coin} />
      <CustomSelect label="Exchange" onChange={setExchange} options={exchanges} value={exchange} />
    </CustomFilters>
  );
};

ProvidersFilters.propTypes = {
  onChange: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ProvidersFilters;

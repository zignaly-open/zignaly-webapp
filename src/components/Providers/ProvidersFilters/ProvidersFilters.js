import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import CustomFilters from "../../CustomFilters";
import CustomSelect from "../../CustomSelect";

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
      <CustomSelect label="Exchange" onChange={setExchange} options={exchanges} value={exchanges} />
    </CustomFilters>
  );
};

ProvidersFilters.propTypes = {
  onChange: PropTypes.func,
  onClose: PropTypes.func,
};

export default ProvidersFilters;

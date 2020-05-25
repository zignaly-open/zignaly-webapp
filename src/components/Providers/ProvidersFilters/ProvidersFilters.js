import React, { useState, useEffect, useCallback } from "react";
import CustomFilters from "../../CustomFilters";
import CustomSelect from "../../CustomSelect";

/**
 * @typedef {Object} ProvidersFiltersPropTypes
 * @property {function} onClose Callback that delegate filters toggle state to caller.
 * @property {function} clearFilters Callback that delegate filters clearing to caller.
 * @property {function} onCoinChange Callback that delegate coin change to caller.
 * @property {function} onExchangeChange Callback that delegate exchange change to caller.
 * @property {string} coin Selected coin.
 * @property {string} exchange Selected exchange.
 *
 */

/**
 * Provides filters for filtering providers.
 *
 * @param {ProvidersFiltersPropTypes} props Component properties.
 * @returns {JSX.Element} Component JSX.
 */
const ProvidersFilters = ({
  onClose,
  coin,
  exchange,
  onCoinChange,
  onExchangeChange,
  clearFilters,
}) => {
  const coins = ["BTC", "USDT"];
  const exchanges = ["Binance", "KuCoin"];

  return (
    <CustomFilters onClear={clearFilters} onClose={onClose} title="Filters">
      <CustomSelect label="Coin" onChange={onCoinChange} options={coins} value={coin} />
      <CustomSelect
        label="Exchange"
        onChange={onExchangeChange}
        options={exchanges}
        value={exchange}
      />
    </CustomFilters>
  );
};

export default ProvidersFilters;

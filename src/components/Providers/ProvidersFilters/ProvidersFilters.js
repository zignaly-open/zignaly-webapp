import React from "react";
import CustomFilters from "../../CustomFilters";
import CustomSelect from "../../CustomSelect";
import useQuoteAssets from "../../../hooks/useQuoteAssets";

/**
 * @typedef {Object} ProvidersFiltersPropTypes
 * @property {function} onClose Callback that delegate filters toggle state to caller.
 * @property {function} clearFilters Callback that delegate filters clearing to caller.
 * @property {function} onCoinChange Callback that delegate coin change to caller.
 * @property {function} onExchangeChange Callback that delegate exchange change to caller.
 * @property {string} coin Selected coin.
 * @property {string} exchange Selected exchange.
 * @property {boolean} open Flag to indicates if the filters bar is open.
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
  open,
}) => {
  const quoteAssets = useQuoteAssets();
  const coins = Object.keys(quoteAssets);
  const exchanges = ["Binance", "Zignaly", "KuCoin"];

  return open ? (
    <CustomFilters onClear={clearFilters} onClose={onClose} title="Filters">
      <CustomSelect label="Coin" onChange={onCoinChange} options={coins} value={coin} />
      <CustomSelect
        label="Exchange"
        onChange={onExchangeChange}
        options={exchanges}
        value={exchange}
      />
    </CustomFilters>
  ) : null;
};

export default ProvidersFilters;

import React from "react";
import CustomFilters from "../../CustomFilters";
import CustomSelect from "../../CustomSelect";
import { useIntl } from "react-intl";

/**
 * @typedef {import("../../CustomSelect/CustomSelect").OptionType} OptionType
 */

/**
 * @typedef {Object} ProvidersFiltersPropTypes
 * @property {function} onClose Callback that delegate filters toggle state to caller.
 * @property {function} clearFilters Callback that delegate filters clearing to caller.
 * @property {function} onCoinChange Callback that delegate coin change to caller.
 * @property {function} onExchangeChange Callback that delegate exchange change to caller.
 * @property {function} onExchangeTypeChange Callback that delegate exchange type change to caller.
 * @property {OptionType} coin Selected coin.
 * @property {Array<OptionType>} coins Coins options.
 * @property {string} exchange Selected exchange.
 * @property {Array<OptionType>} exchanges Exchanges options.
 * @property {string} exchangeType Selected exchange type.
 * @property {Array<OptionType>} exchangeTypes Exchange types options.
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
  coins,
  exchange,
  exchanges,
  exchangeType,
  exchangeTypes,
  onExchangeTypeChange,
  onCoinChange,
  onExchangeChange,
  clearFilters,
  open,
}) => {
  const intl = useIntl();

  return (
    <CustomFilters
      onClear={clearFilters}
      onClose={onClose}
      open={open}
      title={intl.formatMessage({
        id: "fil.filters",
      })}
    >
      <CustomSelect
        label={intl.formatMessage({
          id: "col.coin",
        })}
        onChange={onCoinChange}
        options={coins}
        search={true}
        value={coin}
      />
      <CustomSelect
        label={intl.formatMessage({
          id: "accounts.exchange",
        })}
        onChange={onExchangeChange}
        options={exchanges}
        value={exchange}
      />
      <CustomSelect
        label={intl.formatMessage({
          id: "srv.edit.exchangetype",
        })}
        onChange={onExchangeTypeChange}
        options={exchangeTypes}
        value={exchangeType}
      />
    </CustomFilters>
  );
};

export default ProvidersFilters;

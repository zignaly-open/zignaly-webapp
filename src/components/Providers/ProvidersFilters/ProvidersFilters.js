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
 * @property {string} fromUser Selected from user filters
 * @property {function} onFromUserChange Function to handle changes for user owned services select.
 * @property {Array<OptionType>} fromUserOptions Options array for user owned services select.
 * @property {boolean} copyTradersOnly
 */

/**
 * Provides filters for filtering providers.
 *
 * @param {ProvidersFiltersPropTypes} props Component properties.
 * @returns {JSX.Element} Component JSX.
 */
const ProvidersFilters = ({
  onClose,
  quotes,
  exchanges,
  exchangeTypes,
  clearFilters,
  open,
  fromUserOptions,
  copyTradersOnly,
  filters,
  setFilters,
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
      {copyTradersOnly && (
        <CustomSelect
          label={intl.formatMessage({
            id: "col.coin",
          })}
          onChange={(val) => setFilters({ quote: val.val })}
          options={quotes}
          search={true}
          value={filters.quote}
        />
      )}
      {copyTradersOnly && (
        <CustomSelect
          label={intl.formatMessage({
            id: "accounts.exchange",
          })}
          onChange={(v) => setFilters({ exchange: v })}
          options={exchanges}
          value={filters.exchange}
        />
      )}
      {copyTradersOnly && (
        <CustomSelect
          label={intl.formatMessage({
            id: "srv.edit.exchangetype",
          })}
          onChange={(v) => setFilters({ exchangeType: v })}
          options={exchangeTypes}
          value={filters.exchangeType}
        />
      )}
      <CustomSelect
        label={intl.formatMessage({
          id: "srv.filters.userowned",
        })}
        onChange={(v) => setFilters({ fromUser: v })}
        options={fromUserOptions}
        value={filters.fromUser}
      />
    </CustomFilters>
  );
};

export default ProvidersFilters;

import React from "react";
import CustomFilters from "../../CustomFilters";
import CustomSelect from "../../CustomSelect";
import { useIntl } from "react-intl";

/**
 * @typedef {import("../../CustomSelect/CustomSelect").OptionType} OptionType
 * @typedef {import("../../../store/initialState").BrowseFilters} BrowseFilters
 * @typedef {import("../../../store/initialState").SignalPBrowseFilters} SignalPBrowseFilters
 */

/**
 * @typedef {Object} ProvidersFiltersPropTypes
 * @property {function} onClose Callback that delegate filters toggle state to caller.
 * @property {function} clearFilters Callback that delegate filters clearing to caller.
 * @property {function} setFilters Callback that delegate filters update to caller.
 * @property {BrowseFilters|SignalPBrowseFilters|{}} filters Current filters.
 * @property {Array<OptionType>} exchanges Exchanges options.
 * @property {Array<OptionType>} exchangeTypes Exchange types options.
 * @property {Array<OptionType>} quotes Quotes options.
 * @property {Array<OptionType>} fromUserOptions Options array for user owned services select.
 * @property {boolean} open Flag to indicates if the filters bar is open.
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
          onChange={(/** @type {OptionType} */ val) => setFilters({ quote: val.val })}
          options={quotes}
          search={true}
          // @ts-ignore
          value={filters.quote}
        />
      )}
      {copyTradersOnly && (
        <CustomSelect
          label={intl.formatMessage({
            id: "accounts.exchange",
          })}
          onChange={(/** @type {string} */ v) => setFilters({ exchange: v })}
          options={exchanges}
          // @ts-ignore
          value={filters.exchange}
        />
      )}
      {copyTradersOnly && (
        <CustomSelect
          label={intl.formatMessage({
            id: "srv.edit.exchangetype",
          })}
          onChange={(/** @type {string} */ v) => setFilters({ exchangeType: v })}
          options={exchangeTypes}
          // @ts-ignore
          value={filters.exchangeType}
        />
      )}
      <CustomSelect
        label={intl.formatMessage({
          id: "srv.filters.userowned",
        })}
        onChange={(/** @type {string} */ v) => setFilters({ fromUser: v })}
        options={fromUserOptions}
        // @ts-ignore
        value={filters.fromUser}
      />
    </CustomFilters>
  );
};

export default ProvidersFilters;

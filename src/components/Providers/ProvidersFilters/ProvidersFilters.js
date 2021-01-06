import React from "react";
import CustomFilters from "../../CustomFilters";
import CustomSelect from "../../CustomSelect";
import { useIntl, FormattedMessage } from "react-intl";
import { Box, Checkbox } from "@material-ui/core";

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
 * @property {boolean} open Flag to indicates if the filters bar is open.
 * @property {string} provType
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
  provType,
  filters,
  setFilters,
}) => {
  const intl = useIntl();
  const copyTraders = provType === "copytraders";
  const profitSharing = provType === "profitsharing";

  return (
    <CustomFilters
      onClear={clearFilters}
      onClose={onClose}
      open={open}
      title={intl.formatMessage({
        id: "fil.filters",
      })}
    >
      {(copyTraders || profitSharing) && (
        <CustomSelect
          onChange={(/** @type {OptionType} */ val) => setFilters({ quote: val.val })}
          options={quotes}
          search={true}
          // @ts-ignore
          value={filters.quote}
        />
      )}
      {(copyTraders || profitSharing) && (
        <CustomSelect
          onChange={(/** @type {string} */ v) => setFilters({ exchange: v })}
          options={exchanges}
          // @ts-ignore
          value={filters.exchange}
        />
      )}
      {(copyTraders || profitSharing) && (
        <CustomSelect
          onChange={(/** @type {string} */ v) => setFilters({ exchangeType: v })}
          options={exchangeTypes}
          // @ts-ignore
          value={filters.exchangeType}
        />
      )}
      <Box
        alignItems="center"
        className="checkboxFilter"
        display="flex"
        flexDirection="row"
        justifyContent="flex-start"
      >
        <Checkbox
          // @ts-ignore
          checked={filters.fromUser === "userOwned"}
          onChange={(e) =>
            e.target.checked
              ? setFilters({ fromUser: "userOwned" })
              : setFilters({ fromUser: "ALL" })
          }
        />
        <span>
          <FormattedMessage id="srv.filters.userowned" />
        </span>
      </Box>
      {/* {(copyTraders || profitSharing) && (
        <Box
          alignItems="center"
          className="checkboxFilter"
          display="flex"
          flexDirection="row"
          justifyContent="flex-start"
        >
          <Checkbox
            // @ts-ignore
            checked={filters.profitSharing}
            onChange={(e) => setFilters({ profitSharing: e.target.checked })}
          />
          <span>
            <FormattedMessage id="srv.filters.profitsharing" />
          </span>
        </Box>
      )} */}
    </CustomFilters>
  );
};

export default ProvidersFilters;

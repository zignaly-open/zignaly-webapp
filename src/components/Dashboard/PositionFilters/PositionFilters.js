import React from "react";
import CustomFilters from "../../CustomFilters";
import CustomSelect from "../../CustomSelect";
import { FormattedMessage } from "react-intl";
import { Checkbox } from "@mui/material";
import { Box } from "@mui/material";

/**
 * @typedef {import("../../../services/tradeApiClient.types").UserPositionsCollection} UserPositionsCollection
 * @typedef {import("react").MouseEventHandler} MouseEventHandler
 * @typedef {import("../../CustomSelect/CustomSelect").OptionType} OptionType
 * @typedef {import("../../../store/initialState").DashboardPositionsFilters} DashboardPositionsFilters
 */

/**
 * @typedef {Object} PositionFiltersPropTypes
 * @property {Function} onChange Callback to broadcast filters changes to caller.
 * @property {boolean} showTypesFilter Flag to indicate whether types dropdown filter display or not.
 * @property {DashboardPositionsFilters} filters Current filters.
 * @property {function} clearFilters Callback that delegate filters clearing to caller.
 * @property {Array<OptionType>} pairOptions Pair options.
 * @property {Array<OptionType>} providerOptions Providers options.
 * @property {Array<OptionType>} types Types options.
 * @property {Array<OptionType>} sides Sides options.
 */

/**
 * Provides filters for filtering positions.
 *
 * @param {PositionFiltersPropTypes} props Component properties.
 * @returns {JSX.Element} Component JSX.
 */
const PositionFilters = (props) => {
  const { filters, onChange, showTypesFilter, providerOptions, pairOptions, types, sides } = props;

  /**
   * Set provider filter value.
   *
   * @param {string} value Selected provider value.
   * @returns {Void} None.
   */
  const setProvider = (value) => {
    onChange({
      providerId: value,
    });
  };

  /**
   * Set side filter value.
   *
   * @param {string} value Selected side value.
   * @returns {Void} None.
   */
  const setSide = (value) => {
    onChange({
      side: value,
    });
  };

  /**
   * Set status filter value.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} e Change event.
   * @returns {Void} None.
   */
  const setStatus = (e) => {
    const target = e.currentTarget;
    onChange({
      status: target.checked ? "all" : "",
    });
  };

  /**
   * Set type filter value.
   *
   * @param {string} value Selected type value.
   * @returns {Void} None.
   */
  const setType = (value) => {
    onChange({
      type: value,
    });
  };

  return (
    <CustomFilters title="Filters">
      {showTypesFilter && (
        <CustomSelect label="" onChange={setType} options={types} value={filters.type} />
      )}
      <CustomSelect
        label=""
        onChange={setProvider}
        options={providerOptions}
        value={filters.providerId}
      />
      <CustomSelect
        label=""
        onChange={(/** @type {OptionType} */ v) => onChange({ pair: v.val })}
        options={pairOptions}
        search={true}
        value={filters.pair}
      />
      <CustomSelect label="" onChange={setSide} options={sides} value={filters.side} />
      {showTypesFilter && (
        <Box alignItems="center" className="coinsFilter" display="flex" flexDirection="row">
          <Checkbox
            checked={filters.status === "all"}
            inputProps={{ "aria-label": "primary checkbox" }}
            onChange={setStatus}
          />
          <FormattedMessage id="positions.log.filter.status" />
        </Box>
      )}
    </CustomFilters>
  );
};

export default PositionFilters;

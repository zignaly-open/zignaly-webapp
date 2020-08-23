import React, { useState, useEffect } from "react";
import CustomFilters from "../../CustomFilters";
import CustomSelect from "../../CustomSelect";
import { uniqBy, sortBy } from "lodash";
import { FormattedMessage } from "react-intl";
import { Checkbox } from "@material-ui/core";
import { Box } from "@material-ui/core";

/**
 * @typedef {import("../../../services/tradeApiClient.types").UserPositionsCollection} UserPositionsCollection
 * @typedef {import("react").MouseEventHandler} MouseEventHandler
 * @typedef {import("../../../hooks/usePositionsList").PositionsFiltersState} PositionsFiltersState
 * @typedef {import("../../CustomSelect/CustomSelect").OptionType} OptionType
 */

/**
 * @typedef {Object} PositionFiltersPropTypes
 * @property {Function} onChange Callback to broadcast filters changes to caller.
 * @property {UserPositionsCollection} positions Positions collection.
 * @property {PositionsFiltersState} initialState Filters initial state.
 * @property {boolean} showTypesFilter Flag to indicate whether types dropdown filter display or not.
 */

/**
 * Provides filters for filtering positions.
 *
 * @param {PositionFiltersPropTypes} props Component properties.
 * @returns {JSX.Element} Component JSX.
 */
const PositionFilters = (props) => {
  const {
    filters,
    onChange,
    positions,
    showTypesFilter,
    clearFilters,
    providerOptions,
    pairOptions,
    types,
    sides,
  } = props;

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
   * Set coin pair filter value.
   *
   * @param {string} value Selected coin value.
   * @returns {Void} None.
   */
  const setCoin = (value) => {
    onChange({
      pair: value,
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

  console.log("compo", filters);
  return (
    <CustomFilters onClear={clearFilters} title="Filters">
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
        onChange={(v) => onChange({ pair: v.val })}
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

import React, { useState, useEffect } from "react";
import CustomFilters from "../../CustomFilters";
import CustomSelect from "../../CustomSelect";
import { uniqBy, sortBy } from "lodash";

/**
 * @typedef {import("../../../services/tradeApiClient.types").UserPositionsCollection} UserPositionsCollection
 * @typedef {import("react").MouseEventHandler} MouseEventHandler
 * @typedef {Object} PositionFiltersPropTypes
 * @property {Function} onChange Callback to broadcast filters changes to caller.
 * @property {MouseEventHandler} onClose Callback that delegate filters toggle state to caller.
 * @property {UserPositionsCollection} positions
 * @property {boolean} showTypesFilter
 */

/**
 * Provides filters for filtering positions.
 *
 * @param {PositionFiltersPropTypes} props Component properties.
 * @returns {JSX.Element} Component JSX.
 */
const PositionFilters = (props) => {
  const { onChange, onClose, positions, showTypesFilter } = props;
  const defaultFilters = {
    provider: "all",
    pair: "all",
    side: "all",
    type: "all",
  };
  const [filters, setFilters] = useState(defaultFilters);

  const extractPairOptions = () => {
    const coinsDistinct = uniqBy(positions, "pair").map((position) => {
      return { label: position.pair, val: position.pair };
    });

    return [{ label: "All Pairs", val: "all" }].concat(sortBy(coinsDistinct, "label"));
  };

  const extractProviderOptions = () => {
    const coinsDistinct = uniqBy(positions, "providerName").map((position) => {
      return { label: position.providerName, val: position.providerName };
    });

    return [{ label: "All Providers", val: "all" }].concat(sortBy(coinsDistinct, "label"));
  };

  const pairOptions = extractPairOptions();
  const sides = [
    { label: "All Sides", val: "all" },
    { label: "SHORT", val: "SHORT" },
    { label: "LONG", val: "LONG" },
  ];

  const types = [
    { label: "All Types", val: "all" },
    { label: "UNSOLD", val: "Unsold" },
    { label: "UNOPENED", val: "Unopen" },
  ];

  const providerOptions = extractProviderOptions();

  const clearFilters = () => {
    setFilters(defaultFilters);
  };

  const broadcastChange = () => {
    onChange(filters);
  };

  /**
   * Set provider filter value.
   *
   * @param {string} value Selected provider value.
   * @returns {Void} None.
   */
  const setProvider = (value) => {
    setFilters({
      ...filters,
      provider: value,
    });
  };

  /**
   * Set coin pair filter value.
   *
   * @param {string} value Selected coin value.
   * @returns {Void} None.
   */
  const setCoin = (value) => {
    setFilters({
      ...filters,
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
    setFilters({
      ...filters,
      side: value,
    });
  };

  /**
   * Set type filter value.
   *
   * @param {string} value Selected type value.
   * @returns {Void} None.
   */
  const setType = (value) => {
    setFilters({
      ...filters,
      type: value,
    });
  };

  useEffect(broadcastChange, [filters]);

  return (
    <CustomFilters onClear={clearFilters} onClose={onClose} title="Filters">
      {showTypesFilter && (
        <CustomSelect label="" onChange={setType} options={types} value={filters.type} />
      )}
      <CustomSelect
        label=""
        onChange={setProvider}
        options={providerOptions}
        value={filters.provider}
      />
      <CustomSelect label="" onChange={setCoin} options={pairOptions} value={filters.pair} />
      <CustomSelect label="" onChange={setSide} options={sides} value={filters.side} />
    </CustomFilters>
  );
};

export default PositionFilters;

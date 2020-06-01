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
 */

/**
 * Provides filters for filtering positions.
 *
 * @param {PositionFiltersPropTypes} props Component properties.
 * @returns {JSX.Element} Component JSX.
 */
const PositionFilters = (props) => {
  const { onChange, onClose, positions } = props;
  const defaultFilters = {
    provider: "all",
    pair: "all",
    side: "all",
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
    { label: "All Types", val: "all" },
    { label: "SHORT", val: "SHORT" },
    { label: "LONG", val: "LONG" },
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
   * @param {string} value Selected filter value.
   * @returns {Void} None.
   */
  const setProvider = (value) => {
    setFilters({
      ...filters,
      provider: value,
    });
  };

  /**
   * Set pair filter value.
   *
   * @param {string} value Selected filter value.
   * @returns {Void} None.
   */
  const setCoin = (value) => {
    setFilters({
      ...filters,
      pair: value,
    });
  };

  /**
   * Set type filter value.
   *
   * @param {string} value Selected filter value.
   * @returns {Void} None.
   */
  const setSide = (value) => {
    setFilters({
      ...filters,
      side: value,
    });
  };

  useEffect(broadcastChange, [filters]);

  return (
    <CustomFilters onClear={clearFilters} onClose={onClose} title="Filters">
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

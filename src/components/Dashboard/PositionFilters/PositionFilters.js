import React, { useState, useEffect } from "react";
import CustomFilters from "../../CustomFilters";
import CustomSelect from "../../CustomSelect";

/**
 * @typedef {import("react").MouseEventHandler} MouseEventHandler
 * @typedef {Object} PositionFiltersPropTypes
 * @property {Function} onChange Callback that delegate filters changes to caller.
 * @property {MouseEventHandler} onClose Callback that delegate filters toggle state to caller.
 */

/**
 * Provides filters for filtering positions.
 *
 * @param {PositionFiltersPropTypes} props Component properties.
 * @returns {JSX.Element} Component JSX.
 */
const PositionFilters = ({ onChange, onClose }) => {
  const types = [
    { label: "All types", val: "all" },
    { label: "Type 1", val: "type1" },
  ];
  const mdas = [{ label: "MDA", val: "mda" }];
  const traders = [{ label: "All Traders", val: "all" }];

  const [type, setType] = useState(types[0].val);
  const [mda, setMDA] = useState(mdas[0].val);
  const [trader, setTrader] = useState(traders[0].val);

  const clearFilters = () => {
    setType("");
    setMDA("");
    setTrader("");
  };

  useEffect(() => {
    onChange(type, mda, trader);
  }, [type, mda, trader, onChange]);

  return (
    <CustomFilters onClear={clearFilters} onClose={onClose} title="Filters">
      <CustomSelect label="" onChange={setType} options={types} value={type} />
      <CustomSelect label="" onChange={setMDA} options={mdas} value={mda} />
      <CustomSelect label="" onChange={setTrader} options={traders} value={trader} />
    </CustomFilters>
  );
};

export default PositionFilters;

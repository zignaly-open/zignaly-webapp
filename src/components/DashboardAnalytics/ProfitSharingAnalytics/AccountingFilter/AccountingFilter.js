import React, { useState } from "react";
import { Box } from "@mui/material";
import CustomSelect from "../../../CustomSelect";
/**
 *
 * @typedef {import("../../../../services/tradeApiClient.types").ProfitSharingBalanceEntry} ProfitSharingBalanceEntry
 * @typedef {import("../../../CustomSelect/CustomSelect").OptionType} OptionType
 */

/**
 *
 * @typedef {Object} DefaultProps
 * @property {Array<ProfitSharingBalanceEntry>} data
 * @property {function(Array<ProfitSharingBalanceEntry>):*} onChange
 * @property {Array<OptionType>} types
 */

/**
 *
 * @param {DefaultProps} props Default props.
 */

const AccountingFilter = ({ data, onChange, types }) => {
  const [selected, setSelected] = useState("all");

  /**
   * Select change handler.
   *
   * @param {string} value Change event.
   *
   * @returns {Void} No return.
   */
  const handleChange = (value) => {
    setSelected(value);
    onChange(filterData(value));
  };

  /**
   * Filter accounting data
   *
   * @param {string} value Original data
   * @returns {Array<ProfitSharingBalanceEntry>} Filtered data
   */
  const filterData = (value) => {
    if (value === "all") {
      return data;
    }

    return data.filter((item) => item.type.toLowerCase() === value.toLowerCase());
  };

  return (
    <Box alignItems="center" className="accountingFilter" display="flex" flexDirection="row">
      <CustomSelect label="" onChange={handleChange} options={types} value={selected} />
    </Box>
  );
};

export default AccountingFilter;

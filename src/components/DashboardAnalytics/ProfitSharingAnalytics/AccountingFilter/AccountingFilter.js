import React, { useState } from "react";
import { Box } from "@material-ui/core";
import CustomSelect from "../../../CustomSelect";
import { useIntl } from "react-intl";
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
  const intl = useIntl();

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

    let filteredData = data.filter((item) => item.type === value);
    return filteredData;
  };

  return (
    <Box alignItems="center" className="accountFilter" display="flex" flexDirection="row">
      <CustomSelect
        label={intl.formatMessage({ id: "dashboard.balance.show" })}
        onChange={handleChange}
        options={types}
        value={selected}
      />
    </Box>
  );
};

export default AccountingFilter;

import React, { useState } from "react";
import { useIntl } from "react-intl";
import { Box } from "@material-ui/core";
import CustomSelect from "../CustomSelect";
import "./TimeFrameSelect.scss";

/**
 * @typedef {import("../CustomSelect/CustomSelect").OptionType} OptionType
 * @type {Array<OptionType>}
 */
const timeframes = [
  { label: "Last month", val: 30 },
  { label: "Last 90 days", val: 90 },
  { label: "Last year", val: 365 },
];

/**
 * @typedef {Object} TimeFrameSelectPropTypes
 * @property {function} onChange Callback that delegate timeframe changes to caller.
 * @property {number} value Selected value.
 */

/**
 * Provides sorting options for providers.
 *
 * @param {TimeFrameSelectPropTypes} props Component properties.
 * @returns {JSX.Element} Component JSX.
 */
const TimeFrameSelect = (props) => {
  const { onChange, value } = props;
  const intl = useIntl();

  return (
    <Box className="selectTimeFrame">
      <CustomSelect
        label={intl.formatMessage({ id: "timeframe.returns" })}
        onChange={onChange}
        options={timeframes}
        value={value}
      />
    </Box>
  );
};

export default TimeFrameSelect;

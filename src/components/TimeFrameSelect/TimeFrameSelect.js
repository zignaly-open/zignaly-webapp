import React from "react";
import { useIntl } from "react-intl";
import { Box } from "@mui/material";
import CustomSelect from "../CustomSelect";
import "./TimeFrameSelect.scss";

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

  /**
   * @typedef {import("../CustomSelect/CustomSelect").OptionType} OptionType
   * @type {Array<OptionType>}
   */
  const timeframes = [
    { label: intl.formatMessage({ id: "timeframe.days.7" }), val: 7 },
    { label: intl.formatMessage({ id: "timeframe.days.30" }), val: 30 },
    { label: intl.formatMessage({ id: "timeframe.days.90" }), val: 90 },
    { label: intl.formatMessage({ id: "timeframe.days.180" }), val: 180 },
    { label: intl.formatMessage({ id: "timeframe.total" }), val: 3650 },
  ];

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

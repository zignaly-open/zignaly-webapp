import React from "react";
import { Box, Typography } from "@material-ui/core";
import TimeFrameSelect from "../../TimeFrameSelect";
import { FormattedMessage } from "react-intl";
import "./TimeFrameSelectRow.scss";

/**
 * @typedef {Object} TimeFrameSelectRowPropTypes
 * @property {function} onChange Callback that delegate timeframe changes to caller.
 * @property {number} value Selected value.
 * @property {string} title Title to display next to the dropdown.
 */

/**
 * Provides row to display providers count with a dropdown to select timeframe.
 *
 * @param {TimeFrameSelectRowPropTypes} props Component properties.
 * @returns {JSX.Element} Component JSX.
 */
const TimeFrameSelectRow = ({ title, onChange, value }) => (
  <Box
    className="timeFrameSelectRow"
    display="flex"
    flexDirection="row"
    flexWrap="wrap"
    justifyContent="space-between"
  >
    <Typography className="providersCount" variant="h3">
      {title}
    </Typography>
    <Box alignItems="center" display="flex" flexDirection="row" justifyContent="flex-end">
      <TimeFrameSelect onChange={onChange} value={value} />
    </Box>
  </Box>
);

export default TimeFrameSelectRow;

import React from "react";
import { Box, Typography, Hidden } from "@material-ui/core";
import TimeFrameSelect from "../../TimeFrameSelect";
import "./TimeFrameSelectRow.scss";
import CustomButton from "../../CustomButton";
import { FormattedMessage } from "react-intl";
import { showCreateProvider } from "../../../store/actions/ui";
import { useDispatch } from "react-redux";

/**
 * @typedef {Object} TimeFrameSelectRowPropTypes
 * @property {function} onChange Callback that delegate timeframe changes to caller.
 * @property {number} value Selected value.
 * @property {string} title Title to display next to the dropdown.
 * @property {boolean} isCopyTrading
 */

/**
 * Provides row to display providers count with a dropdown to select timeframe.
 *
 * @param {TimeFrameSelectRowPropTypes} props Component properties.
 * @returns {JSX.Element} Component JSX.
 */
const TimeFrameSelectRow = ({ title, onChange, value, isCopyTrading }) => {
  const dispatch = useDispatch();
  return (
    <Box
      className="timeFrameSelectRow"
      display="flex"
      flexDirection="row"
      flexWrap="wrap"
      justifyContent="space-between"
    >
      <Box
        display="flex"
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        className="providersCountBox"
      >
        <Typography className="providersCount" variant="h3">
          {title}
        </Typography>
        <Hidden smUp>
          <CustomButton className="textPurple" onClick={() => dispatch(showCreateProvider(true))}>
            <Typography variant="body1">
              <FormattedMessage id={`${isCopyTrading ? "copyt" : "signalp"}.become`} />
            </Typography>
          </CustomButton>
        </Hidden>
      </Box>
      <Box
        alignItems="center"
        display="flex"
        flexDirection="row"
        justifyContent="flex-end"
        className="timeFrameSelectBox"
      >
        <TimeFrameSelect onChange={onChange} value={value} />
      </Box>
    </Box>
  );
};

export default TimeFrameSelectRow;

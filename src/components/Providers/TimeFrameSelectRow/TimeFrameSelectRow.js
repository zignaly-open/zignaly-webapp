import React from "react";
import { Box, Typography, Hidden, useMediaQuery } from "@mui/material";
import TimeFrameSelect from "../../TimeFrameSelect";
import "./TimeFrameSelectRow.scss";
import CustomButton from "../../CustomButton";
import { FormattedMessage } from "react-intl";
import { showCreateProvider, showCreateTrader } from "../../../store/actions/ui";
import { useDispatch } from "react-redux";
import { useTheme } from "@mui/material/styles";
import ServiceIcon from "../../../images/offerServiceIcon.svg";

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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const createButtonText = () => {
    if (isMobile) {
      return `${isCopyTrading ? "copyt" : "signalp"}.become.mobile`;
    }
    return `${isCopyTrading ? "copyt" : "signalp"}.become`;
  };

  return (
    <Box
      className="timeFrameSelectRow"
      display="flex"
      flexDirection="row"
      flexWrap="wrap"
      justifyContent="space-between"
    >
      <Box
        alignItems="center"
        className="providersCountBox"
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
      >
        <Typography className="providersCount" variant="h3">
          {title}
        </Typography>
        <Hidden smUp>
          <CustomButton
            className="textPurple"
            onClick={() =>
              dispatch(isCopyTrading ? showCreateTrader(true) : showCreateProvider(true))
            }
          >
            <Typography variant="body1">
              <FormattedMessage id={createButtonText()} />
            </Typography>
            <img alt="service-icon" className="buttonIcon" src={ServiceIcon} />
          </CustomButton>
        </Hidden>
      </Box>
      {isCopyTrading && (
        <Box
          alignItems="center"
          className="timeFrameSelectBox"
          display="flex"
          flexDirection="row"
          justifyContent="flex-end"
        >
          <TimeFrameSelect onChange={onChange} value={value} />
        </Box>
      )}
    </Box>
  );
};

export default TimeFrameSelectRow;

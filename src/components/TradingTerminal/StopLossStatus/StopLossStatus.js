import React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { colors } from "../../../services/theme";
import { Box, FormHelperText, Tooltip } from "@mui/material";
import { Help } from "@mui/icons-material";
import "./StopLossStatus.scss";

/**
 * @typedef {Object} StopLossStatusProps
 * @property {string} orderId Order Id
 */

/**
 * Stop Loss status label with detailed description tooltip.
 *
 * @param {StopLossStatusProps} props Component props.
 * @returns {JSX.Element} Helper label with description in tooltip element.
 */
const StopLossStatus = (props) => {
  const { orderId } = props;
  const { formatMessage } = useIntl();
  let iconColor = colors.darkGrey;
  let description = formatMessage({ id: "terminal.status.pending" });

  if (orderId) {
    description = formatMessage({ id: "terminal.status.placed" }, { orderId });
    iconColor = colors.blue;
  }

  return (
    <Box alignItems="center" className="targetStatus" display="flex" justifyContent="flex-end">
      <FormHelperText>
        <FormattedMessage id="terminal.status" />
      </FormHelperText>
      <Tooltip arrow enterTouchDelay={50} placement="left-end" title={description}>
        <Help style={{ fill: iconColor }} />
      </Tooltip>
    </Box>
  );
};

export default React.memo(StopLossStatus);

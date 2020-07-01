import React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { colors } from "../../../services/theme";
import { Box, FormHelperText, Tooltip } from "@material-ui/core";
import { Help } from "@material-ui/icons";
import "./DCATargetStatus.scss";

/**
 * @typedef {import("../../../services/tradeApiClient.types").ReBuyTarget} RebuyTarget
 */

/**
 * @typedef {Object} DCATargetLabelProps
 * @property {string} labelId Status label translation text ID.
 * @property {RebuyTarget} dcaTarget Position take profit target.
 */

/**
 * DCA status label with detailed description tooltip.
 *
 * @param {DCATargetLabelProps} props Component props.
 * @returns {JSX.Element} Helper label with description in tooltip element.
 */
const DCATargetStatus = (props) => {
  const { dcaTarget, labelId } = props;
  const { formatMessage } = useIntl();
  let iconColor = colors.purpleLight;

  // Empty box to fill flex item space.
  if (!dcaTarget) {
    return <Box />;
  }

  let description = dcaTarget.orderId
    ? formatMessage({ id: "terminal.status.placed" }, { orderId: dcaTarget.orderId })
    : formatMessage({ id: "terminal.status.pending" });

  if (dcaTarget.done) {
    description = formatMessage({ id: "terminal.status.done" });
    iconColor = colors.green;
  } else if (dcaTarget.skipped) {
    description = dcaTarget.errorMSG || formatMessage({ id: "terminal.status.failed" });
    iconColor = colors.red;
  }

  return (
    <Box alignItems="center" className="targetStatus" display="flex" justifyContent="flex-end">
      <FormHelperText>
        <FormattedMessage id={labelId} />
      </FormHelperText>
      <Tooltip arrow enterTouchDelay={50} placement="left-end" title={description}>
        <Help style={{ fill: iconColor }} />
      </Tooltip>
    </Box>
  );
};

export default React.memo(DCATargetStatus);

import React from "react";
import { Box, Tooltip, Typography } from "@mui/material";
import { FormattedMessage } from "react-intl";
import HelpIcon from "@mui/icons-material/Help";
import TooltipWithUrl from "components/Controls/TooltipWithUrl";

/**
 * @typedef {Object} TooltipObject
 * @property {string} message
 * @property {string} [url]
 *
 * @typedef {Object} DefaultProps
 * @property {string} name
 * @property {JSX.Element} [info]
 * @property {JSX.Element} value
 * @property {TooltipObject} [tooltip]
 */

/**
 * Render a part of the equity bar
 *
 * @param {DefaultProps} props Component props.
 * @returns {JSX.Element} JSX
 */
const EquityPart = ({ name, info, value, tooltip }) => {
  return (
    <Box alignItems="flex-start" className="dataBox" display="flex" flexDirection="column">
      <Box
        alignItems="center"
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
        mb={1}
      >
        <Box alignItems="center" display="flex" flexDirection="row">
          <Typography variant="h4">
            <FormattedMessage id={name} />
          </Typography>
          {tooltip && (
            <Tooltip
              interactive
              placement="top"
              title={<TooltipWithUrl message={tooltip.message} url={tooltip.url} />}
            >
              <HelpIcon className="helpIcon" />
            </Tooltip>
          )}
        </Box>
        {info && <span className="number3 smallText">{info}</span>}
      </Box>
      <Box alignItems="center" display="flex" flexDirection="row" justifyContent="flex-start">
        <span className="number1">{value}</span>
      </Box>
    </Box>
  );
};

export default EquityPart;

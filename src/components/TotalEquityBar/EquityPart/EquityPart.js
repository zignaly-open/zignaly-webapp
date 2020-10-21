import React from "react";
import { Box, Typography } from "@material-ui/core";
import { FormattedMessage } from "react-intl";

/**
 * @typedef {Object} DefaultProps
 * @property {string} name
 * @property {JSX.Element} [info]
 * @property {JSX.Element} value
 */

/**
 * Render a part of the equity bar
 *
 * @param {DefaultProps} props Component props.
 * @returns {JSX.Element} JSX
 */
const EquityPart = ({ name, info, value }) => {
  return (
    <Box
      alignItems="center"
      className="dataBox"
      display="flex"
      flexDirection="column"
      justifyContent="flex-start"
    >
      <Box>
        <Box
          alignItems="center"
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
          mb={1}
        >
          <Typography variant="h4">
            <FormattedMessage id={name} />
          </Typography>
          {info && <span className="number3 smallText">{info}</span>}
        </Box>
        <Box alignItems="center" display="flex" flexDirection="row" justifyContent="flex-start">
          <span className="number1">{value}</span>
        </Box>
      </Box>
    </Box>
  );
};

export default EquityPart;

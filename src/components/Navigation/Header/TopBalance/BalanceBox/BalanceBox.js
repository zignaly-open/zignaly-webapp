import React from "react";
import { Box, Typography } from "@mui/material";

/**
 * @typedef {Object} DefaultProps
 * @property {JSX.Element|String} name
 * @property {JSX.Element|String} [value1]
 * @property {JSX.Element|String} [value2]
 */

/**
 * Render a part of the equity bar
 *
 * @param {DefaultProps} props Component props.
 * @returns {JSX.Element} JSX
 */
const BalaneBox = ({ name, value1, value2 }) => {
  return (
    <Box
      alignItems="flex-start"
      className="balanceBox"
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
    >
      <Typography className="title" variant="subtitle1">
        {name}
      </Typography>
      <span className="number1">{value1}</span>
      <span className="number3">{value2}</span>
    </Box>
  );
};

export default BalaneBox;

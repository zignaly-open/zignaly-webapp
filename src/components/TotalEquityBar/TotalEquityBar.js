import React from "react";
import "./TotalEquityBar.scss";
import { Box } from "@mui/material";

/**
 * @typedef {Object} DefaultProps
 * @property {JSX.Element} children
 */

/**
 * @param {DefaultProps} props Default props.
 * @returns {JSX.Element} Component JSX.
 */

const TotalEquityBar = ({ children }) => {
  return (
    <Box
      alignItems="center"
      className="totalEquityBar"
      display="flex"
      flexDirection="row"
      justifyContent="space-around"
    >
      {children}
    </Box>
  );
};

export default TotalEquityBar;

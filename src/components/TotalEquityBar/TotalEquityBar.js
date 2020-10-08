import React from "react";
import "./TotalEquityBar.scss";
import { Box } from "@material-ui/core";

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
      justifyContent="space-between"
    >
      {children}
    </Box>
  );
};

export default TotalEquityBar;

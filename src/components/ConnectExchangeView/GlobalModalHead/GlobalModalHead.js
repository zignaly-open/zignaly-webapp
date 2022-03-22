import React from "react";
import { Box } from "@mui/material";
import "./GlobalModalHead.scss";

/**
 * @typedef {Object} DefaultProps
 * @property {React.ReactElement} actionBar Action bar component.
 * @property {React.ReactElement} titleBar Title bar component.
 */

/**
 * @param {DefaultProps} props Default props.
 * @returns {JSX.Element} Component JSX.
 */
const GlobalModalHead = ({ actionBar, titleBar }) => {
  return (
    <Box className="globalModalHead">
      <Box
        alignItems="center"
        className="actionBar"
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
      >
        {actionBar}
      </Box>
      <Box className="titleBar">{titleBar}</Box>
    </Box>
  );
};

export default GlobalModalHead;

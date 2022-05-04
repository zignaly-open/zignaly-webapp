import React from "react";
import { Box } from "@mui/material";
import LoginLinks from "../LoginLinks";

/**
 *
 * @typedef {Object} DefaultProps
 * @property {JSX.Element} children
 */

/**
 * Component to handle form rendering in the form of tabs.
 *
 * @param {DefaultProps} props Default props.
 * @returns {JSX.Element} JSX component.
 */
const LoginTabs = ({ children }) => {
  return (
    <Box className="loginTabs">
      <LoginLinks />

      <Box className="section">{children}</Box>
    </Box>
  );
};

export default LoginTabs;

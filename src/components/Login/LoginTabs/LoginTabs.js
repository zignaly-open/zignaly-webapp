import React from "react";
import "./LoginTabs.scss";
import { Box } from "@material-ui/core";
import LoginLinks from "../LoginLinks";

/**
 *
 * @typedef {Object} DefaultProps
 * @property {JSX.Element} children
 */

/**
 * @param {DefaultProps} props
 * @returns {JSX.Element}
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

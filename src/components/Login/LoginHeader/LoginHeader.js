import React from "react";
import "./LoginHeader.scss";
import { Box } from "@material-ui/core";
import Logo from "../../../images/logo/logoWhite.svg";

/**
 *
 * @typedef {Object} DefaultProps
 * @property {JSX.Element} children
 */

/**
 * @param {DefaultProps} props
 * @returns {JSX.Element}
 */
const LoginHeader = ({ children }) => {
  return (
    <Box
      className="loginHeader"
      display="flex"
      flexDirection="row"
      justifyContent="space-around"
      flexWrap="wrap"
    >
      <Box className="headerImage" />
      <Box
        alignItems="start"
        className="tagLineBox"
        display="flex"
        flexDirection="column"
        justifyContent="start"
      >
        <img alt="Zignaly" className="logo" src={Logo} />
        <span className="tagLine">What could a pro trader do with your crypto?</span>
        <span className="slogan">
          <b>Copy pro traders </b>and earn same profits as they do.{" "}
        </span>
      </Box>
      {children}
    </Box>
  );
};

export default LoginHeader;

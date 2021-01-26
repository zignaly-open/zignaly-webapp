import React from "react";
import "./LoginHeader.scss";
import { Box } from "@material-ui/core";
import Logo from "../../../images/logo/logoNW.svg";
import LanguageSwitcherDropdown from "../LanguageSwitcherDropdown";
import { FormattedMessage } from "react-intl";

/**
 *
 * @typedef {Object} DefaultProps
 * @property {JSX.Element} children
 */

/**
 * Header component for login/signup pages.
 *
 * @param {DefaultProps} props Default props.
 * @returns {JSX.Element} JSX component.
 */
const LoginHeader = ({ children }) => {
  return (
    <Box
      className="loginHeader"
      display="flex"
      flexDirection="row"
      flexWrap="wrap"
      justifyContent="space-between"
    >
      <Box className="headerImage" />
      <Box className="languageBox">
        <LanguageSwitcherDropdown />
      </Box>
      <Box
        alignItems="start"
        className="tagLineBox"
        display="flex"
        flexDirection="column"
        justifyContent="start"
      >
        <img alt="Zignaly" className="logo" src={Logo} />
        <span className="tagLine">
          <FormattedMessage id="login.header.tagline" />
        </span>
        <span className="slogan">
          <b>
            <FormattedMessage id="login.header.tagline2.1" />
          </b>{" "}
          <FormattedMessage id="login.header.tagline2.2" />
        </span>
      </Box>
      {children}
    </Box>
  );
};

export default LoginHeader;

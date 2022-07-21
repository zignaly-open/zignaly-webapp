import React from "react";
import "./Login.scss";
import { Box, Typography } from "@material-ui/core";
import Logo from "images/logo/logoNB.svg";
import Trophy from "images/login/trophy.svg";
import Coins from "images/login/coins.svg";
import OneDollar from "images/login/$1.svg";
import LanguageSwitcherDropdown from "../LanguageSwitcherDropdown";
import Press from "../Press";
import { FormattedMessage } from "react-intl";
import { Alert, AlertTitle } from "@material-ui/lab";

/**
 *
 * @typedef {Object} DefaultProps
 * @property {JSX.Element} children
 */

/**
 * Login Page.
 *
 * @param {DefaultProps} props Default props.
 * @returns {JSX.Element} JSX component.
 */
const Login = ({ children }) => {
  return (
    <Box className="loginPage">
      <Box className="headerBox" display="flex" flexDirection="row" justifyContent="center">
        <a href="https://www.zignaly.com">
          <img alt="Zignaly" className="logo" src={Logo} />
        </a>
      </Box>
      <br />
      <br />
      <Alert severity="info" title="Maintenance">
        <span style={{ fontSize: "20px" }}>
          Hello,
          <br />
          We are performing a maintenance. We expect to be done by 1pm UTC, but it could be sooner,
          so don't hesitate to check this up in 30min.
          <br />
          Thanks.
        </span>
      </Alert>
    </Box>
  );
};

export default Login;

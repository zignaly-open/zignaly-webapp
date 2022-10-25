import React from "react";
import "./Login.scss";
import { Box, Typography } from "@material-ui/core";
import Logo from "images/logo/logoNB.svg";
import Trophy from "images/login/trophy.svg";
import Coins from "images/login/coins.svg";
import OneDollar from "images/login/$1.svg";
import LanguageSwitcherDropdown from "../LanguageSwitcherDropdown";
import { FormattedMessage } from "react-intl";
import PressOld from "../PressOld";

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
    <Box className="loginPageOld">
      <Box className="headerBox" display="flex" flexDirection="row" justifyContent="space-between">
        <a href="https://www.zignaly.com">
          <img alt="Zignaly" className="logo" src={Logo} />
        </a>
        <Box className="languageBox">
          <LanguageSwitcherDropdown />
        </Box>
      </Box>
      <Box className="heroBox" display="flex" flexDirection="row" justifyContent="space-between">
        <Box className="heroSide">
          <Typography variant="h1">
            <FormattedMessage
              id="login.hero"
              values={{ strong: (/** @type {string} **/ chunks) => <strong>{chunks}</strong> }}
            />
          </Typography>
          <div className="sect">
            <img src={Trophy} />
            <div className="sectDescBox">
              <Typography className="sectHeader">
                <FormattedMessage id="login.hero.record" />
              </Typography>
              <Typography className="sectTitle">
                <FormattedMessage id="login.hero.record.desc" />
              </Typography>
            </div>
          </div>
          <div className="sect">
            <img src={Coins} />
            <div className="sectDescBox">
              <Typography className="sectHeader">
                <FormattedMessage id="login.hero.fees" />
              </Typography>
              <Typography className="sectTitle">
                <FormattedMessage id="login.hero.fees.desc" />
              </Typography>
            </div>
          </div>
          <div className="sect">
            <img src={OneDollar} />
            <div className="sectDescBox">
              <Typography className="sectHeader">
                <FormattedMessage id="login.hero.min" />
              </Typography>
              <Typography className="sectTitle">
                <FormattedMessage id="login.hero.min.desc" />
              </Typography>
            </div>
          </div>
        </Box>
        {children}
      </Box>
      <PressOld />
    </Box>
  );
};

export default Login;

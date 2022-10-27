import React from "react";
import "./Login.scss";
import { Box, Typography } from "@material-ui/core";
import Logo from "images/logo/logoNB.svg";
import User from "images/login/user.svg";
import Like from "images/login/like.svg";
import Broker from "images/login/broker.svg";
import Money from "images/login/money.svg";
import LanguageSwitcherDropdown from "../LanguageSwitcherDropdown";
import Press from "../Press";
import { FormattedMessage } from "react-intl";

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
              id="login2.hero"
              values={{ strong: (/** @type {string} **/ chunks) => <strong>{chunks}</strong> }}
            />
          </Typography>
          <div className="brokerSection">
            <img src={Broker} />
          </div>

          <div className="sect">
            <img src={User} />
            <div className="sectDescBox">
              <Typography className="sectHeader">
                <FormattedMessage id="login2.hero.record" />
              </Typography>
              <Typography className="sectTitle">
                <p className="underline">
                  <FormattedMessage id="login2.hero.record.desc2" />
                </p>
                <FormattedMessage id="login2.hero.record.desc" />
              </Typography>
            </div>
          </div>
          <div className="sect">
            <img src={Like} />
            <div className="sectDescBox">
              <Typography className="sectHeader">
                <FormattedMessage id="login2.hero.fees" />
              </Typography>
              <p className="underline">
                <Typography className="sectTitle">
                  <FormattedMessage id="login2.hero.fees.desc" />
                </Typography>
              </p>
            </div>
          </div>
          <div className="sect">
            <img src={Money} />
            <div className="sectDescBox">
              <Typography className="sectHeader">
                <FormattedMessage id="login2.hero.min" />
              </Typography>
              <Typography className="sectTitle">
                <FormattedMessage id="login2.hero.min.desc" />
                <p className="underline">
                  <FormattedMessage id="login2.hero.min.desc2" />
                </p>
              </Typography>
            </div>
          </div>
        </Box>
        {children}
      </Box>
      <Press />
    </Box>
  );
};

export default Login;

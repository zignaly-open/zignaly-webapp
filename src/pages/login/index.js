import React, { useMemo, useEffect } from "react";
import { Box } from "@material-ui/core";
import "./login.scss";
import Logo from "../../images/logo/logoWhite.svg";
import Testimonials from "../../components/Testimonials";
import LoginTabs from "../../components/LoginTabs";
import { Helmet } from "react-helmet";
import translations from "../../i18n/translations";
import { IntlProvider } from "react-intl";
import { ThemeProvider, createMuiTheme, StylesProvider } from "@material-ui/core/styles";
import themeData from "../../services/theme";
import { useDispatch } from "react-redux";
import { endTradeApiSession } from "../../store/actions/session";

const LoginPage = () => {
  const options = themeData(false);
  const createTheme = () => createMuiTheme(options);
  const theme = useMemo(createTheme, []);
  const dispatch = useDispatch();

  const dispatchLogout = () => {
    dispatch(endTradeApiSession());
  };
  useEffect(dispatchLogout, []);

  return (
    <IntlProvider locale="en" messages={translations.en}>
      <StylesProvider injectFirst>
        <ThemeProvider theme={theme}>
          <Helmet>
            <title>Login</title>
          </Helmet>
          <Box className="loginPage">
            <Box
              className="loginHeader"
              display="flex"
              flexDirection="row"
              justifyContent="space-around"
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
              <LoginTabs />
            </Box>
            <Testimonials />
          </Box>
        </ThemeProvider>
      </StylesProvider>
    </IntlProvider>
  );
};

export default LoginPage;

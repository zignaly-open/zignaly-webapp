import React, { useMemo, useEffect } from "react";
import { Box } from "@material-ui/core";
import "./login.scss";
import Testimonials from "../../components/Testimonials";
import LoginTabs from "../../components/Login/LoginTabs";
import { Helmet } from "react-helmet";
import translations from "../../i18n/translations";
import { IntlProvider } from "react-intl";
import { ThemeProvider, createMuiTheme, StylesProvider } from "@material-ui/core/styles";
import themeData from "../../services/theme";
import { useDispatch } from "react-redux";
import { endTradeApiSession } from "../../store/actions/session";
import LoginForm from "../../components/Forms/LoginForm";
import LoginHeader from "../../components/Login/LoginHeader";

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
            <LoginHeader>
              <LoginTabs>
                <LoginForm />
              </LoginTabs>
            </LoginHeader>
            <Testimonials />
          </Box>
        </ThemeProvider>
      </StylesProvider>
    </IntlProvider>
  );
};

export default LoginPage;

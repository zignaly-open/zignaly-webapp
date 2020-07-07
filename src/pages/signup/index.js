import React, { useMemo, useEffect } from "react";
import { Box } from "@material-ui/core";
import "./signup.scss";
import Testimonials from "../../components/Testimonials";
import LoginTabs from "../../components/Login/LoginTabs";
import { Helmet } from "react-helmet";
import translations from "../../i18n/translations";
import { IntlProvider } from "react-intl";
import { ThemeProvider, createMuiTheme, StylesProvider } from "@material-ui/core/styles";
import themeData from "../../services/theme";
import { useDispatch } from "react-redux";
import { endTradeApiSession } from "../../store/actions/session";
import LoginHeader from "../../components/Login/LoginHeader";
import SignupForm from "../../components/Forms/SignupForm";

const SignupPage = () => {
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
            <title>Signup</title>
          </Helmet>
          <Box className="signupPage">
            <LoginHeader>
              <LoginTabs>
                <SignupForm />
              </LoginTabs>
            </LoginHeader>
            <Testimonials />
          </Box>
        </ThemeProvider>
      </StylesProvider>
    </IntlProvider>
  );
};

export default SignupPage;

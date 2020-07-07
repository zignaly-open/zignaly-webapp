import React from "react";
import { Box } from "@material-ui/core";
import "./signup.scss";
import Testimonials from "../../components/Testimonials";
import LoginTabs from "../../components/Login/LoginTabs";
import { Helmet } from "react-helmet";
import translations from "../../i18n/translations";
import { IntlProvider } from "react-intl";
import SignupForm from "../../components/Forms/SignupForm";
import LoginHeader from "../../components/Login/LoginHeader";

const SignupPage = () => {
  return (
    <IntlProvider locale="en" messages={translations.en}>
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
    </IntlProvider>
  );
};

export default SignupPage;

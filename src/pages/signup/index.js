import React from "react";
import { Box } from "@material-ui/core";
import "./signup.scss";
import Testimonials from "../../components/Testimonials";
import LoginTabs from "../../components/Login/LoginTabs";
import { Helmet } from "react-helmet";
import { useIntl } from "react-intl";
import LoginHeader from "../../components/Login/LoginHeader";
import SignupForm from "../../components/Forms/SignupForm";
import useRedirectUponSessionValid from "../../hooks/useRedirectUponSessionValid";

const SignupPage = () => {
  const intl = useIntl();
  useRedirectUponSessionValid("/profitSharing");

  return (
    <>
      <Helmet>
        <title>
          {`${intl.formatMessage({
            id: "signup.title",
          })} | ${intl.formatMessage({ id: "product" })}`}
        </title>
      </Helmet>
      <Box className="signupPage">
        <LoginHeader>
          <LoginTabs>
            <SignupForm />
          </LoginTabs>
        </LoginHeader>
        <Testimonials />
      </Box>
    </>
  );
};

export default SignupPage;

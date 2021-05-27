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
import useABTest from "hooks/useABTest";
import Login from "../../components/Login/Login";

const SignupPage = () => {
  const intl = useIntl();
  useRedirectUponSessionValid("/profitSharing");
  const showNew = useABTest();

  // if (showNew === null) {
  //   return null;
  // }
  return (
    <>
      <Helmet>
        <title>
          {`${intl.formatMessage({
            id: "action.signup",
          })} | ${intl.formatMessage({ id: "product" })}`}
        </title>
      </Helmet>
      {showNew || showNew === null ? (
        <Login>
          <LoginTabs>
            <SignupForm />
          </LoginTabs>
        </Login>
      ) : (
        <Box className="signupPage">
          <LoginHeader>
            <LoginTabs>
              <SignupForm />
            </LoginTabs>
          </LoginHeader>
          <Testimonials />
        </Box>
      )}
    </>
  );
};

export default SignupPage;

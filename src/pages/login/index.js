import React from "react";
import { Box } from "@material-ui/core";
import "./login.scss";
import Testimonials from "../../components/Testimonials";
import LoginTabs from "../../components/Login/LoginTabs";
import { Helmet } from "react-helmet";
import { useIntl } from "react-intl";
import LoginForm from "../../components/Forms/LoginForm";
import LoginHeader from "../../components/Login/LoginHeader";
import Login from "../../components/Login/Login";
import useRedirectUponSessionValid from "hooks/useRedirectUponSessionValid";
import useABTest from "hooks/useABTest";

const LoginPage = () => {
  const intl = useIntl();
  useRedirectUponSessionValid();
  const showNew = useABTest();

  if (showNew === null) {
    return null;
  }

  return (
    <>
      <Helmet>
        <title>
          {`${intl.formatMessage({
            id: "login.title",
          })} | ${intl.formatMessage({ id: "product" })}`}
        </title>
      </Helmet>
      {showNew ? (
        <Login>
          <LoginTabs>
            <LoginForm />
          </LoginTabs>
        </Login>
      ) : (
        <Box className="loginPageOld">
          <LoginHeader>
            <LoginTabs>
              <LoginForm />
            </LoginTabs>
          </LoginHeader>
          <Testimonials />
        </Box>
      )}
    </>
  );
};

export default LoginPage;

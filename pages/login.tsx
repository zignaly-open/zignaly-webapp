import React from "react";
import { Container } from "@mui/material";
import Head from "next/head";
import Login from "../legacy/components/Login/Login";
import LoginTabs from "../legacy/components/Login/LoginTabs";
import LoginForm from "../legacy/components/Forms/LoginForm";
import { PRODUCT_NAME } from "../utils/constants";
import { useIntl } from "react-intl";

const LoginPage = () => {
  const intl = useIntl();

  return (
    <Container maxWidth="lg">
      <Head>
        <title>{`${intl.formatMessage({ id: "action.login" })} | ${PRODUCT_NAME}`}</title>
      </Head>
      <Login>
        <LoginTabs>
          <LoginForm />
        </LoginTabs>
      </Login>
    </Container>
  );
};

export default LoginPage;

import React from "react";
import { Container } from "@mui/material";
import Head from "next/head";
import Login from "../src/components/Login/Login";
import LoginTabs from "../src/components/Login/LoginTabs";
import LoginForm from "../src/components/Forms/LoginForm";
import { PRODUCT_NAME } from "../lib/constants";
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

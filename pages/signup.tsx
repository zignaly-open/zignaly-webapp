import React from "react";
import { Container } from "@mui/material";
import Head from "next/head";
import Login from "../legacy/components/Login/Login";
import LoginTabs from "../legacy/components/Login/LoginTabs";
import SignupForm from "../legacy/components/Forms/SignupForm";
import { PRODUCT_NAME } from "../utils/constants";
import { useIntl } from "react-intl";

const Signup = () => {
  const intl = useIntl();

  return (
    <Container maxWidth="lg">
      <Head>
        <title>{`${intl.formatMessage({ id: "action.signup" })} | ${PRODUCT_NAME}`}</title>
      </Head>
      <Login>
        <LoginTabs>
          <SignupForm />
        </LoginTabs>
      </Login>
    </Container>
  );
};

export default Signup;

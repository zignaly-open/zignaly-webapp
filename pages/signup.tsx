import { Container } from "@mui/material";
import Head from "next/head";
import Login from "../src/components/Login/Login";
import LoginTabs from "../src/components/Login/LoginTabs";
import SignupForm from "../src/components/Forms/SignupForm";
import { PRODUCT_NAME } from "../lib/constants";
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

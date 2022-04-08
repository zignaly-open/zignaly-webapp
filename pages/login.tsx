import { Container } from "@mui/material";
import Head from "next/head";
import Login from "../src/components/Login/Login";
import LoginTabs from "../src/components/Login/LoginTabs";
import LoginForm from "../src/components/Forms/LoginForm";
import { PRODUCT_NAME } from "../lib/constants";
import { useIntl } from "react-intl";
import { useEffect } from "react";
import useStoreSessionSelector from "../src/hooks/useStoreSessionSelector";
import { verifySessionData } from "lib/auth";
import useRedirection from "lib/useRedirection";
import { useRouter } from "next/router";

const LoginPage = () => {
  const storeSession = useStoreSessionSelector();
  const token = storeSession.tradeApi.accessToken;
  const router = useRouter();
  const intl = useIntl();

  useEffect(() => {
    const sessionValid = verifySessionData(token, storeSession.sessionData);
    if (sessionValid) {
      router.push({
        pathname: "/",
      });
      console.log("session already valid, redirecting");
    }
  }, []);

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

import React, { useEffect } from "react";
import { Box } from "@material-ui/core";
import "./login.scss";
import Testimonials from "../../components/Testimonials";
import LoginTabs from "../../components/Login/LoginTabs";
import { Helmet } from "react-helmet";
import { useIntl } from "react-intl";
import { useDispatch } from "react-redux";
import { endTradeApiSession } from "../../store/actions/session";
import LoginForm from "../../components/Forms/LoginForm";
import LoginHeader from "../../components/Login/LoginHeader";
import { navigate } from "gatsby";
import { verifySessionData } from "../../utils/auth";
import useStoreSessionSelector from "../../hooks/useStoreSessionSelector";

const LoginPage = () => {
  const dispatch = useDispatch();
  const intl = useIntl();
  const storeSession = useStoreSessionSelector();

  const handleSession = () => {
    if (verifySessionData(storeSession.tradeApi.accessToken, storeSession.sessionData)) {
      navigate("/dashboard", { replace: true });
    } else {
      dispatch(endTradeApiSession());
    }
  };

  useEffect(handleSession, []);

  return (
    <>
      <Helmet>
        <title>
          {`${intl.formatMessage({
            id: "login.title",
          })} | ${intl.formatMessage({ id: "product" })}`}
        </title>
      </Helmet>
      <Box className="loginPage">
        <LoginHeader>
          <LoginTabs>
            <LoginForm />
          </LoginTabs>
        </LoginHeader>
        <Testimonials />
      </Box>
    </>
  );
};

export default LoginPage;

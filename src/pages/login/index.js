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

const LoginPage = () => {
  const dispatch = useDispatch();
  const intl = useIntl();

  const dispatchLogout = () => {
    dispatch(endTradeApiSession());
  };
  useEffect(dispatchLogout, []);

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

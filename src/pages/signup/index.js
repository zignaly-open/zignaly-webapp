import React, { useEffect } from "react";
import { Box } from "@material-ui/core";
import "./signup.scss";
import Testimonials from "../../components/Testimonials";
import LoginTabs from "../../components/Login/LoginTabs";
import { Helmet } from "react-helmet";
import { useIntl } from "react-intl";
import { useDispatch } from "react-redux";
import { endTradeApiSession } from "../../store/actions/session";
import LoginHeader from "../../components/Login/LoginHeader";
import SignupForm from "../../components/Forms/SignupForm";

const SignupPage = () => {
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
            id: "signup.title",
          })} | ${intl.formatMessage({ id: "product" })}`}
        </title>
      </Helmet>
      <Box className="signupPage" display="flex" flexDirection="column" alignItems="center">
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

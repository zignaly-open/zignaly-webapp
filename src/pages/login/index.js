import React from "react";
import { Box } from "@material-ui/core";
import "./login.scss";
import TwoFAForm from "../../components/Forms/TwoFAForm";
import Modal from "../../components/Modal";
import Logo from "../../images/logo/logoWhite.svg";
import Testimonials from "../../components/Testimonials";
import LoginTabs from "../../components/LoginTabs";
import Helmet from "react-helmet";

const LoginPage = () => {
  const show2FA = false;

  return (
    <>
      <Helmet>
        <title>Login</title>
      </Helmet>
      <Box className="loginPage">
        <Modal onClose={() => {}} persist={true} size="small" state={show2FA}>
          <TwoFAForm />
        </Modal>
        <Box
          className="loginHeader"
          display="flex"
          flexDirection="row"
          justifyContent="space-around"
        >
          <Box className="headerImage" />
          <Box
            alignItems="start"
            className="tagLineBox"
            display="flex"
            flexDirection="column"
            justifyContent="start"
          >
            <img alt="Zignaly" className="logo" src={Logo} />
            <span className="tagLine">What could a pro trader do with your crypto?</span>
            <span className="slogan">
              <b>Copy pro traders </b>and earn same profits as they do.{" "}
            </span>
          </Box>
          <LoginTabs />
        </Box>
        <Testimonials />
      </Box>
    </>
  );
};

export default LoginPage;

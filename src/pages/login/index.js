import React from "react";
import { Box } from "@material-ui/core";
import style from "./login.module.scss";
import TwoFAForm from "../../components/Forms/TwoFAForm";
import Modal from "../../components/Modal";
import Logo from "../../images/logo/logoWhite.svg";
import Testimonials from "../../components/Testimonials";
import LoginTabs from "../../components/LoginTabs";
import Helmet from "react-helmet";

const LoginPage = props => {
  const show2FA = false;

  return (
    <React.Fragment>
      <Helmet>
        <title>Login</title>
      </Helmet>
      <Box className={style.loginPage}>
        <Modal state={show2FA} size="small" persist={true}>
          <TwoFAForm />
        </Modal>
        <Box
          className={style.loginHeader}
          display="flex"
          flexDirection="row"
          justifyContent="space-around"
        >
          <Box className={style.headerImage}></Box>
          <Box
            className={style.tagLineBox}
            display="flex"
            flexDirection="column"
            justifyContent="start"
            alignItems="start"
          >
            <img className={style.logo} src={Logo} alt="Zignaly" />
            <span className={style.tagLine}>What could a pro trader do with your crypto?</span>
            <span className={style.slogan}>
              <b>Copy pro traders </b>and earn same profits as they do.{" "}
            </span>
          </Box>
          <LoginTabs />
        </Box>
        <Testimonials />
      </Box>
    </React.Fragment>
  );
};

export default LoginPage;

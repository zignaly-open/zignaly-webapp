import React, { useState } from 'react';
// import Helmet from 'react-helmet';
import { Box } from '@material-ui/core';
import '../styles/LoginPage.sass';
import TwoFAForm from '../components/Forms/TwoFAForm';
import Modal from '../components/Modal';
import Logo from '../images/zignaly_logo_white.svg';
import Testimonials from '../components/Testimonials';
import LoginTabs from '../components/LoginTabs';

const LoginPage = () => {
    const show2FA = false;

    return(
        <Box className="loginPage">
            <Modal state={show2FA} persist={true}>
                <TwoFAForm />
            </Modal>
            <Box className="login-header" display="flex" flexDirection="row" justifyContent="space-around">
                <Box className="header-image"></Box>
                <Box className="tagline-box" display="flex" flexDirection="column" justifyContent="start" alignItems="start">
                    <img className="logo" src={Logo} alt="Zignaly" />
                    <span className="tagline">What could a pro trader do with your crypto?</span>
                    <span className="slogan"><b>Copy pro traders </b>and earn same profits as they do. </span>
                </Box>
                <LoginTabs />
            </Box>
            <Testimonials />
        </Box>
    )
}

export default LoginPage;

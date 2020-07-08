import React, { useState, useEffect } from "react";
import "./recover.scss";
import { Box } from "@material-ui/core";
import ResetPasswordForm from "../../components/Forms/ResetPasswordForm";
import Logo from "../../images/logo/logoWhite.svg";
import tradeApi from "../../services/tradeApiClient";
import { Helmet } from "react-helmet";

/**
 * @typedef {Object} PositionPageProps
 * @property {string} code The position ID dynamic route path parameter.
 */

/**
 * Position detail page component.
 *
 * @param {PositionPageProps} props Component properties.
 * @returns {JSX.Element} Position page element.
 */
const RecoverPassword = ({ code }) => {
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);

  const verifyCode = () => {};

  useEffect(verifyCode, [code]);

  return (
    <Box
      className="recoverPasswordPage"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      <Helmet>
        <title>Zignaly | Recover Password</title>
      </Helmet>
      <img alt="Zignaly" className="logo" src={Logo} />
      <ResetPasswordForm />
    </Box>
  );
};

export default RecoverPassword;

import React, { useState, useEffect } from "react";
import "./recover.scss";
import { Box, CircularProgress, Typography } from "@material-ui/core";
import ResetPasswordForm from "../../components/Forms/ResetPasswordForm";
import Logo from "../../images/logo/logoWhite.svg";
import tradeApi from "../../services/tradeApiClient";
import { Helmet } from "react-helmet";
import { useDispatch } from "react-redux";
import { showErrorAlert } from "../../store/actions/ui";
import { FormattedMessage, useIntl } from "react-intl";
import Link from "../../components/LocalizedLink";

/**
 * @typedef {Object} PositionPageProps
 * @property {string} token The position ID dynamic route path parameter.
 */

/**
 * Position detail page component.
 *
 * @param {PositionPageProps} props Component properties.
 * @returns {JSX.Element} Position page element.
 */
const RecoverPassword = ({ token }) => {
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);
  const dispatch = useDispatch();
  const intl = useIntl();

  const verifyCode = () => {
    setLoading(true);
    const payload = {
      token: token,
    };
    tradeApi
      .forgotPasswordStep2(payload)
      .then(() => {
        setVerified(true);
        setLoading(false);
      })
      .catch((e) => {
        dispatch(showErrorAlert(e));
        setLoading(false);
      });
  };

  useEffect(verifyCode, [token]);

  return (
    <>
      <Helmet>
        <title>
          {`${intl.formatMessage({ id: "recover.title" })} | ${intl.formatMessage({
            id: "product",
          })}`}
        </title>
      </Helmet>
      <Box
        className="recoverPasswordPage"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        {loading ? (
          <CircularProgress color="primary" size={50} />
        ) : verified ? (
          <>
            <img alt="Zignaly" className="logo" src={Logo} />
            <ResetPasswordForm />
          </>
        ) : (
          <Box className="errorBox" display="flex" flexDirection="column" alignItems="center">
            <Typography variant="h3">
              <FormattedMessage id="recover.error" />
            </Typography>
            <Link to="/login" className="loginLink">
              Back to Login
            </Link>
          </Box>
        )}
      </Box>
    </>
  );
};

export default RecoverPassword;

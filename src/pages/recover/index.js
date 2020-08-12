import React, { useState, useEffect } from "react";
import "./recover.scss";
import { Box, CircularProgress, Typography } from "@material-ui/core";
import ResetPasswordForm from "../../components/Forms/ResetPasswordForm";
import Logo from "../../images/logo/logoWhite.png";
import tradeApi from "../../services/tradeApiClient";
import { Helmet } from "react-helmet";
import { useDispatch } from "react-redux";
import { showErrorAlert } from "../../store/actions/ui";
import { FormattedMessage, useIntl } from "react-intl";
import Link from "../../components/LocalizedLink";

/**
 * @typedef {Object} PositionPageProps
 * @property {string} token Token aquired by the recover request.
 */

/**
 * Recover Password page component.
 *
 * @param {PositionPageProps} props Component properties.
 * @returns {JSX.Element} Recover Password element.
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
        alignItems="center"
        className="recoverPasswordPage"
        display="flex"
        flexDirection="column"
        justifyContent="center"
      >
        {loading ? (
          <CircularProgress color="primary" size={50} />
        ) : verified ? (
          <>
            <img alt="Zignaly" className="logo" src={Logo} />
            <ResetPasswordForm setVerified={setVerified} token={token} />
          </>
        ) : (
          <Box alignItems="center" className="errorBox" display="flex" flexDirection="column">
            <Typography variant="h3">
              <FormattedMessage id="recover.error" />
            </Typography>
            <Link className="loginLink" to="/login">
              Back to Login
            </Link>
          </Box>
        )}
      </Box>
    </>
  );
};

export default RecoverPassword;

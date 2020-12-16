import React, { useState, useEffect } from "react";
import "./disable2FA.scss";
import { Box, CircularProgress, Typography } from "@material-ui/core";
import ConfirmTwoFADisableForm from "../../components/Forms/ConfirmTwoFADisableForm";
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
const Disable2FA = ({ token }) => {
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
      .disable2FAVisit(payload)
      .then(() => {
        setVerified(true);
        setLoading(false);
      })
      .catch((e) => {
        dispatch(showErrorAlert(e));
        setLoading(false);
        setVerified(false);
      });
  };

  useEffect(verifyCode, [token]);

  return (
    <>
      <Helmet>
        <title>
          {`${intl.formatMessage({ id: "security.2fa.disable" })} | ${intl.formatMessage({
            id: "product",
          })}`}
        </title>
      </Helmet>
      <Box
        alignItems="center"
        className="disable2FA"
        display="flex"
        flexDirection="column"
        justifyContent="center"
      >
        {loading ? (
          <CircularProgress color="primary" size={50} />
        ) : verified ? (
          <>
            <img alt="Zignaly" className="logo" src={Logo} />
            <ConfirmTwoFADisableForm setVerified={setVerified} token={token} />
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

export default Disable2FA;

import React, { useState, useEffect } from "react";
import "./changeEmail.scss";
import { Box, CircularProgress, Typography } from "@material-ui/core";
import Logo from "../../images/logo/logoNW.svg";
import tradeApi from "../../services/tradeApiClient";
import { Helmet } from "react-helmet";
import { useDispatch } from "react-redux";
import { showErrorAlert } from "../../store/actions/ui";
import { FormattedMessage, useIntl } from "react-intl";
import Link from "../../components/LocalizedLink";
import ChangeEmailForm from "components/Forms/ChangeEmailForm";

/**
 * @typedef {Object} PositionPageProps
 * @property {string} token Token aquired by the change email request.
 */

/**
 * Change Email page component.
 *
 * @param {PositionPageProps} props Component properties.
 * @returns {JSX.Element} Change email element.
 */
const ChangeEmail = ({ token }) => {
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
      .changeEmailVisit(payload)
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
          {`${intl.formatMessage({ id: "changeemail.title" })} | ${intl.formatMessage({
            id: "product",
          })}`}
        </title>
      </Helmet>
      <Box
        alignItems="center"
        className="changeEmailPage"
        display="flex"
        flexDirection="column"
        justifyContent="center"
      >
        {loading ? (
          <CircularProgress color="primary" size={50} />
        ) : verified ? (
          <>
            <img alt="Zignaly" className="logo" src={Logo} />
            <ChangeEmailForm setVerified={setVerified} token={token} />
          </>
        ) : (
          <Box alignItems="center" className="errorBox" display="flex" flexDirection="column">
            <Typography variant="h3">
              <FormattedMessage id="changeemail.error" />
            </Typography>
            <Link className="loginLink" to="/login">
              <FormattedMessage id="backtologin.text" />
            </Link>
          </Box>
        )}
      </Box>
    </>
  );
};

export default ChangeEmail;

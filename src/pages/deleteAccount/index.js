import React, { useState, useEffect } from "react";
import "./deleteAccount.scss";
import { Box, CircularProgress, Typography } from "@material-ui/core";
import ConfirmDeleteAccountForm from "../../components/Forms/ConfirmDeleteAccountForm";
import Logo from "../../images/logo/logoWhite.png";
import tradeApi from "../../services/tradeApiClient";
import { Helmet } from "react-helmet";
import { useDispatch } from "react-redux";
import { showErrorAlert } from "../../store/actions/ui";
import { FormattedMessage, useIntl } from "react-intl";
import Link from "../../components/LocalizedLink";

/**
 * @typedef {Object} PositionPageProps
 * @property {string} code Code required by the delete request.
 */

/**
 * Delete account page component.
 *
 * @param {PositionPageProps} props Component properties.
 * @returns {JSX.Element} JSX
 */
const DeleteAccount = ({ code }) => {
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);
  const dispatch = useDispatch();
  const intl = useIntl();

  const verifyCode = () => {
    setLoading(true);
    const payload = {
      code,
    };
    tradeApi
      .deleteAccountVisit(payload)
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

  useEffect(verifyCode, [code]);

  return (
    <>
      <Helmet>
        <title>
          {`${intl.formatMessage({ id: "deleteaccount.title" })} | ${intl.formatMessage({
            id: "product",
          })}`}
        </title>
      </Helmet>
      <Box
        alignItems="center"
        className="deleteAccount"
        display="flex"
        flexDirection="column"
        justifyContent="center"
      >
        {loading ? (
          <CircularProgress color="primary" size={50} />
        ) : verified ? (
          <>
            <img alt="Zignaly" className="logo" src={Logo} />
            <ConfirmDeleteAccountForm code={code} setVerified={setVerified} />
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

export default DeleteAccount;

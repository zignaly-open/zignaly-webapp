import React, { useState, useEffect } from "react";
import "./ResetForm.scss";
import { Box, CircularProgress, Typography } from "@material-ui/core";
import Logo from "images/logo/logoNW.svg";
import { useDispatch } from "react-redux";
import { showErrorAlert } from "store/actions/ui";
import { FormattedMessage } from "react-intl";
import Link from "components/LocalizedLink";

/**
 * @param {Object} props Props.
 * @param {string} props.code Reset Code.
 * @param {function} props.form Form component to embed.
 * @param {function(string): Promise<*>} props.verifyCode Method to verify code
 * @returns {JSX.Element} JSx component.
 */
const ResetForm = ({ code, form: Form, verifyCode }) => {
  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState(false);
  const dispatch = useDispatch();

  const verify = () => {
    verifyCode(code)
      .then(() => {
        setVerified(true);
      })
      .catch((e) => {
        dispatch(showErrorAlert(e));
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(verify, [code]);

  return (
    <Box
      alignItems="center"
      className="resetForm"
      display="flex"
      flexDirection="column"
      justifyContent="center"
    >
      {loading ? (
        <CircularProgress color="primary" size={50} />
      ) : !verified ? (
        <>
          <img alt="Zignaly" className="logo" src={Logo} />
          <Form code={code} setVerified={setVerified} />
        </>
      ) : (
        <Box alignItems="center" className="errorBox" display="flex" flexDirection="column">
          <Typography variant="h3">
            <FormattedMessage id="recover.error" />
          </Typography>
          <Link className="loginLink" to="/login">
            <FormattedMessage id="backtologin.text" />
          </Link>
        </Box>
      )}
    </Box>
  );
};

export default ResetForm;

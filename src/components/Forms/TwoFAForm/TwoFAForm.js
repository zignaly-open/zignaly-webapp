import React, { useState } from "react";
import "./TwoFAForm.scss";
import { Box, Typography, CircularProgress } from "@material-ui/core";
import ReactCodeInput from "react-verification-code-input";
import useStoreSessionSelector from "../../../hooks/useStoreSessionSelector";
import { useDispatch } from "react-redux";
import { authenticate2FA } from "../../../store/actions/session";

/**
 * @typedef {import('react').ChangeEvent} ChangeEvent
 * @typedef {import('react').KeyboardEvent} KeyboardEvent
 */

const TwoFAForm = () => {
  const [loading, setLoading] = useState(false);
  const [codeError, setCodeError] = useState(false);
  const storeSession = useStoreSessionSelector();
  const dispatch = useDispatch();

  /**
   * Function to submit form.
   *
   * @param {String} code
   * @returns {void}
   */
  const submitCode = (code) => {
    setLoading(true);
    const payload = {
      code: code,
      token: storeSession.tradeApi.accessToken,
    };
    dispatch(authenticate2FA(payload, setLoading));
  };

  return (
    <Box
      alignItems="center"
      className="twoFAForm"
      display="flex"
      flexDirection="column"
      justifyContent="center"
    >
      {loading && <CircularProgress color="primary" size={40} />}
      {!loading && (
        <>
          <Typography variant="h3">2 Factor Authentication</Typography>
          <Box
            alignItems="center"
            className="inputBox"
            display="flex"
            flexDirection="column"
            justifyContent="start"
          >
            <label className="customLabel">
              <Typography>Input Your Authentication Code</Typography>
            </label>
            {/*@ts-ignore */}
            <ReactCodeInput fields={6} className="code-input" onComplete={submitCode} />
            {codeError && <span className="error-text">Code must be of 6 digits!</span>}
            {codeError && <span className="errorText">Wrong code.</span>}
          </Box>
        </>
      )}
    </Box>
  );
};

export default TwoFAForm;

import React, { useState } from "react";
import "./TwoFAForm.scss";
import { Box, Typography, CircularProgress } from "@material-ui/core";
import ReactCodeInput from "react-verification-code-input";
import { useDispatch } from "react-redux";
import tradeApi from "../../../services/tradeApiClient";
import { showErrorAlert } from "../../../store/actions/ui";

/**
 * @typedef {import('react').ChangeEvent} ChangeEvent
 * @typedef {import('react').KeyboardEvent} KeyboardEvent
 * @typedef {import('../../../services/tradeApiClient.types').UserLoginResponse} UserLoginResponse
 */

/**
 * @typedef {Object} DefaultProps
 * @property {Function} onSuccess
 * @property {UserLoginResponse} data
 */

/**
 *
 * @param {DefaultProps} props
 */
const TwoFAForm = ({ onSuccess, data }) => {
  const [loading, setLoading] = useState(false);
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
      token: data.token,
    };
    tradeApi
      .verify2FA(payload)
      .then(() => {
        onSuccess();
      })
      .catch((e) => {
        dispatch(showErrorAlert(e));
      })
      .finally(() => {
        setLoading(false);
      });
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
          </Box>
        </>
      )}
    </Box>
  );
};

export default TwoFAForm;

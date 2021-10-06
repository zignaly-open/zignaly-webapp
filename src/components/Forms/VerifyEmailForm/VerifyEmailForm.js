import React, { useState } from "react";
import "./VerifyEmailForm.scss";
import { Box, Typography, CircularProgress } from "@material-ui/core";
import ReactCodeInput from "react-verification-code-input";
import { useDispatch } from "react-redux";
import tradeApi from "../../../services/tradeApiClient";
import { showErrorAlert } from "../../../store/actions/ui";
import { FormattedMessage } from "react-intl";

/**
 * @typedef {import('react').ChangeEvent} ChangeEvent
 * @typedef {import('react').KeyboardEvent} KeyboardEvent
 * @typedef {import('../../../services/tradeApiClient.types').LoginResponse} LoginResponse
 */

/**
 * @typedef {Object} DefaultProps
 * @property {Function} onComplete
 * @property {string} token
 */

/**
 *
 * @param {DefaultProps} props Default props.
 * @returns {JSX.Element} JSx component.
 */
const VerifyEmailForm = ({ token, onComplete }) => {
  const [verifying, setVerifying] = useState(false);
  const [done, setDone] = useState(false);
  const dispatch = useDispatch();

  /**
   * Function to submit code to backend.
   *
   * @param {String} code verification code.
   * @returns {void} None.
   */
  const submitCode = (code) => {
    setVerifying(true);

    const payload = {
      code,
      token,
      reason: "verify_email",
    };

    tradeApi
      .verifyCode(payload)
      .then(() => {
        setDone(true);
        onComplete();
      })
      .catch((e) => {
        dispatch(showErrorAlert(e));
      })
      .finally(() => {
        setVerifying(false);
      });
  };

  return (
    <Box
      alignItems="center"
      className="verifyEmailModal"
      display="flex"
      flexDirection="column"
      justifyContent="center"
    >
      {done ? (
        <CircularProgress color="primary" size={40} />
      ) : (
        <>
          <Box
            alignItems="center"
            className="verifyBox"
            display="flex"
            flexDirection="column"
            justifyContent="start"
          >
            <Typography align="center" variant="h3">
              <FormattedMessage id="signup.verify.title" />
            </Typography>
            <Typography align="center">
              <FormattedMessage id="signup.verify.description" />
            </Typography>
            <br />
            <label className="customLabel">
              <Typography>
                <FormattedMessage id="security.device.input" />
              </Typography>
            </label>
            {/* @ts-ignore */}
            <ReactCodeInput
              className="inputBox"
              fields={6}
              loading={verifying}
              onComplete={submitCode}
            />
          </Box>
        </>
      )}
    </Box>
  );
};

export default VerifyEmailForm;

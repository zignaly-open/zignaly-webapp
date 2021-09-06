import React, { useState } from "react";
import "./UnlockAccountForm.scss";
import { Box, Typography, CircularProgress } from "@material-ui/core";
import ReactCodeInput from "react-verification-code-input";
import { useDispatch } from "react-redux";
import tradeApi from "../../../services/tradeApiClient";
import { showErrorAlert, showSuccessAlert } from "../../../store/actions/ui";
import { FormattedMessage } from "react-intl";

/**
 * @typedef {import('react').ChangeEvent} ChangeEvent
 * @typedef {import('react').KeyboardEvent} KeyboardEvent
 * @typedef {import('../../../services/tradeApiClient.types').UserEntity} UserEntity
 */

/**
 * @typedef {Object} DefaultProps
 * @property {Function} [onComplete]
 * @property {boolean} [verifySessionCode] For login/signup, call verify2FA endpoint.
 * @property {UserEntity} data
 */

/**
 *
 * @param {DefaultProps} props Default props.
 * @returns {JSX.Element} JSx component.
 */
const UnlockAccountForm = ({ onComplete, token }) => {
  const [verifying, setVerifying] = useState(false);
  const dispatch = useDispatch();

  /**
   * Function to submit known device code to backend.
   *
   * @param {String} code verification code.
   * @returns {void} None.
   */
  const submitCode = (code) => {
    setVerifying(true);

    console.log(token);
    const payload = {
      code,
      token,
    };
    tradeApi
      .enableAccount(payload)
      .then(() => {
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
      className="twoFAForm"
      display="flex"
      flexDirection="column"
      justifyContent="center"
    >
      <Box
        alignItems="center"
        className="verifyBox"
        display="flex"
        flexDirection="column"
        justifyContent="start"
      >
        <Typography align="center" variant="h3">
          <FormattedMessage id="security.blocked.title" />
        </Typography>
        <Typography align="center">
          <FormattedMessage id="security.blocked.description" />
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
        <Box alignItems="center" className="linkBox" display="flex">
          {verifying && <CircularProgress className="spinner" color="primary" size={18} />}
        </Box>
      </Box>
    </Box>
  );
};

export default UnlockAccountForm;

import React, { useState } from "react";
import "./TwoFAForm.scss";
import { Box, Typography, CircularProgress } from "@material-ui/core";
import ReactCodeInput from "react-verification-code-input";
import { useDispatch } from "react-redux";
import tradeApi from "../../../services/tradeApiClient";
import { showErrorAlert, showSuccessAlert } from "../../../store/actions/ui";
import { FormattedMessage } from "react-intl";
import ResetTwoFAForm from "components/Forms/ResetTwoFAForm";

/**
 * @typedef {import('react').ChangeEvent} ChangeEvent
 * @typedef {import('react').KeyboardEvent} KeyboardEvent
 * @typedef {import('../../../services/tradeApiClient.types').LoginResponse} LoginResponse
 */

/**
 * @typedef {Object} DefaultProps
 * @property {Function} [onComplete]
 * @property {boolean} [verifySessionCode] For login/signup, call verify2FA endpoint.
 * @property {LoginResponse} data
 */

/**
 *
 * @param {DefaultProps} props Default props.
 * @returns {JSX.Element} JSx component.
 */
const TwoFAForm = ({ verifySessionCode = false, data, onComplete }) => {
  const [verifyingDevice, setVerifyingDevice] = useState(false);
  const [verifying2FA, setVerifying2FA] = useState(false);
  const [sendingCode, setSendingCode] = useState(false);
  const [resetTwoFAModal, showResetTwoFAModal] = useState(false);
  const [is2FAVerified, setIs2FAVerified] = useState(!data.ask2FA);
  const [isKnownDeviceVerified, setIsKnownDeviceVerified] = useState(
    !data.isUnknownDevice && !data.disabled,
  );
  const dispatch = useDispatch();

  /**
   * Function to submit code to backend.
   *
   * @param {String} code verification code.
   * @returns {void} None.
   */
  const submit2FACode = (code) => {
    if (!verifySessionCode) {
      onComplete(code);
      return;
    }

    setVerifying2FA(true);

    const payload = {
      code: code,
      token: data.token,
    };
    tradeApi
      .verify2FA(payload)
      .then(() => {
        setIs2FAVerified(true);
        if (isKnownDeviceVerified) {
          onComplete();
        }
      })
      .catch((e) => {
        dispatch(showErrorAlert(e));
      })
      .finally(() => {
        setVerifying2FA(false);
      });
  };

  /**
   * Function to submit known device code to backend.
   *
   * @param {String} code verification code.
   * @returns {void} None.
   */
  const submitKnownDeviceCode = (code) => {
    setVerifyingDevice(true);

    const payload = {
      code: code,
      token: data.token,
    };
    const method = data.disabled
      ? tradeApi.enableAccount(payload)
      : tradeApi.verifyKnownDevice(payload);

    method
      .then(() => {
        setIsKnownDeviceVerified(true);
        if (is2FAVerified) {
          onComplete();
        }
      })
      .catch((e) => {
        dispatch(showErrorAlert(e));
      })
      .finally(() => {
        setVerifyingDevice(false);
      });
  };

  const resendCode = () => {
    if (sendingCode) return;

    setSendingCode(true);
    tradeApi
      .resendKnownDeviceCode(data.token)
      .then(() => {
        dispatch(showSuccessAlert("", "security.device.resent"));
      })
      .catch((e) => {
        dispatch(showErrorAlert(e));
      })
      .finally(() => {
        setSendingCode(false);
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
      {resetTwoFAModal ? (
        <ResetTwoFAForm token={data.token} />
      ) : (
        <>
          {isKnownDeviceVerified && is2FAVerified && <CircularProgress color="primary" size={40} />}
          {!isKnownDeviceVerified && (
            <>
              <Box
                alignItems="center"
                className="verifyBox"
                display="flex"
                flexDirection="column"
                justifyContent="start"
              >
                {!data.disabled ? (
                  <Typography align="center" variant="h3">
                    <FormattedMessage id="security.device.title" />
                  </Typography>
                ) : (
                  <>
                    <Typography align="center" variant="h3">
                      <FormattedMessage id="security.blocked.title" />
                    </Typography>
                    <Typography align="center">
                      <FormattedMessage id="security.blocked.description" />
                    </Typography>
                    <br />
                  </>
                )}
                <label className="customLabel">
                  <Typography>
                    <FormattedMessage id="security.device.input" />
                  </Typography>
                </label>
                {/* @ts-ignore */}
                <ReactCodeInput
                  className="inputBox"
                  fields={6}
                  loading={verifyingDevice}
                  onComplete={submitKnownDeviceCode}
                />
                {!data.disabled && (
                  <Box alignItems="center" className="linkBox" display="flex">
                    <Typography className="link" onClick={resendCode}>
                      <FormattedMessage id="security.device.resend" />
                    </Typography>
                    {sendingCode && (
                      <CircularProgress className="spinner" color="primary" size={18} />
                    )}
                  </Box>
                )}
              </Box>
            </>
          )}
          {!is2FAVerified && (
            <>
              <Box
                alignItems="center"
                className="faBox"
                display="flex"
                flexDirection="column"
                justifyContent="start"
              >
                {!data.isUnknownDevice && (
                  <Typography variant="h3">
                    <FormattedMessage id="security.2fa.title" />
                  </Typography>
                )}
                <label className="customLabel">
                  <Typography>
                    <FormattedMessage id="security.2fa.input" />
                  </Typography>
                </label>
                {/* @ts-ignore */}
                <ReactCodeInput
                  autoFocus={!data.isUnknownDevice}
                  className="inputBox"
                  fields={6}
                  loading={verifying2FA}
                  onComplete={submit2FACode}
                />
              </Box>
              <Typography className="linkBox">
                <span className="link" onClick={() => showResetTwoFAModal(true)}>
                  <FormattedMessage id="security.2fa.unavailable" />
                </span>
              </Typography>
            </>
          )}
        </>
      )}
    </Box>
  );
};

export default TwoFAForm;

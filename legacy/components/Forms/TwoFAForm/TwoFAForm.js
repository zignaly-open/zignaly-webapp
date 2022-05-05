// @ts-nocheck
import React, { useState } from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import ReactCodeInput from "react-verification-code-input";
import { useDispatch, useSelector } from "react-redux";
// import tradeApi from "../../../services/tradeApiClient";
import { showErrorAlert, showSuccessAlert } from "lib/store/actions/ui";
import { FormattedMessage } from "react-intl";
import ResetTwoFAForm from "../../Forms/ResetTwoFAForm";
import useAPI from "../../../../lib/hooks/useAPI";
import useRedirection from "../../../../lib/hooks/useRedirection";

/**
 * @typedef {import('react').ChangeEvent} ChangeEvent
 * @typedef {import('react').KeyboardEvent} KeyboardEvent
 * @typedef {import('../../../services/tradeApiClient.types').LoginResponse} LoginResponse
 */

/**
 * @typedef {Object} AuthData
 * @property {boolean} isUnknownDevice
 * @property {boolean} disabled
 * @property {boolean} ask2FA
 * @property {string} token
 */

/**
 * @typedef {Object} DefaultProps
 * @property {Function} onComplete
 * @property {AuthData} [loginData]
 */

/**
 *
 * @param {DefaultProps} props Default props.
 * @returns {JSX.Element} JSx component.
 */
const TwoFAForm = ({ loginData, onComplete }) => {
  const [verifyingDevice, setVerifyingDevice] = useState(false);
  const [verifying2FA, setVerifying2FA] = useState(false);
  const [sendingCode, setSendingCode] = useState(false);
  const [resetTwoFAModal, showResetTwoFAModal] = useState(false);
  const [is2FAVerified, setIs2FAVerified] = useState(loginData && !loginData.ask2FA);
  const [isKnownDeviceVerified, setIsKnownDeviceVerified] = useState(
    !loginData || (!loginData.isUnknownDevice && !loginData.disabled),
  );
  const dispatch = useDispatch();
  const storeSession = useSelector((state) => state.session);
  const token = loginData?.token || storeSession.tradeApi.accessToken;
  const { verify2FA, verifyCode, verifyKnownDevice } = useAPI();
  const { redirectDashboard } = useRedirection();

  /**
   * Function to submit code to backend.
   *
   * @param {String} code verification code.
   * @returns {void} None.
   */
  const submit2FACode = (code) => {
    // Only call /user/verify_2fa during login
    if (!loginData) {
      onComplete(code);
      return;
    }

    setVerifying2FA(true);

    const payload = {
      code,
      token,
    };
    verify2FA(payload)
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
      token,
    };
    const method = loginData.disabled
      ? verifyCode({ reason: "enable_user", ...payload })
      : verifyKnownDevice(payload);

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
    const method = loginData.isUnknownDevice
      ? tradeApi.resendKnownDeviceCode(token)
      : tradeApi.resendCode({
          reason: "enable_user",
          token,
        });

    method
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
        <ResetTwoFAForm token={token} />
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
                {!loginData.disabled ? (
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
                <Box alignItems="center" className="linkBox" display="flex">
                  <Typography className="link" onClick={resendCode}>
                    <FormattedMessage id="security.device.resend" />
                  </Typography>
                  {sendingCode && (
                    <CircularProgress className="spinner" color="primary" size={18} />
                  )}
                </Box>
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
                {!loginData?.isUnknownDevice && (
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
                  autoFocus={!loginData || !loginData.isUnknownDevice}
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

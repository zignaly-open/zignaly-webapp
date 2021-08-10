import React, { useState } from "react";
import "./TwoFAForm.scss";
import { Box, Typography, CircularProgress } from "@material-ui/core";
import ReactCodeInput from "react-verification-code-input";
import { useDispatch } from "react-redux";
import tradeApi from "../../../services/tradeApiClient";
import { showErrorAlert } from "../../../store/actions/ui";
import Modal from "../../Modal";
import { FormattedMessage } from "react-intl";
import ResetTwoFAForm from "components/Forms/ResetTwoFAForm";

/**
 * @typedef {import('react').ChangeEvent} ChangeEvent
 * @typedef {import('react').KeyboardEvent} KeyboardEvent
 * @typedef {import('../../../services/tradeApiClient.types').UserEntity} UserEntity
 */

/**
 * @typedef {Object} DefaultProps
 * @property {Function} [onSuccess]
 * @property {Function} [onComplete]
 * @property {UserEntity} data
 */

/**
 *
 * @param {DefaultProps} props Default props.
 * @returns {JSX.Element} JSx component.
 */
const TwoFAForm = ({ onSuccess, data, onComplete }) => {
  const [loading, setLoading] = useState(false);
  const [resetTwoFAModal, showResetTwoFAModal] = useState(false);
  const dispatch = useDispatch();

  let is2FAVerified = false;
  let isKnownDeviceVerified = false;

  console.log(data);

  /**
   * Function to verify code.
   *
   * @param {String} code verification code.
   * @returns {void} None.
   */
  const verifyCode = (code) => {
    if (onComplete) {
      onComplete(code);
    } else {
      submitCode(code);
    }
  };

  /**
   * Function to verify known device code.
   *
   * @param {String} code verification code.
   * @returns {void} None.
   */
  const verifyKnownDeviceCode = (code) => {
    submitKnownDeviceCode(code);
  }

  /**
   * Function to submit code to backend.
   *
   * @param {String} code verification code.
   * @returns {void} None.
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
        is2FAVerified = true;
        if (! data.isUnknownDevice || isKnownDeviceVerified) {
          onSuccess();
        }
      })
      .catch((e) => {
        dispatch(showErrorAlert(e));
        setLoading(false);
      });
  };

  /**
   * Function to submit known device code to backend.
   *
   * @param {String} code verification code.
   * @returns {void} None.
   */
  const submitKnownDeviceCode = (code) => {
    setLoading(true);
    const payload = {
      code: code,
      token: data.token,
    };
    tradeApi
      .verifyKnownDevice(payload)
      .then(() => {
        isKnownDeviceVerified = true;
        if (is2FAVerified || data.ask2FA == false) {
          onSuccess();
        }
      })
      .catch((e) => {
        dispatch(showErrorAlert(e));
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
      <Modal onClose={() => showResetTwoFAModal(false)} size="small" state={resetTwoFAModal}>
        <ResetTwoFAForm token={data.token} />
      </Modal>
      {loading && <CircularProgress color="primary" size={40} />}
      {!loading && data.ask2FA && (
        <>
          <Box alignItems="center" display="flex" flexDirection="column" justifyContent="start">
            <Typography variant="h3">
              <FormattedMessage id="security.2fa.title" />
            </Typography>
            <label className="customLabel">
              <Typography>
                <FormattedMessage id="security.2fa.input" />
              </Typography>
            </label>
            {/* @ts-ignore */}
            <ReactCodeInput className="inputBox" fields={6} onComplete={verifyCode} />
          </Box>
          <Typography>
            <span className="link" onClick={() => showResetTwoFAModal(true)}>
              <FormattedMessage id="security.2fa.unavailable" />
            </span>
          </Typography>
        </>
      )}

      {!loading && data.isUnknownDevice && (
        <>
        <Box alignItems="center" display="flex" flexDirection="column" justifyContent="start">
          <Typography variant="h3">
            <FormattedMessage id="security.check_known_device.title" />
          </Typography>
          <label className="customLabel">
            <Typography>
              <FormattedMessage id="security.check_known_device.input" />
            </Typography>
          </label>
          {/* @ts-ignore */}
          <ReactCodeInput className="inputBox" fields={6} onComplete={verifyKnownDeviceCode} />
        </Box>
      </>
      )}
    </Box>
  );
};

export default TwoFAForm;

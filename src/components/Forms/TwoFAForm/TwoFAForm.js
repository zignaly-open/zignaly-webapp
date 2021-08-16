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
 * @property {Function} [onComplete]
 * @property {boolean} [verifySessionCode] For login/signup, call verify2FA endpoint.
 * @property {UserEntity} data
 */

/**
 *
 * @param {DefaultProps} props Default props.
 * @returns {JSX.Element} JSx component.
 */
const TwoFAForm = ({ verifySessionCode = false, data, onComplete }) => {
  const [loading, setLoading] = useState(false);
  const [resetTwoFAModal, showResetTwoFAModal] = useState(false);
  const [is2FAVerified, setIs2FAVerified] = useState(!data.ask2FA);
  const [isKnownDeviceVerified, setIsKnownDeviceVerified] = useState(!data.isUnknownDevice);
  const dispatch = useDispatch();

  /**
   * Function to submit code to backend.
   *
   * @param {String} code verification code.
   * @returns {void} None.
   */
  const submitCode = (code) => {
    if (!verifySessionCode) {
      onComplete(code);
      return;
    }

    if (isKnownDeviceVerified) {
      setLoading(true);
    }

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
    if (is2FAVerified) {
      setLoading(true);
    }

    const payload = {
      code: code,
      token: data.token,
    };
    tradeApi
      .verifyKnownDevice(payload)
      .then(() => {
        setIsKnownDeviceVerified(true);
        if (is2FAVerified) {
          onComplete();
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
            <ReactCodeInput className="inputBox" fields={6} onComplete={submitCode} />
          </Box>
          <Typography>
            <span className="link" onClick={() => showResetTwoFAModal(true)}>
              <FormattedMessage id="security.2fa.unavailable" />
            </span>
          </Typography>
        </>
      )}

      {!loading && data.isUnknownDevice && (
        <Box
          alignItems="center"
          className="unknownDeviceBox"
          display="flex"
          flexDirection="column"
          justifyContent="start"
        >
          <Typography variant="h3">
            <FormattedMessage id="security.device.title" />
          </Typography>
          <label className="customLabel">
            <Typography>
              <FormattedMessage id="security.device.input" />
            </Typography>
          </label>
          {/* @ts-ignore */}
          <ReactCodeInput className="inputBox" fields={6} onComplete={submitKnownDeviceCode} />
        </Box>
      )}
    </Box>
  );
};

export default TwoFAForm;

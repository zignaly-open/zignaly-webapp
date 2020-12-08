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
 * @property {Function} onSuccess
 * @property {UserEntity} data
 */

/**
 *
 * @param {DefaultProps} props Default props.
 * @returns {JSX.Element} JSx component.
 */
const TwoFAForm = ({ onSuccess, data }) => {
  const [loading, setLoading] = useState(false);
  const [resetTwoFAModal, showResetTwoFAModal] = useState(false);
  const dispatch = useDispatch();

  /**
   * Function to submit form.
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
        onSuccess();
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
        <ResetTwoFAForm onSuccess={onSuccess} />
      </Modal>
      {loading && <CircularProgress color="primary" size={40} />}
      {!loading && (
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
    </Box>
  );
};

export default TwoFAForm;

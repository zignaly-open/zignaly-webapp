import React, { useState } from "react";
import "./ResetTwoFAForm.scss";
import { OutlinedInput, Box, Typography, CircularProgress } from "@material-ui/core";
import ReactCodeInput from "react-verification-code-input";
import { useDispatch } from "react-redux";
import tradeApi from "../../../services/tradeApiClient";
import { showErrorAlert } from "../../../store/actions/ui";
import { FormattedMessage, useIntl } from "react-intl";
import CustomButton from "components/CustomButton";
import { Alert } from "@material-ui/lab";
import { useForm } from "react-hook-form";

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
const ResetTwoFAForm = ({ onSuccess, data }) => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const intl = useIntl();
  const { handleSubmit, register, errors, setError } = useForm();

  /**
   * Function to submit form.
   *
   * @param {{key: string}} data Form data
   * @returns {void}
   */
  const onSubmit = (data) => {
    setLoading(true);
    const { key } = data;
    const payload = {
      key,
    };
    tradeApi
      .verify2FA(payload)
      .then(() => {
        onSuccess();
      })
      .catch((e) => {
        if (e.code === 72) {
          setError("key", {
            type: "manual",
            message: intl.formatMessage({ id: "form.error.apikey.error" }),
          });
        } else {
          dispatch(showErrorAlert(e));
        }
      });
  };

  return (
    <Box
      alignItems="center"
      className="resetTwoFAForm"
      display="flex"
      flexDirection="column"
      justifyContent="center"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box alignItems="center" display="flex" flexDirection="column" justifyContent="start">
          <Typography variant="h3">
            <FormattedMessage id="security.2fa.disable" />
          </Typography>
          <Alert severity="info">
            <FormattedMessage id="security.2fa.disable.desc" />
          </Alert>
          <label className="customLabel">
            <Typography>
              <FormattedMessage id="signalp.settings.apikey" />
            </Typography>
          </label>
          <OutlinedInput
            fullWidth={true}
            inputRef={register({
              required: intl.formatMessage({ id: "form.error.apikey" }),
            })}
            name="key"
            className="customInput"
          />
          {errors.key && <span className="errorText">{errors.key.message}</span>}
          <CustomButton className="submitButton" type="submit" loading={loading}>
            <FormattedMessage id="security.2fa.disable" />
          </CustomButton>
        </Box>
      </form>
    </Box>
  );
};

export default ResetTwoFAForm;

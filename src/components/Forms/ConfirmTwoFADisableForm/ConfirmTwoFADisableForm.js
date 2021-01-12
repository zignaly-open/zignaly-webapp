import React, { useState } from "react";
import "./ConfirmTwoFADisableForm.scss";
import { Box, OutlinedInput, Typography } from "@material-ui/core";
import CustomButton from "../../CustomButton/CustomButton";
import { useForm } from "react-hook-form";
import tradeApi from "../../../services/tradeApiClient";
import { useDispatch } from "react-redux";
import { showSuccessAlert, showErrorAlert } from "../../../store/actions/ui";
import { navigate } from "gatsby";
import { FormattedMessage, useIntl } from "react-intl";

/**
 * @typedef {Object} PositionPageProps
 * @property {string} code Token aquired by the recover request.
 * @property {React.SetStateAction<*>} setVerified
 */

/**
 * Reset 2FA form component.
 *
 * @param {PositionPageProps} props Component properties.
 * @returns {JSX.Element} Reset Password element.
 */
const ConfirmTwoFADisableForm = ({ code, setVerified }) => {
  const [loading, setLoading] = useState(false);
  const { errors, handleSubmit, register, setError } = useForm();
  const dispatch = useDispatch();
  const intl = useIntl();

  /**
   * @typedef {Object} DataObject
   * @property {String} apiKey
   */

  /**
   * Data returned at form submition.
   *
   * @param {DataObject} data form data received by the submit method.
   * @returns {void}
   */
  const onSubmit = (data) => {
    const { apiKey } = data;
    setLoading(true);
    const payload = {
      token: code,
      apiKey,
    };

    tradeApi
      .disable2FAConfirm(payload)
      .then(() => {
        dispatch(showSuccessAlert("", "security.2fa.disable.success"));
        navigate("/login");
      })
      .catch((e) => {
        if (e.code === 91) {
          setError("apiKey", {
            type: "manual",
            message: intl.formatMessage({ id: "form.error.apikey.error" }),
          });
        } else if (e.code === 48) {
          setVerified(false);
        } else {
          dispatch(showErrorAlert(e));
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <form method="post" onSubmit={handleSubmit(onSubmit)}>
      <Box
        alignItems="center"
        className="confirmTwoFADisableForm"
        display="flex"
        flexDirection="column"
        justifyContent="center"
      >
        <Typography variant="h3">
          <FormattedMessage id="security.2fa.disable" />
        </Typography>
        <label className="customLabel">
          <Typography>
            <FormattedMessage id="security.2fa.reset.api" />
          </Typography>
        </label>
        <OutlinedInput
          className="customInput"
          fullWidth={true}
          inputRef={register({
            required: intl.formatMessage({ id: "form.error.apikey" }),
          })}
          name="apiKey"
          placeholder={intl.formatMessage({ id: "signalp.settings.apikey" })}
        />
        {errors.apiKey && <span className="errorText">{errors.apiKey.message}</span>}
        <CustomButton className="submitButton" loading={loading} type="submit">
          <FormattedMessage id="security.2fa.disable" />
        </CustomButton>
      </Box>
    </form>
  );
};

export default ConfirmTwoFADisableForm;

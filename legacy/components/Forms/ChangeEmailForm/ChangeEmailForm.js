import React, { useState } from "react";
import { Box, TextField, Typography } from "@mui/material";
import CustomButton from "../../CustomButton/CustomButton";
import { useForm } from "react-hook-form";
import tradeApi from "../../../services/tradeApiClient";
import { useDispatch } from "react-redux";
import { showSuccessAlert, showErrorAlert } from "../../../store/actions/ui";
import { navigate } from "gatsby";
import { FormattedMessage, useIntl } from "react-intl";
import { emailRegex } from "legacy/utils/validators";

/**
 * @typedef {Object} PositionPageProps
 * @property {string} code Token aquired by the recover request.
 */

/**
 * Reset Password form component.
 *
 * @param {PositionPageProps} props Component properties.
 * @returns {JSX.Element} Reset Password element.
 */
const ChangeEmailForm = ({ code }) => {
  const [loading, setLoading] = useState(false);
  const [emailsDoNotMatch, setEmailsDoNotMatch] = useState(false);
  const intl = useIntl();
  const { errors, handleSubmit, register } = useForm({
    mode: "onChange",
  });
  const dispatch = useDispatch();

  /**
   * @typedef {Object} DataObject
   * @property {String} confirmNewEmail
   * @property {String} newEmail
   */

  /**
   * Data returned at form submition.
   *
   * @param {DataObject} data form data received by the submit method.
   * @returns {void}
   */
  const onSubmit = (data) => {
    if (data.confirmNewEmail === data.newEmail) {
      setLoading(true);
      const payload = {
        token: code,
        email: data.newEmail,
      };
      tradeApi
        .changeEmailConfirm(payload)
        .then(() => {
          dispatch(showSuccessAlert("", "alert.changeemail.confirm.body"));
          navigate("/login");
        })
        .catch((e) => {
          dispatch(showErrorAlert(e));
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setEmailsDoNotMatch(true);
    }
  };

  /**
   * Handle submit buttton click.
   *
   * @type {React.MouseEventHandler} handleClickSubmit
   * @returns {void}
   */
  const handleSubmitClick = () => {
    handleSubmit(onSubmit);
  };

  return (
    <form method="post" onSubmit={handleSubmit(onSubmit)}>
      <Box
        alignItems="center"
        className="resetPasswordForm"
        display="flex"
        flexDirection="column"
        justifyContent="center"
      >
        <Typography variant="h3">
          <FormattedMessage id="changeemail.form.title" />
        </Typography>

        <Box
          alignItems="start"
          className="inputBox"
          display="flex"
          flexDirection="column"
          justifyContent="start"
        >
          <label className="customLabel">
            <FormattedMessage id="security.newemail" />
          </label>

          <TextField
            className="customInput"
            error={!!errors.newEmail}
            fullWidth
            inputRef={register({
              required: intl.formatMessage({ id: "security.email.error.empty" }),
              pattern: {
                value: emailRegex,
                message: intl.formatMessage({ id: "security.email.error.invalid" }),
              },
            })}
            name="newEmail"
            onBlur={() => setEmailsDoNotMatch(false)}
            onPaste={(e) => e.preventDefault()}
            type="email"
            variant="outlined"
          />
          {errors.newEmail && <span className="errorText">{errors.newEmail.message}</span>}
        </Box>

        <Box
          alignItems="start"
          className="inputBox"
          display="flex"
          flexDirection="column"
          justifyContent="start"
        >
          <label className="customLabel">
            <FormattedMessage id="security.confirmnewemail" />
          </label>

          <TextField
            className="customInput"
            error={!!errors.newEmail}
            fullWidth
            inputRef={register({
              required: intl.formatMessage({ id: "security.email.error.empty" }),
              pattern: {
                value: emailRegex,
                message: intl.formatMessage({ id: "security.email.error.invalid" }),
              },
            })}
            name="confirmNewEmail"
            onBlur={() => setEmailsDoNotMatch(false)}
            onPaste={(e) => e.preventDefault()}
            type="email"
            variant="outlined"
          />
          {errors.confirmNewEmail && (
            <span className="errorText">{errors.confirmNewEmail.message}</span>
          )}

          {emailsDoNotMatch && (
            <span className="errorText">
              <FormattedMessage id="security.email.match.error" />
            </span>
          )}
        </Box>

        <Box className="inputBox">
          <CustomButton
            className={"full submitButton"}
            loading={loading}
            onClick={handleSubmitClick}
            type="submit"
          >
            <FormattedMessage id="action.changeemail" />
          </CustomButton>
        </Box>
      </Box>
    </form>
  );
};

export default ChangeEmailForm;

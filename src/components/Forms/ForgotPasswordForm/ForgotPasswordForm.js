import React, { useState, useRef } from "react";
import "./ForgotPasswordForm.scss";
import { Box, TextField, Typography } from "@material-ui/core";
import CustomButton from "../../CustomButton/CustomButton";
import { useForm } from "react-hook-form";
import tradeApi from "../../../services/tradeApiClient";
import { useDispatch } from "react-redux";
import { showErrorAlert, showSuccessAlert } from "../../../store/actions/ui";
import { FormattedMessage } from "react-intl";
import Captcha from "../../Captcha";
import { emailRegex } from "utils/validators";

const ForgotPasswordForm = () => {
  const [loading, setLoading] = useState(false);
  const [gRecaptchaResponse, setCaptchaResponse] = useState("");
  const recaptchaRef = useRef(null);
  const { errors, handleSubmit, register } = useForm();
  const dispatch = useDispatch();

  /**
   * @typedef {Object} FormData
   * @property {string} email
   */

  /**
   * Function to submit form.
   *
   * @param {FormData} data Form data.
   * @returns {void}
   */
  const onSubmit = (data) => {
    setLoading(true);
    const payload = {
      email: data.email,
      array: true,
      gRecaptchaResponse,
    };
    tradeApi
      .forgotPasswordStep1(payload)
      .then(() => {
        dispatch(
          showSuccessAlert("alert.forgotpassword.step1.title", "alert.forgotpassword.step1.body"),
        );
      })
      .catch((e) => {
        dispatch(showErrorAlert(e));
      })
      .finally(() => {
        setLoading(false);
      });
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
        className="forgotPasswordForm"
        display="flex"
        flexDirection="column"
        justifyContent="center"
      >
        <Typography variant="h3">
          <FormattedMessage id="forgotPassword.title" />
        </Typography>
        <Box
          alignItems="start"
          className="inputBox"
          display="flex"
          flexDirection="column"
          justifyContent="start"
        >
          <label className="customLabel">
            <FormattedMessage id="forgotPassword.subtitle" />
          </label>
          <TextField
            className="customInput"
            error={errors.email}
            fullWidth
            inputRef={register({
              required: true,
              pattern: emailRegex,
            })}
            name="email"
            type="email"
            variant="outlined"
          />
          {errors.email && (
            <span className="errorText">
              <FormattedMessage id="security.email.error.invalid" />
            </span>
          )}
        </Box>

        <Box className="captchaBox">
          <Captcha onChange={setCaptchaResponse} recaptchaRef={recaptchaRef} />
        </Box>

        <Box className="inputBox">
          <CustomButton
            className={"full submitButton"}
            loading={loading}
            onClick={handleSubmitClick}
            type="submit"
          >
            <FormattedMessage id="action.recover" />
          </CustomButton>
        </Box>
      </Box>
    </form>
  );
};

export default ForgotPasswordForm;

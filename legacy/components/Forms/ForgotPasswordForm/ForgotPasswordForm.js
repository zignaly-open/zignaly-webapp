import React, { useState } from "react";
import { Box, TextField, Typography } from "@mui/material";
import CustomButton from "../../CustomButton/CustomButton";
import { useForm } from "react-hook-form";
// import tradeApi from "../../src/services/tradeApiClient";
import { useDispatch } from "react-redux";
import { showErrorAlert, showSuccessAlert } from "store/actions/ui";
import { FormattedMessage } from "react-intl";
import { emailRegex } from "legacy/utils/validators";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

const ForgotPasswordForm = () => {
  const [loading, setLoading] = useState(false);
  const { errors, handleSubmit, register } = useForm();
  const dispatch = useDispatch();
  const { executeRecaptcha } = useGoogleReCaptcha();
  // const captchaFallback = useRef(null);

  /**
   * @typedef {Object} FormData
   * @property {string} email
   * @property {string} [gRecaptchaResponse] Captcha token fallback
   */

  /**
   * Function to submit form.
   *
   * @param {FormData} data Form data.
   * @returns {Promise<void>} Promise.
   */
  const onSubmit = async (data) => {
    setLoading(true);
    let gRecaptchaResponse = data.gRecaptchaResponse || "";
    let c = 2;
    if (process.env.NODE_ENV === "production" && !gRecaptchaResponse) {
      gRecaptchaResponse = await executeRecaptcha("forgotPassword");
      c = 3;
    }
    const payload = {
      email: data.email,
      array: true,
      gRecaptchaResponse,
      c,
    };

    // todo
    // tradeApi
    //   .forgotPasswordStep1(payload)
    //   .then(() => {
    //     dispatch(
    //       dispatch(
    //         showSuccessAlert("alert.forgotpassword.step1.title", "alert.forgotpassword.step1.body"),
    //       ),
    //     );
    //   })
    //   .catch((e) => {
    //     dispatch(showErrorAlert(e));
    //   })
    //   .finally(() => {
    //     setLoading(false);
    //   });
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

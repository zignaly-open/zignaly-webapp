import React, { useState, useRef } from "react";
import "./LoginForm.scss";
import { Box, TextField } from "@material-ui/core";
import CustomButton from "../../CustomButton/CustomButton";
import Modal from "../../Modal";
import ForgotPasswordForm from "../ForgotPasswordForm";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { startTradeApiSession } from "../../../store/actions/session";
import Captcha from "../../Captcha";
import PasswordInput from "../../Passwords/PasswordInput";
import { FormattedMessage } from "react-intl";

/**
 * @typedef {import("../../../store/initialState").DefaultState} DefaultStateType
 * @typedef {import("../../../store/initialState").DefaultStateSession} StateSessionType
 */

const LoginForm = () => {
  const dispatch = useDispatch();
  const [modal, showModal] = useState(false);
  const [loading, showLoading] = useState(false);
  const [gRecaptchaResponse, setCaptchaResponse] = useState("");
  const recaptchaRef = useRef(null);

  const { handleSubmit, errors, register } = useForm({
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  /**
   * @typedef {Object} LoginFormSubmission
   * @property {string} email
   * @property {string} password
   */

  /**
   * Process data submitted in the login form.
   *
   * @param {LoginFormSubmission} data Submission data.
   * @returns {Void} None.
   */
  const onSubmit = (data) => {
    showLoading(true);
    dispatch(startTradeApiSession({ ...data, gRecaptchaResponse }));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box
        alignItems="center"
        className="loginForm"
        display="flex"
        flexDirection="column"
        justifyContent="center"
      >
        <Modal onClose={() => showModal(false)} persist={false} size="small" state={modal}>
          <ForgotPasswordForm />
        </Modal>
        <Box
          alignItems="start"
          className="inputBox"
          display="flex"
          flexDirection="column"
          justifyContent="start"
        >
          <label className="customLabel">Email address</label>
          <TextField
            className="customInput"
            error={!!errors.email}
            fullWidth
            inputRef={register({
              required: true,
              pattern: {
                value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/,
                message: "Email should be valid",
              },
            })}
            name="email"
            type="email"
            variant="outlined"
          />
          {errors.email && <span className="errorText">{errors.email.message}</span>}
        </Box>

        <Box
          alignItems="start"
          className="inputBox"
          display="flex"
          flexDirection="column"
          justifyContent="start"
        >
          <PasswordInput
            error={!!errors.password}
            inputRef={register({ required: "Password cannot be empty" })}
            label={<FormattedMessage id={"security.password"} />}
            name="password"
          />
          {errors.password && <span className="errorText">{errors.password.message}</span>}
        </Box>

        <Box className="captchaBox">
          <Captcha onChange={setCaptchaResponse} recaptchaRef={recaptchaRef} />
        </Box>

        <Box className="inputBox">
          <CustomButton className={"full submitButton"} loading={loading} type="submit">
            Sign in
          </CustomButton>
        </Box>
        <Box alignItems="center" display="flex" flexDirection="column" justifyContent="center">
          <span className="link" onClick={() => showModal(true)}>
            Forgot password
          </span>
        </Box>
      </Box>
    </form>
  );
};

export default LoginForm;

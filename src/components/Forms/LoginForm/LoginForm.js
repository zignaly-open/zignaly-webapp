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
import { FormattedMessage, useIntl } from "react-intl";
import TwoFAForm from "../../../components/Forms/TwoFAForm";
import { showErrorAlert } from "../../../store/actions/ui";
import tradeApi from "../../../services/tradeApiClient";
import useHasMounted from "../../../hooks/useHasMounted";

/**
 * @typedef {import("../../../store/initialState").DefaultState} DefaultStateType
 * @typedef {import("../../../store/initialState").DefaultStateSession} StateSessionType
 * @typedef {import("../../../services/tradeApiClient.types").UserEntity} UserEntity
 *
 */

const LoginForm = () => {
  const dispatch = useDispatch();
  const [forgotModal, showForgotModal] = useState(false);
  const [twoFAModal, showTwoFAModal] = useState(false);
  const [loginResponse, setLoginResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [gRecaptchaResponse, setCaptchaResponse] = useState("");
  const recaptchaRef = useRef(null);
  const intl = useIntl();
  const { handleSubmit, errors, register } = useForm({
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  const hasMounted = useHasMounted();
  if (!hasMounted) {
    // Don't render form statically
    return null;
  }

  /**
   *
   * @param {UserEntity} response User login response.
   * @returns {void} None.
   */
  const check2FA = (response) => {
    if (response.ask2FA) {
      showTwoFAModal(true);
    } else {
      dispatch(startTradeApiSession(response));
    }
  };

  const onSuccess = () => {
    dispatch(startTradeApiSession(loginResponse));
  };

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
    setLoading(true);
    tradeApi
      .userLogin({ ...data, gRecaptchaResponse })
      .then((response) => {
        setLoginResponse(response);
        check2FA(response);
      })
      .catch((e) => {
        dispatch(showErrorAlert(e));
      })
      .finally(() => {
        // setLoading(false);
      });
  };

  return (
    <>
      <Modal
        onClose={() => showForgotModal(false)}
        persist={false}
        size="small"
        state={forgotModal}
      >
        <ForgotPasswordForm />
      </Modal>
      <Modal onClose={() => showTwoFAModal(false)} persist={false} size="small" state={twoFAModal}>
        <TwoFAForm data={loginResponse} onSuccess={onSuccess} />
      </Modal>
      <form id="loginForm" method="post" onSubmit={handleSubmit(onSubmit)}>
        <Box
          alignItems="center"
          className="loginForm"
          display="flex"
          flexDirection="column"
          justifyContent="center"
        >
          <Box
            alignItems="start"
            className="inputBox"
            display="flex"
            flexDirection="column"
            justifyContent="start"
          >
            <label className="customLabel">
              <FormattedMessage id="security.email" />
            </label>
            <TextField
              className="customInput"
              error={!!errors.email}
              fullWidth
              inputRef={register({
                required: intl.formatMessage({ id: "security.email.error.empty" }),
                pattern: {
                  value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/,
                  message: intl.formatMessage({ id: "security.email.error.invalid" }),
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
              inputRef={register({
                required: intl.formatMessage({ id: "security.password.error.empty" }),
              })}
              label={<FormattedMessage id={"security.password"} />}
              name="password"
            />
            {errors.password && <span className="errorText">{errors.password.message}</span>}
          </Box>

          <Box className="captchaBox">
            <Captcha onChange={setCaptchaResponse} recaptchaRef={recaptchaRef} />
          </Box>

          <Box className="inputBox">
            <CustomButton
              className={"full submitButton"}
              form="loginForm"
              loading={loading}
              type="submit"
            >
              <FormattedMessage id="action.login" />
            </CustomButton>
          </Box>
          <Box alignItems="center" display="flex" flexDirection="column" justifyContent="center">
            <span className="link" onClick={() => showForgotModal(true)}>
              <FormattedMessage id="action.forgot" />
            </span>
          </Box>
        </Box>
      </form>
    </>
  );
};

export default LoginForm;

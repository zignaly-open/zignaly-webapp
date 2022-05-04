import React, { useState, useRef } from "react";
import { Box, TextField } from "@mui/material";
import CustomButton from "../../CustomButton/CustomButton";
import Modal from "../../Modal";
import ForgotPasswordForm from "../ForgotPasswordForm";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import PasswordInput from "../../Passwords/PasswordInput";
import { FormattedMessage, useIntl } from "react-intl";
import TwoFAForm from "../TwoFAForm";
import { showErrorAlert } from "store/actions/ui";
import useHasMounted from "../../../hooks/useHasMounted";
import { emailRegex } from "legacy/utils/validators";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import CaptchaTerms from "../../Captcha/CaptchaTerms";
import VerifyEmailForm from "../VerifyEmailForm";
// import Captcha from "../../Captcha";
import useAPI from "lib/hooks/useAPI";
import { useSession } from "lib/session";

const LoginForm = () => {
  const dispatch = useDispatch();
  const [forgotModal, showForgotModal] = useState(false);
  const [verifyEmailModal, showVerifyEmailModal] = useState(false);
  const [twoFAModal, showTwoFAModal] = useState(false);
  const [loginResponse, setLoginResponse] = useState(/** @type {LoginRes} */ (null));
  const [loading, setLoading] = useState(false);
  const intl = useIntl();
  // const { handleSubmit, errors, register } = useForm({});
  const {
    formState: { errors },
    register,
    handleSubmit,
  } = useForm({
    // defaultValues: {
    //   firstName: "",
    //   lastName: "",
    //   checkbox: [],
    //   radio: "",
    // },
    mode: "onBlur",
    reValidateMode: "onChange",
  });
  const { executeRecaptcha } = useGoogleReCaptcha();
  const captchaFallback = useRef(null);
  const isCheckly =
    typeof window !== "undefined" && window.navigator.userAgent.toLowerCase().includes("checkly");
  const { login } = useAPI();
  const { startSession } = useSession();

  const hasMounted = useHasMounted();
  if (!hasMounted) {
    // Don't render form statically
    return null;
  }

  /**
   *
   * @param {LoginResponse} response User login response.
   * @returns {void} None.
   */
  const check2FA = (response) => {
    if (response.emailUnconfirmed) {
      showVerifyEmailModal(true);
    } else if (response.ask2FA || response.isUnknownDevice || response.disabled) {
      showTwoFAModal(true);
      setLoading(false);
    } else {
      onSuccess(response);
    }
  };

  /**
   *
   * @param {LoginResponse} response User login response.
   * @returns {void} None.
   */
  const onSuccess = (response) => {
    // dispatch(startTradeApiSession(loginResponse, "login"));
    // const res = await getSession(loginResponse.token);
    // dispatch(setSessionData(res));
    startSession(response.token, "login");
    // redirectDashboard();
  };

  /**
   * @typedef {Object} LoginFormSubmission
   * @property {string} email
   * @property {string} password
   * @property {string} [gRecaptchaResponse] Captcha token fallback
   */

  /**
   * Process data submitted in the login form.
   *
   * @param {LoginFormSubmission} data Submission data.
   * @returns {Promise<Void>} None.
   */
  const onSubmit = async (data) => {
    setLoading(true);
    let gRecaptchaResponse = data.gRecaptchaResponse || "";
    let c = 2;
    if (!isCheckly && process.env.NODE_ENV === "production" && !gRecaptchaResponse) {
      gRecaptchaResponse = await executeRecaptcha("login");
      c = 3;
    }
    login({ ...data, gRecaptchaResponse, c })
      .then((response) => {
        setLoginResponse(response);
        check2FA(response);
        captchaFallback.current = null;
      })
      .catch((e) => {
        // if (e.code === 76) {
        //   // Use old captcha as fallback
        //   captchaFallback.current = (/** @type {string} */ captcha) =>
        //     onSubmit({ ...data, gRecaptchaResponse: captcha });
        // } else {
        dispatch(showErrorAlert(e));
        // }
        setLoading(false);
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
        <TwoFAForm loginData={loginResponse} onComplete={() => onSuccess(loginResponse)} />
      </Modal>
      <Modal
        onClose={() => {}}
        persist={true}
        showCloseIcon={false}
        size="small"
        state={verifyEmailModal}
      >
        <VerifyEmailForm onComplete={onSuccess} token={loginResponse?.token} />
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
              {...register("email", {
                required: intl.formatMessage({ id: "security.email.error.empty" }),
                pattern: {
                  value: emailRegex,
                  message: intl.formatMessage({ id: "security.email.error.invalid" }),
                },
              })}
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
              {...register("password", {
                required: intl.formatMessage({ id: "security.password.error.empty" }),
              })}
              label={<FormattedMessage id={"security.password"} />}
            />
            {errors.password && <span className="errorText">{errors.password.message}</span>}
          </Box>
          {/* <Captcha onSuccess={captchaFallback.current} /> */}
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
      <CaptchaTerms />
    </>
  );
};

export default LoginForm;

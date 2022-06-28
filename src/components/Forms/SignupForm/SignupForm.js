import React, { useState, useRef } from "react";
import "./SignupForm.scss";
import { Box, TextField, Checkbox, Typography } from "@material-ui/core";
import CustomButton from "../../CustomButton/CustomButton";
import { useForm, Controller } from "react-hook-form";
import Passwords from "../../Passwords";
import { projectId } from "../../../utils/defaultConfigs";
import { useDispatch } from "react-redux";
import { FormattedMessage, useIntl } from "react-intl";
import useHasMounted from "../../../hooks/useHasMounted";
import { emailRegex } from "utils/validators";
import useStoreSettingsSelector from "hooks/useStoreSettingsSelector";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import CaptchaTerms from "components/Captcha/CaptchaTerms";
// import Captcha from "../../Captcha";
import { showErrorAlert } from "store/actions/ui";
import tradeApi from "services/tradeApiClient";
import { startTradeApiSession } from "store/actions/session";
import Modal from "../../Modal";
import VerifyEmailForm from "../VerifyEmailForm";
import { setUserId } from "store/actions/user";

const SignupForm = () => {
  const [loading, setLoading] = useState(false);
  const { locale } = useStoreSettingsSelector();
  const [ref] = useState("");
  const formMethods = useForm();
  const { errors, handleSubmit, register, clearErrors, control } = formMethods;
  const dispatch = useDispatch();
  const hasMounted = useHasMounted();
  const intl = useIntl();
  const { executeRecaptcha } = useGoogleReCaptcha();
  const captchaFallback = useRef(null);
  const isCheckly =
    typeof window !== "undefined" && window.navigator.userAgent.toLowerCase().includes("checkly");
  const [loginResponse, setLoginResponse] = useState(null);

  if (!hasMounted) {
    // Don't render form statically
    return null;
  }

  /**
   *
   * @typedef {Object} DataObject
   * @property {String} password
   * @property {String} email
   * @property {string} [gRecaptchaResponse] Captcha token fallback
   */

  /**
   *
   * @param {DataObject} data Data object received byt submitting the form.
   * @returns {Promise<void>} None.
   */
  const onSubmit = async (data) => {
    setLoading(true);
    let gRecaptchaResponse = data.gRecaptchaResponse || "";
    let c = 2;
    if (!isCheckly && process.env.NODE_ENV === "production" && !gRecaptchaResponse) {
      gRecaptchaResponse = await executeRecaptcha("signup");
      c = 3;
    }
    const payload = {
      projectId: projectId,
      email: data.email,
      password: data.password,
      ref: ref,
      array: true,
      locale,
      gRecaptchaResponse,
      c,
    };

    tradeApi
      .userRegister(payload)
      .then((response) => {
        // Store userId for tracking purposes
        dispatch(setUserId(response.userId));
        // Store login response and show verification modal
        setLoginResponse(response);
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

  const onVerified = () => {
    dispatch(startTradeApiSession(loginResponse, "signup"));
  };

  return (
    <>
      <form method="post" noValidate onSubmit={handleSubmit(onSubmit)}>
        {/* <Captcha onSuccess={captchaFallback.current} /> */}
        <Modal
          onClose={() => {}}
          persist={true}
          showCloseIcon={false}
          size="small"
          state={Boolean(loginResponse)}
        >
          <VerifyEmailForm onComplete={onVerified} token={loginResponse?.token} />
        </Modal>
        <Box
          alignItems="center"
          className="signupForm"
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
                  value: emailRegex,
                  message: intl.formatMessage({ id: "security.email.error.invalid" }),
                },
              })}
              name="email"
              type="email"
              variant="outlined"
            />
            {errors.email && <span className="errorText">{errors.email.message}</span>}
          </Box>

          <Passwords edit={false} formMethods={formMethods} />

          <Box marginBottom={3}>
            <Typography style={{ fontSize: "13px" }}>
              <FormattedMessage
                id="signup.termsAgreement"
                values={{
                  terms: (
                    <a
                      className="link"
                      href="https://zignaly.com/legal/terms"
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      <b>
                        <FormattedMessage id="signup.terms" />
                      </b>
                    </a>
                  ),
                  privacy: (
                    <a
                      className="link"
                      href="https://zignaly.com/legal/privacy"
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      <b>
                        <FormattedMessage id="signup.privacy" />
                      </b>
                    </a>
                  ),
                }}
              />
            </Typography>
          </Box>

          <Box className="inputBox buttonBox">
            <CustomButton className={"full submitButton"} loading={loading} type="submit">
              <FormattedMessage id="action.signup" />
            </CustomButton>
          </Box>
        </Box>
      </form>
      <CaptchaTerms />
    </>
  );
};

export default SignupForm;

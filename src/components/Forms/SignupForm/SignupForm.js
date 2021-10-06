import React, { useState, useRef } from "react";
import "./SignupForm.scss";
import { Box, TextField, Checkbox } from "@material-ui/core";
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
   * @property {String} repeatPassword
   * @property {String} firstName
   * @property {String} email
   * @property {Boolean} subscribe
   * @property {Boolean} terms
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
      firstName: data.firstName,
      email: data.email,
      password: data.password,
      subscribe: data.subscribe,
      ref: ref,
      array: true,
      terms: data.terms,
      locale,
      gRecaptchaResponse,
      c,
    };

    tradeApi
      .userRegister(payload)
      .then((response) => {
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
          showCloseIcon={false}
          persist={true}
          size="small"
          state={Boolean(loginResponse)}
        >
          <VerifyEmailForm token={loginResponse?.token} onComplete={onVerified} />
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
              <FormattedMessage id="security.name" />
            </label>
            <TextField
              className="customInput"
              error={!!errors.firstName}
              fullWidth
              inputRef={register({
                required: intl.formatMessage({ id: "form.error.firstname" }),
                minLength: {
                  value: 3,
                  message: intl.formatMessage({ id: "form.error.firstname.length" }),
                },
              })}
              name="firstName"
              type="text"
              variant="outlined"
            />
            {errors.firstName && <span className="errorText">{errors.firstName.message}</span>}
          </Box>
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

          <Box className="inputBox checkbox">
            <Box alignItems="center" display="flex" flexDirection="row" justifyContent="start">
              <Checkbox
                className="checkboxInput"
                defaultChecked={true}
                inputRef={register({ required: true })}
                name="terms"
                onChange={() => clearErrors("terms")}
              />
              <Box
                className={"termsBox " + (errors.terms ? " error" : "")}
                display="flex"
                flexDirection="row"
                flexWrap="wrap"
                justifyContent="start"
              >
                <FormattedMessage
                  id="signup.agreement"
                  values={{
                    terms: (
                      <a
                        className="link"
                        href="https://zignaly.com/legal/terms"
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        <FormattedMessage id="signup.terms" />
                      </a>
                    ),
                    privacy: (
                      <a
                        className="link"
                        href="https://zignaly.com/legal/privacy"
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        <FormattedMessage id="signup.privacy" />
                      </a>
                    ),
                  }}
                />
              </Box>
            </Box>
          </Box>

          <Box className="inputBox checkbox">
            <Box alignItems="center" display="flex" flexDirection="row" justifyContent="start">
              <Controller
                control={control}
                defaultValue={true}
                name="subscribe"
                render={({ onChange, value }) => (
                  <Checkbox
                    checked={value}
                    className="checkboxInput"
                    onChange={(e) => onChange(e.target.checked)}
                  />
                )}
              />
              <span className="termsText">Subscribe to notifications</span>
            </Box>
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

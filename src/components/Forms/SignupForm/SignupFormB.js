import React, { useState, useRef, useMemo } from "react";
import "./SignupFormB.scss";
import { Box, Typography, OutlinedInput, InputAdornment } from "@material-ui/core";
import CustomButton from "../../CustomButton/CustomButton";
import { useForm } from "react-hook-form";
import PasswordsSignup from "../../Passwords/PasswordsSignup";
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
import { MailOutlined, LockSharp } from "@material-ui/icons";
import Link from "../../LocalizedLink";
import useABTest from "hooks/useABTest";
import Mailcheck from "react-mailcheck";

const SignupForm = () => {
  const [loading, setLoading] = useState(false);
  const { locale } = useStoreSettingsSelector();
  const formMethods = useForm();
  const { errors, handleSubmit, register, watch } = formMethods;
  const dispatch = useDispatch();
  const hasMounted = useHasMounted();
  const intl = useIntl();
  const { executeRecaptcha } = useGoogleReCaptcha();
  const captchaFallback = useRef(null);
  const isCheckly =
    typeof window !== "undefined" && window.navigator.userAgent.toLowerCase().includes("checkly");
  const [loginResponse, setLoginResponse] = useState(null);
  const newPageAB = useABTest();
  const email = watch("email");
  const ref = new URLSearchParams(
    typeof window !== "undefined" ? window.location.search : null,
  ).get("invite");

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
      ref,
      array: true,
      locale,
      gRecaptchaResponse,
      c,
      newPageAB,
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
      <Box className="loginTabs">
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
            <Box className="headerText">
              <Typography className="headerText">
                <FormattedMessage
                  id="signup.header.text1"
                  values={{ u: (/** @type {string} **/ chunks) => <u>{chunks}</u> }}
                />
              </Typography>
            </Box>
            <Box
              alignItems="start"
              className="inputBox"
              display="flex"
              flexDirection="column"
              justifyContent="start"
            >
              <OutlinedInput
                startAdornment={
                  <InputAdornment position="start">
                    <MailOutlined />
                  </InputAdornment>
                }
                placeholder="Email Address"
                className="customInput emailInput "
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
              />
              {errors.email && <span className="errorText">{errors.email.message}</span>}
              <Mailcheck email={email}>
                {(suggested) =>
                  suggested && (
                    <span className="errorText">
                      <FormattedMessage
                        id="signup.email.didyoumean"
                        values={{ suggested: suggested.full }}
                      />
                    </span>
                  )
                }
              </Mailcheck>
              <Box mt="24px">
                <PasswordsSignup edit={false} formMethods={formMethods} />
              </Box>
              <Box mt="49px" mb="8px" textAlign="center">
                <Typography style={{ fontSize: "11px" }}>
                  <FormattedMessage
                    id="signup.termsAgreement2"
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
              <Box className="buttonBox">
                <CustomButton className={"full submitButton"} loading={loading} type="submit">
                  <FormattedMessage id="action.signup" />
                </CustomButton>
              </Box>
            </Box>
            <Box className="padlockTextContainer">
              <LockSharp />
              <Typography className="padlockText">
                <FormattedMessage id="signup.padlock.message" />
              </Typography>
            </Box>
            <Typography style={{ fontSize: "13px" }}>
              <FormattedMessage
                id="signup.text.already.account"
                values={{
                  login: (
                    <Link to={"/login"} className="link">
                      <b>
                        <FormattedMessage id="login.title" />
                      </b>
                    </Link>
                  ),
                }}
              />
            </Typography>
            <CaptchaTerms />
          </Box>
        </form>
      </Box>
    </>
  );
};

export default SignupForm;

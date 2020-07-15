import React from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { useDispatch } from "react-redux";
import { showErrorAlert } from "../../store/actions/ui";

/**
 * @typedef {import('react-google-recaptcha').ReCAPTCHAProps['onChange']} OnChange
 */

/**
 * @typedef {Object} CaptchaPropTypes
 * @property {OnChange} onChange Captcha response callback
 * @property {React.MutableRefObject<any>} recaptchaRef Captcha ref
 */

/**
 * Provides a captcha.
 *
 * @param {CaptchaPropTypes} props Component properties.
 * @returns {JSX.Element} Component JSX.
 */
const Captcha = ({ onChange, recaptchaRef }) => {
  const dispatch = useDispatch();

  const onExpiredReCAPTCHA = () => {
    dispatch(
      showErrorAlert("Your solution to the ReCAPTCHA has expired, please resolve it again."),
    );
    onChange("");
  };

  const onErroredReCAPTCHA = () => {
    // Prevent alerts on non production builds, ReCaptcha is not allowed for localhost.
    if (process.env.GATSBY_BUILD_MODE === "production") {
      dispatch(
        showErrorAlert(
          "Something went wrong with the ReCAPTCHA, try to reload the page if you can't signup.",
        ),
      );
      onChange("");
    }
  };

  return (
    <ReCAPTCHA
      onChange={onChange}
      onErrored={onErroredReCAPTCHA}
      onExpired={onExpiredReCAPTCHA}
      ref={recaptchaRef}
      sitekey="6LdORtMUAAAAAGLmbf3TM8plIRorVCEc9pVChix8"
    />
  );
};

export default Captcha;

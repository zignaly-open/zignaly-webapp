import React, { useRef, useEffect, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { useDispatch } from "react-redux";
import { showErrorAlert } from "../../store/actions/ui";
import { Modal } from "@material-ui/core";

/**
 * @typedef {Object} CaptchaPropTypes
 * @property {(*)} onSuccess Captcha response callback
 */

/**
 * Provides a captcha.
 *
 * @param {CaptchaPropTypes} props Component properties.
 * @returns {JSX.Element} Component JSX.
 */
const Captcha = ({ onSuccess }) => {
  const [open, setOpen] = useState(Boolean(onSuccess));
  const dispatch = useDispatch();
  const recaptchaRef = useRef(null);

  useEffect(() => {
    if (onSuccess) {
      setOpen(true);
    }
  }, [onSuccess]);

  const onExpiredReCAPTCHA = () => {
    dispatch(
      showErrorAlert("Your solution to the ReCAPTCHA has expired, please resolve it again."),
    );
  };

  const onErroredReCAPTCHA = () => {
    // Prevent alerts on non production builds, ReCaptcha is not allowed for localhost.
    if (process.env.GATSBY_BUILD_MODE === "production") {
      dispatch(
        showErrorAlert(
          "Something went wrong with the ReCAPTCHA, try to reload the page if you can't signup.",
        ),
      );
    }
  };

  if (typeof window !== "undefined") {
    // Use recaptcha.net to avoid blocked domain
    // @ts-ignore
    window.recaptchaOptions = {
      useRecaptchaNet: true,
    };
  }

  /**
   * @param {string} token Captcha
   * @returns {void}
   */
  const onChange = (token) => {
    setOpen(false);
    onSuccess(token);
  };

  if (!open) {
    return null;
  }

  return (
    <Modal
      open={true}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <ReCAPTCHA
        onChange={onChange}
        onErrored={onErroredReCAPTCHA}
        onExpired={onExpiredReCAPTCHA}
        ref={recaptchaRef}
        sitekey="6LdORtMUAAAAAGLmbf3TM8plIRorVCEc9pVChix8"
      />
    </Modal>
  );
};

export default Captcha;

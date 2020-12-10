import React, { useState, useRef } from "react";
import "./ResetPasswordForm.scss";
import {
  Box,
  InputAdornment,
  IconButton,
  FormControl,
  OutlinedInput,
  Popper,
  Typography,
} from "@material-ui/core";
import CustomButton from "../../CustomButton/CustomButton";
import { validatePassword } from "../../../utils/validators";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import PasswordStrength from "../../Passwords/PasswordStrength";
import { useForm } from "react-hook-form";
import tradeApi from "../../../services/tradeApiClient";
import { useDispatch } from "react-redux";
import { showSuccessAlert, showErrorAlert } from "../../../store/actions/ui";
import { navigate } from "gatsby";
import { FormattedMessage } from "react-intl";
import Captcha from "../../Captcha";

/**
 * @typedef {Object} PositionPageProps
 * @property {string} token Token aquired by the recover request.
 * @property {React.SetStateAction<*>} setVerified
 */

/**
 * Reset Password form component.
 *
 * @param {PositionPageProps} props Component properties.
 * @returns {JSX.Element} Reset Password element.
 */
const RequestResetTwoFAForm = ({ token, setVerified }) => {
  const [anchorEl, setAnchorEl] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const [passwordDoNotMatch, setPasswordDoNotMatch] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);
  const [strength, setStrength] = useState(0);
  const [gRecaptchaResponse, setCaptchaResponse] = useState("");
  const recaptchaRef = useRef(null);
  const { errors, handleSubmit, register, clearErrors, setError } = useForm();
  const dispatch = useDispatch();

  /**
   * Main password change state handling.
   *
   * @param {React.ChangeEvent} event Observed event.
   * @return {void}
   */

  const handlePasswordChange = (event) => {
    setPasswordDoNotMatch(false);
    const targetElement = /** @type {HTMLInputElement} */ (event.target);
    let howStrong = validatePassword(targetElement.value);
    setStrength(howStrong);
    if (howStrong >= 4) {
      clearErrors("password");
    } else {
      setError("password", { type: "notStrong", message: "The password is weak." });
    }
  };

  /**
   * Main password change state handling.
   *
   * @param {React.ChangeEvent} event Observed event.
   * @return {void}
   */

  const handleRepeatPasswordChange = (event) => {
    setPasswordDoNotMatch(false);
    const targetElement = /** @type {HTMLInputElement} */ (event.target);
    let howStrong = validatePassword(targetElement.value);
    setStrength(howStrong);
    if (howStrong >= 4) {
      clearErrors("repeatPassword");
    } else {
      setError("repeatPassword", {
        type: "notStrong",
        message: "The repeat password is very weak.",
      });
    }
  };

  /**
   * @typedef {Object} DataObject
   * @property {String} password
   * @property {String} repeatPassword
   */

  /**
   * Data returned at form submition.
   *
   * @param {DataObject} data form data received by the submit method.
   * @returns {void}
   */
  const onSubmit = (data) => {
    setLoading(true);
    const payload = {
      token: storeSession.tradeApi.accessToken,
    };
    tradeApi
      .disable2FARequest(payload)
      .then(() => {
        onSuccess();
      })
      .catch((e) => {
        if (e.code === 72) {
          setError("key", {
            type: "manual",
            message: intl.formatMessage({ id: "form.error.apikey.error" }),
          });
        } else {
          dispatch(showErrorAlert(e));
        }
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
        className="resetPasswordForm"
        display="flex"
        flexDirection="column"
        justifyContent="center"
      >
        <Typography variant="h3">Reset Password</Typography>
        <Alert severity="info">
          <FormattedMessage id="security.2fa.disable.desc" />
          <FormattedMessage id="security.2fa.disable.support" />
        </Alert>
        <label className="customLabel">
          <Typography>
            <FormattedMessage id="signalp.settings.apikey" />
          </Typography>
        </label>
        <OutlinedInput
          fullWidth={true}
          inputRef={register({
            required: intl.formatMessage({ id: "form.error.apikey" }),
          })}
          name="key"
          className="customInput"
        />
        {errors.key && <span className="errorText">{errors.key.message}</span>}
        <CustomButton className="submitButton" type="submit" loading={loading}>
          <FormattedMessage id="security.2fa.disable" />
        </CustomButton>
      </Box>
    </form>
  );
};

export default RequestResetTwoFAForm;

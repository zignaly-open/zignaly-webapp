import React, { useState } from "react";
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
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

/**
 * @typedef {Object} PositionPageProps
 * @property {string} code Token aquired by the recover request.
 * @property {React.SetStateAction<*>} setExpired
 */

/**
 * Reset Password form component.
 *
 * @param {PositionPageProps} props Component properties.
 * @returns {JSX.Element} Reset Password element.
 */
const ResetPasswordForm = ({ code, setExpired }) => {
  const [anchorEl, setAnchorEl] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [strength, setStrength] = useState(0);
  const { executeRecaptcha } = useGoogleReCaptcha();
  const { errors, handleSubmit, register, clearErrors, setError } = useForm();
  const dispatch = useDispatch();
  // const captchaFallback = useRef(null);

  /**
   * Main password change state handling.
   *
   * @param {React.ChangeEvent} event Observed event.
   * @return {void}
   */

  const handlePasswordChange = (event) => {
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
   * @typedef {Object} DataObject
   * @property {String} password
   * @property {string} [gRecaptchaResponse] Captcha token fallback
   */

  /**
   * Data returned at form submition.
   *
   * @param {DataObject} data form data received by the submit method.
   * @returns {Promise<void>} Promise
   */
  const onSubmit = async (data) => {
    setLoading(true);
    let gRecaptchaResponse = data.gRecaptchaResponse || "";
    let c = 2;
    if (process.env.NODE_ENV === "production" && !gRecaptchaResponse) {
      gRecaptchaResponse = await executeRecaptcha("resetPassword");
      c = 3;
    }
    const payload = {
      token: code,
      password: data.password,
      gRecaptchaResponse,
      c,
    };
    tradeApi
      .forgotPasswordStep3(payload)
      .then(() => {
        dispatch(
          showSuccessAlert("alert.forgotpassword.step1.title", "alert.forgotpassword.step3.body"),
        );
        navigate("/login");
      })
      .catch((e) => {
        // if (e.code === 76) {
        //   // Use old captcha as fallback
        //   captchaFallback.current = (/** @type {string} */ captcha) =>
        //     onSubmit({ ...data, gRecaptchaResponse: captcha });
        // } else
        if (e.code === 48) {
          setExpired(false);
        } else {
          dispatch(showErrorAlert(e));
        }
      })
      .finally(() => {
        setLoading(false);
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
        <Popper
          anchorEl={anchorEl}
          className="passwordStrengthBox"
          open={!!anchorEl}
          placement="left"
          transition
        >
          <PasswordStrength onClose={() => setAnchorEl(undefined)} strength={strength} />
        </Popper>
        <Box
          alignItems="start"
          className="inputBox"
          display="flex"
          flexDirection="column"
          justifyContent="start"
        >
          <label className="customLabel">New Password</label>
          <FormControl className="customInput" variant="outlined">
            <OutlinedInput
              endAdornment={
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              }
              error={!!errors.password}
              inputRef={register({ required: true })}
              name="password"
              onBlur={() => setAnchorEl(undefined)}
              onChange={handlePasswordChange}
              onFocus={(e) => setAnchorEl(e.currentTarget)}
              type={showPassword ? "text" : "password"}
            />
          </FormControl>
        </Box>

        <Box className="inputBox">
          <CustomButton
            className={"full submitButton"}
            loading={loading}
            onClick={handleSubmitClick}
            type="submit"
          >
            <FormattedMessage id="action.reset" />
          </CustomButton>
        </Box>
      </Box>
    </form>
  );
};

export default ResetPasswordForm;

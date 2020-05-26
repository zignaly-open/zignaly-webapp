import React, { useState } from "react";
import "./ResetPasswordForm.scss";
import {
  Box,
  InputAdornment,
  IconButton,
  FormControl,
  OutlinedInput,
  Popper,
} from "@material-ui/core";
import CustomButton from "../../CustomButton/CustomButton";
import { validatePassword } from "../../../utils/validators";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import PasswordStrength from "../../PasswordStrength";
import { useForm } from "react-hook-form";

const ResetPasswordForm = () => {
  const [anchorEl, setAnchorEl] = useState(undefined);
  const [loading] = useState(false);
  const [passwordDoNotMatch, setPasswordDoNotMatch] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);
  const [strength, setStrength] = useState(0);
  const { errors, handleSubmit, register, clearError, setError } = useForm();

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
      clearError("password");
    } else {
      setError("password", "notStrong", "The password is weak.");
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
      clearError("repeatPassword");
    } else {
      setError("repeatPassword", "notStrong", "The repeat password is very weak.");
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
    if (data.password === data.repeatPassword) {
      setPasswordDoNotMatch(false);
    } else {
      setPasswordDoNotMatch(true);
    }
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
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box
        alignItems="center"
        className="resetPasswordForm"
        display="flex"
        flexDirection="column"
        justifyContent="center"
      >
        <h3>Reset Password From</h3>
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
              onFocus={(e) => setAnchorEl(e.currentTarget)}
              onBlur={() => setAnchorEl(undefined)}
              onChange={handlePasswordChange}
              type={showPassword ? "text" : "password"}
            />
          </FormControl>
        </Box>

        <Box
          alignItems="start"
          className="inputBox"
          display="flex"
          flexDirection="column"
          justifyContent="start"
        >
          <label className="customLabel">Repeat Password</label>
          <FormControl className="customInput" variant="outlined">
            <OutlinedInput
              endAdornment={
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowRepeatPassword(!showRepeatPassword)}>
                    {showRepeatPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              }
              error={!!errors.repeatPassword}
              inputRef={register({ required: true })}
              name="repeatPassword"
              onChange={handleRepeatPasswordChange}
              type={showRepeatPassword ? "text" : "password"}
            />
          </FormControl>
          {passwordDoNotMatch && <span className="errorText">Passwords do not match</span>}
        </Box>

        <Box className="inputBox">
          <CustomButton
            className={"full submitButton"}
            loading={loading}
            onClick={handleSubmitClick}
            type="submit"
          >
            Sign in
          </CustomButton>
        </Box>
      </Box>
    </form>
  );
};

export default ResetPasswordForm;

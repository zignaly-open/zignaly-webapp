import React, { Component, useState } from "react";
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
  const [loading, setLoading] = useState(false);
  const [passwordDoNotMatch, setPasswordDoNotMatch] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);
  const [strength, setStrength] = useState(0);
  const { errors, handleSubmit, register, clearError } = useForm();

  /**
   * @typedef {import('react').ChangeEvent} ChangeEvent
   */

  /**
   * Main password change state handling.
   *
   * @param {ChangeEvent} event Observed event.
   * @return {void}
   */

  const handlePasswordChange = (event) => {
    setPasswordDoNotMatch(false);
    setAnchorEl(event.currentTarget);
    const targetElement = /** @type {HTMLInputElement} */ (event.target);
    let howStrong = validatePassword(targetElement.value);
    setStrength(howStrong);
    howStrong >= 4 ? clearError("password") : setError("password");
  };

  /**
   * Main password change state handling.
   *
   * @param {ChangeEvent} event Observed event.
   * @return {void}
   */

  const handleRepeatPasswordChange = (event) => {
    setPasswordDoNotMatch(false);
    const targetElement = /** @type {HTMLInputElement} */ (event.target);
    let howStrong = validatePassword(targetElement.value);
    setStrength(howStrong);
    howStrong >= 4 ? clearError("repeatPassword") : setError("repeatPassword");
  };

  /**
   *
   * @typedef {Object} DataObject
   * @property {String} password
   * @property {String} repeatPassword
   */

  /**
   * Data returned at form submition.
   *
   * @param {DataObject} data
   */
  const onSubmit = (data) => {
    if (data.password === data.repeatPassword) {
    } else {
      setPasswordDoNotMatch(true);
    }
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
              inputRef={register(required)}
              name="password"
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
              inputRef={register(required)}
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
            onClick={handleSubmit}
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

import React, { useState, useRef } from "react";
import "./SignupForm.scss";
import {
  Box,
  TextField,
  Checkbox,
  InputAdornment,
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
import Captcha from "../../Captcha";

const SignupForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [, setPasswordDoNotMatch] = useState(true);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);
  const [anchorEl, setAnchorEl] = useState(undefined);
  const [passwordDoNotMatch] = useState(false);
  const [strength, setStrength] = useState(0);
  const [loading] = useState(false);
  const [, setCaptchaResponse] = useState("");
  const recaptchaRef = useRef(null);
  const { errors, handleSubmit, register, setError, clearError } = useForm();

  /**
   * @typedef {import('react').ChangeEvent} ChangeEvent
   */

  /**
   * Main password change state handling.
   *
   * @param {ChangeEvent} e Observed event.
   * @return {void}
   */
  const handlePasswordChange = (e) => {
    setPasswordDoNotMatch(false);
    const targetElement = /** @type {HTMLInputElement} */ (e.target);
    let howStrong = validatePassword(targetElement.value);
    setStrength(howStrong);
    if (strength >= 4) {
      clearError("password");
    } else {
      setError("password", "The password is fragile.");
    }
  };

  /**
   * Repeat password change state handling.
   *
   * @param {ChangeEvent} e Change event.
   * @return {void}
   */
  const handleRepeatPasswordChange = (e) => {
    setPasswordDoNotMatch(false);
    const targetElement = /** @type {HTMLInputElement} */ (e.target);
    let howStrong = validatePassword(targetElement.value);
    setStrength(howStrong);
    if (howStrong >= 4) {
      clearError("repeatPassword");
    } else {
      setError("repeatPassword", "Repeat password don't match with main password.");
    }
  };

  //   const onSubmit = () => {
  //     if (data.password && data.repeatPassword && data.password === data.repeatPassword) {
  //       showLoading(true)
  //       const params = {
  //           projectId: projectId,
  //           firstName: data.firstName,
  //           email: data.email,
  //           password: data.password,
  //           subscribe: data.subscribe,
  //           ref: this.state.ref || null,
  //           array: true,
  //           gRecaptchaResponse: "abracadabra"
  //       };
  //       setCaptchaResponse('')
  //       this.props.dispatch(signup(params, this.hideLoader));
  //     } else {
  //       setPasswordDoNotMatch(true);
  //     }
  //   };

  const onSubmit = () => {};

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box
        alignItems="center"
        className="signupForm"
        display="flex"
        flexDirection="column"
        justifyContent="center"
      >
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
          <label className="customLabel">Name</label>
          <TextField
            className="customInput"
            error={!!errors.name}
            fullWidth
            inputRef={register({ required: true, minLength: 3 })}
            name="name"
            type="text"
            variant="outlined"
          />
        </Box>
        <Box
          alignItems="start"
          className="inputBox"
          display="flex"
          flexDirection="column"
          justifyContent="start"
        >
          <label className="customLabel">Email address</label>
          <TextField
            className="customInput"
            error={!!errors.email}
            fullWidth
            inputRef={register({
              required: true,
              pattern: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/,
            })}
            name="email"
            type="email"
            variant="outlined"
          />
        </Box>

        <Box
          alignItems="start"
          className="inputBox"
          display="flex"
          flexDirection="column"
          justifyContent="start"
        >
          <label className="customLabel">Password</label>
          <FormControl className="customInput" variant="outlined">
            <OutlinedInput
              endAdornment={
                <InputAdornment position="end">
                  <span className="pointer" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </span>
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

        <Box
          alignItems="start"
          className={"inputBox " + (passwordDoNotMatch ? "no-margin" : "")}
          display="flex"
          flexDirection="column"
          justifyContent="start"
        >
          <label className="customLabel">Repeat Password</label>
          <FormControl className="customInput" variant="outlined">
            <OutlinedInput
              endAdornment={
                <InputAdornment position="end">
                  <span
                    className="pointer"
                    onClick={() => setShowRepeatPassword(!showRepeatPassword)}
                  >
                    {showRepeatPassword ? <Visibility /> : <VisibilityOff />}
                  </span>
                </InputAdornment>
              }
              error={!!errors.repeatPassword}
              inputRef={register({ required: true })}
              name="repeatPassword"
              onChange={handleRepeatPasswordChange}
              type={showRepeatPassword ? "text" : "password"}
            />
          </FormControl>
        </Box>
        <Box display="flex" flexDirection="row" justifyContent="center" minWidth="100%">
          {passwordDoNotMatch && <span className="error-text bold">Passwords do not match!</span>}
        </Box>
        <Box className="inputBox checkbox">
          <Box alignItems="start" display="flex" flexDirection="row" justifyContent="start">
            <Checkbox
              className="checkboxInput"
              // error={errors.terms ? "true" : "false"}
              inputRef={register({ required: true })}
              name="terms"
              onChange={() => clearError("terms")}
            />
            <Box
              className={"terms-box " + (errors.terms ? " error" : "")}
              display="flex"
              flexDirection="row"
              flexWrap="wrap"
              justifyContent="start"
            >
              <span className="text">I agree to</span>
              <a className="link" href={"/legal/terms"}>
                Terms and condition
              </a>
              <span className="text">and</span>
              <a className="link" href={"/legal/privacy"}>
                privacy policy
              </a>
            </Box>
          </Box>
        </Box>

        <Box className="inputBox checkbox">
          <Box alignItems="start" display="flex" flexDirection="row" justifyContent="start">
            <Checkbox className="checkboxInput" inputRef={register} name="subscribe" />
            <span className={"terms-text"}>Subscribe to notifications</span>
          </Box>
        </Box>

        <Box className="captchaBox">
          <Captcha onChange={setCaptchaResponse} recaptchaRef={recaptchaRef} />
        </Box>

        <Box className="inputBox button-box">
          <CustomButton className={"full submitButton"} loading={loading} type="submit">
            Register
          </CustomButton>
        </Box>
      </Box>
    </form>
  );
};

export default SignupForm;

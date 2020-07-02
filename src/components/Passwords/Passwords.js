import React, { useState, useEffect } from "react";
import "./Passwords.scss";
import { Box, Popper, InputAdornment, OutlinedInput, FormControl } from "@material-ui/core";
import PasswordStrength from "./PasswordStrength";
import PasswordInput from "./PasswordInput";
import { validatePassword } from "../../utils/validators";
import { FormattedMessage } from "react-intl";

/**
 * @typedef {import('react').ChangeEvent} ChangeEvent
 * @typedef {import('react-hook-form').FormContextValues} FormContextValues
 */

/**
 *
 * @typedef {Object} DefaultProps
 * @property {FormContextValues} formMethods
 */

/**
 *
 * @param {DefaultProps} props
 */

const Passwords = ({ formMethods: { clearError, setError, register, errors }, edit }) => {
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);
  const [passwordDoNotMatch, setPasswordDoNotMatch] = useState(false);
  const [anchorEl, setAnchorEl] = useState(undefined);
  const [strength, setStrength] = useState(0);

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

  return (
    <>
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
        <PasswordInput
          label={<FormattedMessage id={"security.password" + (edit ? ".new" : "")} />}
          name="password"
          inputRef={register({ required: true })}
          error={!!errors.password}
          onBlur={() => setAnchorEl(undefined)}
          onChange={handlePasswordChange}
          onFocus={(e) => setAnchorEl(e.currentTarget)}
        />
      </Box>
      <Box
        alignItems="start"
        className={"inputBox " + (passwordDoNotMatch ? "no-margin" : "")}
        display="flex"
        flexDirection="column"
        justifyContent="start"
      >
        <PasswordInput
          label={<FormattedMessage id={"security.repeat" + (edit ? ".new" : "")} />}
          name="repeatPassword"
          onChange={handleRepeatPasswordChange}
          inputRef={register({ required: true })}
          error={!!errors.repeatPassword}
        />
      </Box>
      <Box display="flex" flexDirection="row" justifyContent="center" minWidth="100%">
        {passwordDoNotMatch && <span className="error-text bold">Passwords do not match!</span>}
      </Box>
    </>
  );
};

export default Passwords;

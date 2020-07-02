import React, { useState, useRef } from "react";
import "./Passwords.scss";
import {
  Box,
  Popper,
  InputAdornment,
  OutlinedInput,
  FormControl,
  useMediaQuery,
} from "@material-ui/core";
import { useTheme } from "@material-ui/core/styles";
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

const Passwords = ({ formMethods, edit }) => {
  const [isPasswordStrengthOpen, openPasswordStrength] = useState(false);
  const anchorEl = useRef(null);
  const [strength, setStrength] = useState(0);
  const { clearError, setError, register, errors, getValues } = formMethods;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  /**
   * Main password change state handling.
   *
   * @param {ChangeEvent} e Observed event.
   * @return {void}
   */
  const handlePasswordChange = (e) => {
    const targetElement = /** @type {HTMLInputElement} */ (e.target);
    let howStrong = validatePassword(targetElement.value);
    setStrength(howStrong);
    console.log(howStrong);
    // if (strength >= 4) {
    //   clearError("password");
    // } else {
    //   setError("password", "The password is weak.");
    // }
  };

  return (
    <>
      <Popper
        anchorEl={anchorEl.current}
        className="passwordStrengthBox"
        open={isPasswordStrengthOpen}
        placement={isMobile ? "top" : "left-start"}
        transition
        popperOptions={{
          modifiers: {
            offset: {
              enabled: true,
              offset: `0px, ${edit ? 80 : 20}px`,
            },
            flip: {
              enabled: !isMobile,
            },
          },
        }}
      >
        <PasswordStrength onClose={() => openPasswordStrength(false)} strength={strength} />
      </Popper>
      <Box
        alignItems="start"
        className="inputBox"
        display="flex"
        flexDirection="column"
        justifyContent="start"
      >
        <PasswordInput
          error={!!errors.password}
          label={<FormattedMessage id={"security.password" + (edit ? ".new" : "")} />}
          name="password"
          inputRef={(e) => {
            register(e, {
              required: true,
              validate: () => (strength >= 4 ? true : "The password is weak."),
            });
            anchorEl.current = e;
          }}
          onBlur={() => openPasswordStrength(false)}
          onFocus={(e) => openPasswordStrength(true)}
          onChange={handlePasswordChange}
        />
        {errors && errors.password && <span className="errorText">{errors.password.message}</span>}
      </Box>
      <Box
        alignItems="start"
        className={"inputBox"}
        display="flex"
        flexDirection="column"
        justifyContent="start"
      >
        <PasswordInput
          error={!!errors.repeatPassword}
          label={<FormattedMessage id={"security.repeat" + (edit ? ".new" : "")} />}
          name="repeatPassword"
          inputRef={register({
            required: true,
            validate: (value) => {
              if (value === getValues()["password"]) {
                return true;
              } else {
                return "The passwords do not match.";
              }
            },
          })}
        />
        {errors && errors.repeatPassword && (
          <span className="errorText">{errors.repeatPassword.message}</span>
        )}
      </Box>
    </>
  );
};

export default Passwords;

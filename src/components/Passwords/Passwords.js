import React, { useState, useRef } from "react";
import "./Passwords.scss";
import { Box, Popper, useMediaQuery } from "@material-ui/core";
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
 * @typedef {Object} PasswordsPropTypes
 * @property {FormContextValues} formMethods
 * @property {boolean} edit
 */

/**
 * Provides a password and a repeat password component.
 *
 * @param {PasswordsPropTypes} props Component properties.
 * @returns {JSX.Element} Component JSX.
 */
const Passwords = ({ formMethods, edit }) => {
  const [isPasswordStrengthOpen, openPasswordStrength] = useState(false);
  const anchorEl = useRef(null);
  const [strength, setStrength] = useState(0);
  const { register, errors, getValues } = formMethods;
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
  };

  return (
    <>
      <Popper
        anchorEl={anchorEl.current}
        className="passwordStrengthBox"
        open={isPasswordStrengthOpen}
        placement={isMobile ? "top" : "left-start"}
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
        transition
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
          inputRef={(e) => {
            register(e, {
              required: true,
              validate: () => (strength >= 4 ? true : "The password is weak."),
            });
            anchorEl.current = e;
          }}
          label={<FormattedMessage id={"security.password" + (edit ? ".new" : "")} />}
          name="password"
          onBlur={() => openPasswordStrength(false)}
          onChange={handlePasswordChange}
          onFocus={() => openPasswordStrength(true)}
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
          inputRef={register({
            required: true,
            validate: (value) => {
              if (value === getValues().password) {
                return true;
              }
              return "The passwords do not match.";
            },
          })}
          label={<FormattedMessage id={"security.repeat" + (edit ? ".new" : "")} />}
          name="repeatPassword"
        />
        {errors && errors.repeatPassword && (
          <span className="errorText">{errors.repeatPassword.message}</span>
        )}
      </Box>
    </>
  );
};

export default Passwords;

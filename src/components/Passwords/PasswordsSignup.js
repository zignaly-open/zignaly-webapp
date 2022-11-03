import React, { useState, useRef } from "react";
import { Box, Popper, useMediaQuery } from "@material-ui/core";
import { useTheme } from "@material-ui/core/styles";
import PasswordStrength from "./PasswordStrength";
import PasswordInputSignup from "./PasswordInputSignup";
import { validatePassword } from "../../utils/validators";
import { FormattedMessage, useIntl } from "react-intl";

/**
 * @typedef {import('react').ChangeEvent} ChangeEvent
 * @typedef {import('react-hook-form').UseFormMethods<Record<string, any>>} FormMethods
 */

/**
 * @typedef {Object} PasswordsPropTypes
 * @property {FormMethods} formMethods
 * @property {boolean} edit
 */

/**
 * Provides a password and a repeat password component.
 *
 * @param {PasswordsPropTypes} props Component properties.
 * @returns {JSX.Element} Component JSX.
 */
const PasswordsSignup = ({ formMethods, edit }) => {
  const [isPasswordStrengthOpen, openPasswordStrength] = useState(false);
  const anchorEl = useRef(null);
  const [strength, setStrength] = useState(0);
  const { register, errors, getValues } = formMethods;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const intl = useIntl();

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
      <PasswordInputSignup
        label={""}
        placeholder="Password"
        error={!!errors.password}
        inputRef={(e) => {
          register(e, {
            required: intl.formatMessage({ id: "form.error.password" }),
            validate: () => strength >= 4 || intl.formatMessage({ id: "form.error.password.weak" }),
          });
          anchorEl.current = e;
        }}
        /*           label={<FormattedMessage id={"security.password" + (edit ? ".new" : "")} />} */
        name="password"
        onBlur={() => openPasswordStrength(false)}
        onChange={handlePasswordChange}
        onFocus={() => openPasswordStrength(true)}
      />
      {errors && errors.password && <span className="errorText">{errors.password.message}</span>}
    </>
  );
};

export default PasswordsSignup;

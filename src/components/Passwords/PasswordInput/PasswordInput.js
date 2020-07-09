import React, { useState } from "react";
import { FormControl, OutlinedInput, InputAdornment } from "@material-ui/core";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";

/**
 * @typedef {import("@material-ui/core").OutlinedInputProps} OutlinedInputProps
 */

/**
 * @typedef {Object} PasswordInputProps
 * @property {string|React.ReactElement} label
 */

/**
 * @typedef {PasswordInputProps & OutlinedInputProps} PasswordInputPropsExtended
 */

/**
 * @param {PasswordInputPropsExtended} props Component props.
 * @returns {JSX.Element} Component JSX.
 */
const PasswordInput = ({ label, ...others }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <FormControl className="passwordInput" fullWidth={true}>
      <label className="customLabel">{label}</label>
      <OutlinedInput
        className="customInput"
        endAdornment={
          <InputAdornment position="end">
            <span className="pointer" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <Visibility /> : <VisibilityOff />}
            </span>
          </InputAdornment>
        }
        type={showPassword ? "text" : "password"}
        {...others}
      />
    </FormControl>
  );
};

export default PasswordInput;

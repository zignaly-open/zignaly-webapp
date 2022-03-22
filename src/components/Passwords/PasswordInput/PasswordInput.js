import React, { useState } from "react";
import { FormControl, OutlinedInput, InputAdornment } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

/**
 * @typedef {import("@mui/material").OutlinedInputProps} OutlinedInputProps
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

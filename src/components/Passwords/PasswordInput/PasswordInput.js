import React, { useState } from "react";
import {
  Box,
  Typography,
  Checkbox,
  FormControlLabel,
  OutlinedInput,
  InputAdornment,
} from "@material-ui/core";
import { FormattedMessage } from "react-intl";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";

const PasswordInput = ({ label, others }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <FormControlLabel
      control={
        <OutlinedInput
          className="customInput"
          endAdornment={
            <InputAdornment position="end">
              <span className="pointer" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <Visibility /> : <VisibilityOff />}
              </span>
            </InputAdornment>
          }
          //   inputRef={register({ required: true })}
          type={showPassword ? "text" : "password"}
          {...others}
        />
      }
      label={label}
      labelPlacement="top"
    />
  );
};

export default PasswordInput;

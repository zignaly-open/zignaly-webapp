import React, { useState } from "react";
import { Controller } from "react-hook-form";
import { TextField, InputAdornment } from "@mui/material";
/**
 * @typedef {import('react-hook-form').Control} Control
 */

/**
 * Control to input numbers, replacing commas by dots.
 * @param {Object} props Props
 * @param {Control} props.control React Hook Form control
 * @param {string} props.quote Quote
 * @param {string|number} props.defaultValue Default Value
 * @param {string} props.placeholder Placeholder
 * @param {boolean} props.error Error
 * @param {string} props.name Name
 * @param {Object} props.rules Rules
 * @returns {JSX.Element} JSX
 */
const NumberInput = ({ control, quote, defaultValue, placeholder, error, name, rules }) => {
  const [allocated, setAllocated] = useState(defaultValue);

  return (
    <Controller
      control={control}
      defaultValue={allocated}
      name={name}
      render={(props) => (
        <TextField
          InputProps={{
            endAdornment: <InputAdornment position="end">{quote}</InputAdornment>,
          }}
          className="customInput"
          error={error}
          fullWidth
          onBlur={props.onBlur}
          onChange={(e) => {
            let data = e.target.value;
            if (data.match(/^$|^[0-9]\d*(?:[.,]\d{0,8})?$/)) {
              data = data.replace(",", ".");
              setAllocated(data);
              props.onChange(data);
            }
          }}
          placeholder={placeholder}
          value={allocated}
          variant="outlined"
        />
      )}
      rules={rules}
    />
  );
};

export default NumberInput;

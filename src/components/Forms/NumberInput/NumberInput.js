import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Box, TextField, Typography, InputAdornment } from "@material-ui/core";

const NumberInput = ({ control, quote, defaultValue, placeholder, error, name }) => {
  const [allocated, setAllocated] = useState(defaultValue);
  console.log("er", error);

  return (
    <Controller
      control={control}
      name={name}
      render={(props) => (
        <TextField
          InputProps={{
            endAdornment: <InputAdornment position="end">{quote}</InputAdornment>,
          }}
          className="customInput"
          error={error}
          fullWidth
          onChange={(e) => {
            let data = e.target.value;
            if (data.match(/^$|^[0-9]\d*(?:[.,]\d{0,8})?$/)) {
              data = data.replace(",", ".");
              setAllocated(data);
              props.onChange(data);
            }
          }}
          onBlur={props.onBlur}
          placeholder={placeholder}
          value={allocated}
          variant="outlined"
        />
      )}
      rules={{ required: "Please enter a valid Amount!" }}
      defaultValue=""
    />
  );
};

export default NumberInput;

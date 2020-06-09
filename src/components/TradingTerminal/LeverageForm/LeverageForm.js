import React, { useState } from "react";
import { Box, Slider, Typography } from "@material-ui/core";
import "./LeverageForm.scss";

const LeverageForm = () => {
  const min = 1;
  const max = 125;
  const [value, setValue] = useState(1);

  /**
   * Leverage slided change handler.
   *
   * @param {React.ChangeEvent<{}>} event Change event.
   * @param {number} newValue Selected slider value.
   * @returns {Void} None.
   */
  const handleSliderChange = (event, newValue) => {
    setValue(newValue);
  };

  /**
   * Leverage input value change handler.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} event Change event.
   * @returns {Void} None.
   */
  const handleInputChange = (event) => {
    const targetElement = event.currentTarget;
    setValue(Number(targetElement.value));
  };

  const protectLimits = () => {
    if (value < min) {
      setValue(min);
    } else if (value > max) {
      setValue(max);
    }
  };

  const increaseValue = () => {
    const newValue = value + 1;
    if (newValue <= max) {
      setValue(newValue);
    }
  };

  const decreaseValue = () => {
    const newValue = value - 1;
    if (newValue >= min) {
      setValue(newValue);
    }
  };

  return (
    <Box className="leverageForm">
      <Typography className="title" id="range-slider" variant="h3">
        Adjust Leverage
      </Typography>
      <Box className="inputValue" display="flex" flexDirection="row">
        <button onClick={() => decreaseValue()} type="button">
          −
        </button>
        <input onBlur={protectLimits} onChange={handleInputChange} value={value} />
        <button onClick={() => increaseValue()} type="button">
          +
        </button>
      </Box>
      <Slider
        aria-labelledby="range-slider"
        className="slider"
        max={max}
        min={min}
        onChange={handleSliderChange}
        step={1}
        value={typeof value === "number" ? value : 0}
      />
    </Box>
  );
};

export default LeverageForm;

import React from "react";
import { Box, Slider, Typography } from "@material-ui/core";
import "./LeverageForm.scss";

/**
 * @typedef {Object} LeverageFormProps
 * @property {number} min Minimum leverage limit.
 * @property {number} max Maximum leverage limit.
 * @property {number} currentValue Default leverage value.
 * @property {function} setCurrentValue Set state callback to store new value.
 */

/**
 * Leverage form control component.
 *
 * @param {LeverageFormProps} props Component props.
 * @returns {JSX.Element} Leverage form element.
 */
const LeverageForm = (props) => {
  const { min, max, currentValue, setCurrentValue } = props;

  /**
   * Leverage slided change handler.
   *
   * @param {React.ChangeEvent<{}>} event Change event.
   * @param {number} newValue Selected slider value.
   * @returns {Void} None.
   */
  const handleSliderChange = (event, newValue) => {
    setCurrentValue(newValue);
  };

  /**
   * Leverage input value change handler.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} event Change event.
   * @returns {Void} None.
   */
  const handleInputChange = (event) => {
    const targetElement = event.currentTarget;
    setCurrentValue(Number(targetElement.value));
  };

  const protectLimits = () => {
    if (currentValue < min) {
      setCurrentValue(min);
    } else if (currentValue > max) {
      setCurrentValue(max);
    }
  };

  const increaseValue = () => {
    const newValue = currentValue + 1;
    if (newValue <= max) {
      setCurrentValue(newValue);
    }
  };

  const decreaseValue = () => {
    const newValue = currentValue - 1;
    if (newValue >= min) {
      setCurrentValue(newValue);
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
        <input onBlur={protectLimits} onChange={handleInputChange} value={currentValue} />
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
        value={typeof currentValue === "number" ? currentValue : 0}
      />
    </Box>
  );
};

export default React.memo(LeverageForm);

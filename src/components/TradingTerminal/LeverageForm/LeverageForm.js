import React from "react";
import { Box, Slider, Typography } from "@material-ui/core";
import { FormattedMessage } from "react-intl";
import "./LeverageForm.scss";

/**
 * @typedef {Object} LeverageFormProps
 * @property {number} min Minimum leverage limit.
 * @property {number} max Maximum leverage limit.
 * @property {number} leverage Current leverage.
 * @property {function} setValue Hook form setValue callback.
 */

/**
 * Leverage form control component.
 *
 * @param {LeverageFormProps} props Component props.
 * @returns {JSX.Element} Leverage form element.
 */
const LeverageForm = (props) => {
  const { min, max, leverage, setValue } = props;

  /**
   * Leverage slided change handler.
   *
   * @param {React.ChangeEvent<{}>} event Change event.
   * @param {number} newValue Selected slider value.
   * @returns {Void} None.
   */
  const handleSliderChange = (event, newValue) => {
    setValue("leverage", newValue);
  };

  /**
   * Leverage input value change handler.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} event Change event.
   * @returns {Void} None.
   */
  const handleInputChange = (event) => {
    const targetElement = event.currentTarget;
    setValue("leverage", Number(targetElement.value));
  };

  const protectLimits = () => {
    if (leverage < min) {
      setValue("leverage", min);
    } else if (leverage > max) {
      setValue("leverage", max);
    }
  };

  const increaseValue = () => {
    const newValue = leverage + 1;
    if (newValue <= max) {
      setValue("leverage", newValue);
    }
  };

  const decreaseValue = () => {
    const newValue = leverage - 1;
    if (newValue >= min) {
      setValue("leverage", newValue);
    }
  };

  return (
    <Box className="leverageForm">
      <Typography className="title" id="range-slider" variant="h3">
        <FormattedMessage id="terminal.leverage.adjust" />
      </Typography>
      <Box className="inputValue" display="flex" flexDirection="row">
        <button onClick={() => decreaseValue()} type="button">
          −
        </button>
        <input onBlur={protectLimits} onChange={handleInputChange} value={leverage} />
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
        value={leverage}
      />
    </Box>
  );
};

export default React.memo(LeverageForm);

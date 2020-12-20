import React, { useState } from "react";
import { Box, Slider, Typography, Switch } from "@material-ui/core";
import { FormattedMessage } from "react-intl";
import "./LeverageForm.scss";
import useStoreSettingsSelector from "../../../hooks/useStoreSettingsSelector";
import CustomButton from "../../CustomButton";

/**
 * @typedef {Object} LeverageFormProps
 * @property {number} min Minimum leverage limit.
 * @property {number} max Maximum leverage limit.
 * @property {number} leverage Current leverage.
 * @property {function} setValue Hook form setValue callback.
 * @property {function} onClose Hook form setValue callback.
 */

/**
 * Leverage form control component.
 *
 * @param {LeverageFormProps} props Component props.
 * @returns {JSX.Element} Leverage form element.
 */
const LeverageForm = (props) => {
  const { min, max, leverage, setValue, mode: initMode, onClose } = props;
  const [val, setVal] = useState(leverage);
  const [mode, setMode] = useState(initMode);
  const marks = [
    { value: 1, label: "1" },
    { value: 25, label: "25" },
    { value: 50, label: "50" },
    { value: 75, label: "75" },
    { value: 100, label: "100" },
    { value: 125, label: "125" },
  ];
  const { darkStyle, selectedExchange } = useStoreSettingsSelector();
  const leverageReadOnly = selectedExchange.exchangeName.toLowerCase() === "bitmex";

  const handleCancel = () => {
    onClose();
  };

  const handleConfirm = () => {
    setValue("leverage", val);
    setValue("marginMode", mode);
    onClose();
  };

  /**
   * Leverage slided change handler.
   *
   * @param {React.ChangeEvent<{}>} event Change event.
   * @param {number} newValue Selected slider value.
   * @returns {Void} None.
   */
  const handleSliderChange = (event, newValue) => {
    setVal(newValue);
  };

  /**
   * Leverage input value change handler.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} event Change event.
   * @returns {Void} None.
   */
  const handleInputChange = (event) => {
    const targetElement = event.currentTarget;
    setVal(Number(targetElement.value));
  };

  const protectLimits = () => {
    if (val < min) {
      setVal(min);
    } else if (val > max) {
      setVal(max);
    }
  };

  const increaseValue = () => {
    const newValue = val + 1;
    if (newValue <= max) {
      setVal(newValue);
    }
  };

  const decreaseValue = () => {
    const newValue = val - 1;
    if (newValue >= min) {
      setVal(newValue);
    }
  };

  return (
    <Box
      className="leverageForm"
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
    >
      <Typography className="title" id="range-slider" variant="h3">
        <FormattedMessage id="terminal.leverage.adjust" />
      </Typography>
      <Box className="inputValue" display="flex" flexDirection="row" justifyContent="space-between">
        <button
          className={darkStyle ? "dark" : "light"}
          onClick={() => decreaseValue()}
          type="button"
          disabled={!leverageReadOnly}
        >
          −
        </button>
        <input
          className={darkStyle ? "dark" : "light"}
          onBlur={protectLimits}
          onChange={handleInputChange}
          value={val}
          disabled={!leverageReadOnly}
        />
        <button
          className={darkStyle ? "dark" : "light"}
          onClick={() => increaseValue()}
          type="button"
          disabled={!leverageReadOnly}
        >
          +
        </button>
      </Box>
      <Slider
        aria-labelledby="range-slider"
        className="slider"
        classes={{ mark: "mark", thumb: "thumb", track: "track", markLabel: "markLabel" }}
        marks={marks}
        max={max}
        min={min}
        onChange={handleSliderChange}
        step={1}
        value={val}
        disabled={!leverageReadOnly}
      />
      {max > 25 && val >= 25 && (
        <span className="errorText">
          <FormattedMessage id="terminal.leverage.alert" />
        </span>
      )}
      <Box className="mode" display="flex" flexDirection="row" alignItems="center">
        <Typography>
          <FormattedMessage id="terminal.leverage.isolated" />
        </Typography>
        <Switch
          checked={mode === "cross"}
          onChange={(e) => setMode(e.target.checked ? "cross" : "isolated")}
        />
        <Typography>
          <FormattedMessage id="terminal.leverage.cross" />
        </Typography>
      </Box>
      <Box
        alignItems="center"
        className="formActions"
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
      >
        <CustomButton className="textDefault" onClick={handleCancel}>
          <FormattedMessage id="terminal.leverage.cancel" />
        </CustomButton>
        <CustomButton className="submitButton" onClick={handleConfirm}>
          <FormattedMessage id="terminal.leverage.confirm" />
        </CustomButton>
      </Box>
    </Box>
  );
};

export default React.memo(LeverageForm);

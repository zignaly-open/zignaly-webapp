import React, { useState, useEffect } from "react";
import "./ToggleInput.scss";
import { Box, Typography, TextField, Tooltip, Switch, InputAdornment } from "@mui/material";
import { FormattedMessage } from "react-intl";
import HelpIcon from "@mui/icons-material/Help";
import useStoreSettingsSelector from "../../../../hooks/useStoreSettingsSelector";

/**
 * @typedef {import('react-hook-form').UseFormMethods<Record<string, any>>} FormMethods
 * @typedef {Object} DefaultProps
 * @property {FormMethods} formMethods
 * @property {String} label
 * @property {String|Number} value
 * @property {String} name
 * @property {String} tooltip
 * @property {String} unit
 */

/**
 * Input toggle component.
 *
 * @param {DefaultProps} props Default component props.
 * @returns {JSX.Element} JSX component.
 */
const ToggleInput = ({ formMethods, value, label, name, tooltip, unit }) => {
  const storeSettings = useStoreSettingsSelector();
  const [toggle, setToggle] = useState(!!value);
  const [val, setVal] = useState(value ? value : "");
  const { register } = formMethods;

  const initData = () => {
    setToggle(!!value);
  };

  useEffect(initData, [value]);

  /**
   *
   * @param {React.ChangeEvent<*>} e Change event.
   * @returns {Void} None.
   */
  const handleChange = (e) => {
    let targetValue = e.target.value;
    if (name === "stopLoss") {
      if (
        targetValue.match(/^[0-9]\d*(?:[.,]\d{0,8})?$/) ||
        targetValue === "" ||
        targetValue.includes("-")
      ) {
        targetValue = targetValue.replace(",", ".");
        setVal(Math.sign(targetValue) === 1 ? targetValue * -1 : targetValue);
      }
    } else if (name === "maxPositions" || name === "positionsPerMarket" || name === "leverage") {
      if (targetValue.match(/^\d+$/) || targetValue === "") {
        setVal(targetValue);
      }
    } else if (
      targetValue.match(/^[0-9]\d*(?:[.,]\d{0,8})?$/) ||
      targetValue === "" ||
      targetValue.includes("-")
    ) {
      targetValue = targetValue.replace(",", ".");
      setVal(targetValue);
    }
  };

  return (
    <Box
      alignItems="flex-start"
      className="toggleInput"
      display="flex"
      flexDirection="row"
      justifyContent="space-between"
    >
      <Box
        alignItems="center"
        className="labelBox"
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
      >
        <label className="customLabel">
          <FormattedMessage id={label} />
        </label>
        <Tooltip
          placement="top"
          title={
            <Typography variant="h5">
              <FormattedMessage id={tooltip} />
            </Typography>
          }
        >
          <HelpIcon className="icon" />
        </Tooltip>
        <Switch checked={toggle} onChange={(e) => setToggle(e.target.checked)} />
      </Box>

      {toggle && (
        <Box className="fieldInputBox" display="flex" flexDirection="row">
          <TextField
            InputProps={{
              endAdornment: <InputAdornment position="end">{unit}</InputAdornment>,
            }}
            className={"customInput " + (storeSettings.darkStyle ? " dark " : " light ")}
            fullWidth
            inputRef={register}
            name={name}
            onChange={handleChange}
            type="text"
            value={val}
            variant="outlined"
          />
        </Box>
      )}
    </Box>
  );
};

export default ToggleInput;

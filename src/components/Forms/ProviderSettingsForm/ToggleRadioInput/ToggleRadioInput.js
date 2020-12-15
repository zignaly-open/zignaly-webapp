import React, { useState, useEffect } from "react";
import "./ToggleRadioInput.scss";
import {
  Box,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  Tooltip,
  Switch,
} from "@material-ui/core";
import { FormattedMessage } from "react-intl";
import HelpIcon from "@material-ui/icons/Help";

/**
 * @typedef {Object} OptionType
 * @property {string} label Option label.
 * @property {string|number} value Option value.
 */

/**
 * @typedef {import('react-hook-form').UseFormMethods<Record<string, any>>} FormMethods
 * @typedef {Object} DefaultProps
 * @property {FormMethods} formMethods
 * @property {String} label
 * @property {String|Number} value
 * @property {String} name
 * @property {String} tooltip
 * @property {Array<OptionType>} options
 */

/**
 * Radio Input toggle component.
 *
 * @param {DefaultProps} props Default component props.
 * @returns {JSX.Element} JSX component.
 */
const ToggleRadioInput = ({ formMethods, value, label, name, tooltip, options }) => {
  const [toggle, setToggle] = useState(!!value);
  const { register } = formMethods;

  const initData = () => {
    setToggle(!!value);
  };

  useEffect(initData, [value]);

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
          <RadioGroup className="radioBox" defaultValue={value}>
            {options &&
              options.map((item, index) => (
                <FormControlLabel
                  control={<Radio />}
                  inputRef={register}
                  key={index}
                  label={item.label}
                  name={name}
                  value={item.value}
                />
              ))}
          </RadioGroup>
        </Box>
      )}
    </Box>
  );
};

export default ToggleRadioInput;

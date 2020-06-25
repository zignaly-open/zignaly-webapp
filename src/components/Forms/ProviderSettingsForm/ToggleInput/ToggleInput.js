import React, { useState, useEffect } from "react";
import "./ToggleInput.scss";
import { Box, Typography, TextField, Tooltip, Switch, InputAdornment } from "@material-ui/core";
import { FormattedMessage } from "react-intl";
import { Controller } from "react-hook-form";
import HelpIcon from "@material-ui/icons/Help";
import useStoreSettingsSelector from "../../../../hooks/useStoreSettingsSelector";

/**
 *
 * @typedef {Object} DefaultProps
 * @property {String} label
 * @property {String|Number} value
 * @property {String} name
 * @property {String} tooltip
 * @property {import('react-hook-form').Controller} control
 * @property {String} unit
 */

/**
 * Input toggle component.
 *
 * @param {DefaultProps} props Default component props.
 * @returns {JSX.Element} JSX component.
 */
const ToggleInput = ({ value, control, label, name, tooltip, unit }) => {
  const storeSettings = useStoreSettingsSelector();
  const [toggle, setToggle] = useState(!!value);

  const initData = () => {
    setToggle(!!value);
  };

  useEffect(initData, [value]);

  return (
    <Box alignItems="center" className="toggleInput" display="flex" flexDirection="row">
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
          <Controller
            as={
              <TextField
                InputProps={{
                  endAdornment: <InputAdornment position="end">{unit}</InputAdornment>,
                }}
                className={"customInput " + (storeSettings.darkStyle ? " dark " : " light ")}
                fullWidth
                type="number"
                variant="outlined"
              />
            }
            control={control}
            defaultValue={value ? value : 0}
            name={name}
          />
        </Box>
      )}
    </Box>
  );
};

export default ToggleInput;

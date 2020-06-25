import React, { useState, useEffect } from "react";
import "./ToggleTextarea.scss";
import { Box, Typography, TextField, Tooltip, Switch, InputAdornment } from "@material-ui/core";
import { FormattedMessage } from "react-intl";
import { Controller } from "react-hook-form";
import HelpIcon from "@material-ui/icons/Help";
import useStoreSettingsSelector from "../../../../hooks/useStoreSettingsSelector";

/**
 *
 * @typedef {Object} DefaultProps
 * @property {String} label
 * @property {String|Number|Boolean} value
 * @property {String} name
 * @property {String} tooltip
 * @property {import('react-hook-form').Controller} control
 */

/**
 * Input toggle component.
 *
 * @param {DefaultProps} props
 * @returns {JSX.Element} JSX component.
 */
const ToggleTextarea = ({ value, control, label, name, tooltip, unit }) => {
  const storeSettings = useStoreSettingsSelector();
  const [toggle, setToggle] = useState(value ? true : false);

  const initData = () => {
    setToggle(value ? true : false);
  };

  useEffect(initData, [value]);

  return (
    <Box className="toggleTextarea" display="flex" flexDirection="row" alignItems="flex-start">
      <Box
        className="labelBox"
        display="flex"
        flexDirection="row"
        alignItems="center"
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
                className={"customTextarea " + (storeSettings.darkStyle ? " dark " : " light ")}
                fullWidth
                multiline
                rows={5}
                variant="outlined"
              />
            }
            control={control}
            defaultValue={value ? value : ""}
            name={name}
          />
        </Box>
      )}
    </Box>
  );
};

export default ToggleTextarea;

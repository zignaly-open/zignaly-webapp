import React, { useState, useEffect } from "react";
import "./ToggleTextarea.scss";
import { Box, Typography, TextField, Tooltip, Switch } from "@material-ui/core";
import { FormattedMessage } from "react-intl";
import { Controller } from "react-hook-form";
import HelpIcon from "@material-ui/icons/Help";
import useStoreSettingsSelector from "../../../../hooks/useStoreSettingsSelector";

/**
 *
 * @typedef {import('react-hook-form').UseFormMethods<Record<string, any>>} FormMethods
 * @typedef {Object} DefaultProps
 * @property {FormMethods} formMethods
 * @property {String} label
 * @property {String|Number|Boolean} value
 * @property {String} name
 * @property {String} tooltip
 */

/**
 * Input toggle component.
 *
 * @param {DefaultProps} props Default component props.
 * @returns {JSX.Element} JSX component.
 */
const ToggleTextarea = ({ value, formMethods, label, name, tooltip }) => {
  const storeSettings = useStoreSettingsSelector();
  const [toggle, setToggle] = useState(!!value);
  const { control } = formMethods;

  const initData = () => {
    setToggle(!!value);
  };

  useEffect(initData, [value]);

  return (
    <Box
      alignItems="flex-start"
      className="toggleTextarea"
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

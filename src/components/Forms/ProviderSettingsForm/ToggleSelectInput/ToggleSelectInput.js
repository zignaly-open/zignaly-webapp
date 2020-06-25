import React from "react";
import "./ToggleSelectInput.scss";
import { Box, Typography, TextField, Select, MenuItem, Tooltip } from "@material-ui/core";
import { Controller } from "react-hook-form";
import HelpIcon from "@material-ui/icons/Help";
import useStoreSettingsSelector from "../../../../hooks/useStoreSettingsSelector";

/**
 *
 * @typedef {Object} DefaultProps
 * @property {JSX.Element} label
 * @property {String|Number} value1
 * @property {String|Number} value2
 * @property {String} name1
 * @property {String} name2
 * @property {JSX.Element} tooltip
 * @property {import('react-hook-form').Controller} control
 */

/**
 * Input toggle component.
 *
 * @param {DefaultProps} props
 * @returns {JSX.Element} JSX component.
 */
const ToggleSelectInput = ({ value1, value2, control, label, name1, name2, tooltip }) => {
  const storeSettings = useStoreSettingsSelector();

  return (
    <Box className="toggleSelectInput" display="flex" flexDirection="row" alignItems="center">
      <Box
        className="labelBox"
        display="flex"
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
      >
        <label className="customLabel">{label}</label>
        <Tooltip placement="top" title={<Typography variant="h5">{tooltip}</Typography>}>
          <HelpIcon className="icon" />
        </Tooltip>
      </Box>

      <Box className="fieldInputBox" display="flex" flexDirection="row">
        <Controller
          as={
            <TextField
              className={"customInput " + (storeSettings.darkStyle ? " dark " : " light ")}
              fullWidth
              variant="outlined"
              type="number"
            />
          }
          control={control}
          /*@ts-ignore */
          defaultValue={value1}
          name={name1}
        />

        <Controller
          as={
            <Select className="selectInput" variant="outlined">
              <MenuItem value="#">#</MenuItem>
              <MenuItem value="%">%</MenuItem>
            </Select>
          }
          control={control}
          /*@ts-ignore */
          defaultValue={value2}
          name={name2}
        />
      </Box>
    </Box>
  );
};

export default ToggleSelectInput;

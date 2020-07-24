import React from "react";
import "./SelectInput.scss";
import { Box, Typography, TextField, Select, MenuItem, Tooltip } from "@material-ui/core";
import { Controller } from "react-hook-form";
import HelpIcon from "@material-ui/icons/Help";
import useStoreSettingsSelector from "../../../../hooks/useStoreSettingsSelector";

/**
 *
 * @typedef {import('react-hook-form').FormContextValues} FormContextValues
 * @typedef {Object} DefaultProps
 * @property {FormContextValues} formMethods
 * @property {JSX.Element} label
 * @property {String|Number} value1
 * @property {String|Number} value2
 * @property {String} name1
 * @property {String} name2
 * @property {JSX.Element} tooltip
 */

/**
 * Input toggle component.
 *
 * @param {DefaultProps} props Default component props.
 * @returns {JSX.Element} JSX component.
 */
const SelectInput = ({ value1, value2, formMethods, label, name1, name2, tooltip }) => {
  const storeSettings = useStoreSettingsSelector();
  const { control } = formMethods;

  return (
    <Box alignItems="center" className="selectInputBox" display="flex" flexDirection="row">
      <Box
        alignItems="center"
        className="labelBox"
        display="flex"
        flexDirection="row"
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
              type="number"
              variant="outlined"
            />
          }
          control={control}
          /* @ts-ignore */
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
          /* @ts-ignore */
          defaultValue={value2}
          name={name2}
        />
      </Box>
    </Box>
  );
};

export default SelectInput;

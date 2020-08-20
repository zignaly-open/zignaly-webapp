import React, { useState } from "react";
import "./SelectInput.scss";
import { Box, Typography, TextField, Select, MenuItem, Tooltip } from "@material-ui/core";
import { Controller } from "react-hook-form";
import HelpIcon from "@material-ui/icons/Help";
import useStoreSettingsSelector from "../../../../hooks/useStoreSettingsSelector";

/**
 *
 * @typedef {import('react-hook-form').UseFormMethods<Record<string, any>>} FormMethods
 * @typedef {Object} DefaultProps
 * @property {FormMethods} formMethods
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
  const [val1, setVal1] = useState(value1);
  const { control, register } = formMethods;

  /**
   *
   * @param {React.ChangeEvent<*>} e Change event.
   * @returns {Void} None.
   */
  const handleChange1 = (e) => {
    setVal1(e.target.value);
  };

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
        <TextField
          className={"customInput " + (storeSettings.darkStyle ? " dark " : " light ")}
          fullWidth
          inputRef={register}
          name={name1}
          onChange={handleChange1}
          type="text"
          value={val1}
          variant="outlined"
        />

        <Controller
          as={
            <Select className="selectInput" variant="outlined">
              <MenuItem value="#">#</MenuItem>
              <MenuItem value="%">%</MenuItem>
            </Select>
          }
          control={control}
          defaultValue={value2}
          name={name2}
        />
      </Box>
    </Box>
  );
};

export default SelectInput;

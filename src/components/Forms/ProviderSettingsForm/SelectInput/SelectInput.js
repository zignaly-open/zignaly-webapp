import React, { useState } from "react";
import "./SelectInput.scss";
import { Box, Typography, TextField, Select, MenuItem, Tooltip } from "@mui/material";
import { Controller } from "react-hook-form";
import HelpIcon from "@mui/icons-material/Help";
import useStoreSettingsSelector from "../../../../hooks/useStoreSettingsSelector";

/**
 *
 * @typedef {import('react-hook-form').UseFormMethods<Record<string, any>>} FormMethods
 * @typedef {Object} DefaultProps
 * @property {FormMethods} formMethods
 * @property {JSX.Element} label
 * @property {String} value1
 * @property {String} value2
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
  const [val1, setVal1] = useState(value1 ? value1.toString().replace(",", ".") : "");
  const { control, register } = formMethods;

  /**
   *
   * @param {React.ChangeEvent<*>} e Change event.
   * @returns {Void} None.
   */
  const handleChange1 = (e) => {
    let data = e.target.value;
    if (data.match(/^[0-9]\d*(?:[.,]\d{0,8})?$/) || data === "") {
      data = data.replace(",", ".");
      setVal1(data);
    }
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

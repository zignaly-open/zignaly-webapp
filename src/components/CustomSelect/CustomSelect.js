import React from "react";
import { FormControl, Box, Select, MenuItem, Typography, TextField } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import "./CustomSelect.scss";

/**
 * @typedef {import("@material-ui/lab").AutocompleteProps<*, false, false, false>['renderOption']} renderOption
 */

/**
 * @typedef {Object} OptionType
 * @property {string} label Option label.
 * @property {string|number} val Option value.
 */

/**
 * @typedef {"start"|"top"} LabelPlacement
 */

/**
 * @typedef {Function} RenderOptionProps
 * @property {*} option
 * @property {AutocompleteRenderOptionState} state
 * @returns {React.Node}
 */

/**
 * @typedef {OptionType|string|number} Option
 * @typedef {Array<Option>} Options
 */

/**
 * @typedef {Object} CustomSelectPropTypes
 * @property {Option} [value] Assign the selected value.
 * @property {Options} options List of options selectable.
 * @property {string} [label] Label for the dropdown.
 * @property {LabelPlacement} [labelPlacement] Label placement.
 * @property {boolean} [search] Display autocomplete.
 * @property {function} onChange Callback that delegate select changes to caller.
 * @property {boolean} [disableCloseOnSelect] Disable CloseOnSelect (multi options autocomplete).
 * @property {renderOption} [renderOption] Custom render option function for autocomplete.
 * @property {boolean} [multiple] Multiple options for autocomplete.
 * @property {boolean} [disabled] Disabled.
 * @property {boolean} [placeholder] Placeholder.
 */

/**
 * Extract value from option item
 * @param {Option} option option
 * @returns {string|number} value
 */
export const extractVal = (option) => (typeof option === "object" ? option.val : option);

/**
 * Extract label from option item
 * @param {Option} option option
 * @param {Options} [options] Options array to find the label by value.
 * @returns {string} value
 */
const extractLabel = (option, options) => {
  if (typeof option === "object") {
    return option.label;
  } else if (options && options.length && typeof options[0] === "object") {
    // Find option object by val
    // @ts-ignore
    const found = options.find((o) => o.val === option);
    // @ts-ignore
    return found ? found.label : "";
  }

  return option.toString();
};

/**
 * Provides a list to browse signal providers.
 *
 * @param {CustomSelectPropTypes} props Component properties.
 * @returns {JSX.Element} Component JSX.
 */
const CustomSelect = (props) => {
  const {
    label,
    onChange,
    options,
    value,
    search,
    renderOption,
    disableCloseOnSelect,
    multiple,
    labelPlacement,
    disabled = false,
    placeholder,
  } = props;

  return (
    <Box
      alignItems="center"
      className="customSelect"
      display="flex"
      flexDirection={labelPlacement === "top" ? "column" : "row"}
    >
      {label && (
        <label>
          <Typography className="callout2 selectLabel">{label}</Typography>
        </label>
      )}
      <FormControl className="callout customSelectControl" variant="outlined">
        {!search ? (
          <Select
            className="select"
            classes={{
              root: "callout1",
            }}
            disabled={disabled}
            displayEmpty={true}
            onChange={(e) => onChange(e.target.value)}
            value={value}
            variant="outlined"
          >
            {options.map((option, index) => (
              <MenuItem key={index} value={extractVal(option)}>
                {extractLabel(option)}
              </MenuItem>
            ))}
          </Select>
        ) : (
          <Autocomplete
            classes={{
              inputRoot: "searchInputRoot callout1",
              input: "searchInput",
              root: "searchRoot",
            }}
            disableClearable={true}
            disableCloseOnSelect={disableCloseOnSelect}
            disabled={disabled}
            getOptionLabel={(option) => extractLabel(option, options)}
            getOptionSelected={(option, v) => {
              const optionVal = extractVal(option);
              const val = extractVal(v);
              return optionVal === val;
            }}
            multiple={multiple}
            onChange={(e, val) => onChange(val)}
            openOnFocus={true}
            options={options}
            renderInput={(params) => (
              <TextField {...params} placeholder={placeholder} variant="outlined" />
            )}
            renderOption={renderOption}
            size="small"
            value={value}
          />
        )}
      </FormControl>
    </Box>
  );
};
export default CustomSelect;

import React from "react";
import {
  FormControl,
  FormControlLabel,
  Select,
  MenuItem,
  Typography,
  TextField,
} from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import "./CustomSelect.scss";
import useStoreSettingsSelector from "../../hooks/useStoreSettingsSelector";

/**
 * @typedef {Object} OptionType
 * @property {string} label Option label.
 * @property {string|number} val Option value.
 */

/**
 * @typedef {Object} CustomSelectPropTypes
 * @property {function} onChange Callback that delegate select changes to caller.
 * @property {string|number} value Assign the selected value.
 * @property {Array<OptionType|string>} options List of options selectable.
 * @property {string} label Label for the dropdown.
 * @property {boolean} search Display autocomplete.
 */

/**
 * Provides a list to browse signal providers.
 *
 * @param {CustomSelectPropTypes} props Component properties.
 * @returns {JSX.Element} Component JSX.
 */
const CustomSelect = (props) => {
  const { label, onChange, options, value, search } = props;
  const storeSettings = useStoreSettingsSelector();

  return (
    <FormControlLabel
      className={"customSelect " + (storeSettings.darkStyle ? "dark" : "light")}
      control={
        <FormControl className="callout" variant="outlined">
          {!search ? (
            <Select
              className="select"
              classes={{
                root: "callout1",
              }}
              displayEmpty={true}
              onChange={(e) => onChange(e.target.value)}
              value={value}
              variant="outlined"
            >
              {options.map((item, index) => (
                <MenuItem key={index} value={typeof item === "object" ? item.val : item}>
                  {typeof item === "object" ? item.label : item}
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
              options={options}
              getOptionLabel={(option) => (typeof option === "object" ? option.label : option)}
              openOnFocus={true}
              renderInput={(params) => <TextField {...params} variant="outlined" />}
              disableClearable={true}
            />
          )}
        </FormControl>
      }
      label={<Typography className="callout2">{label}</Typography>}
      labelPlacement="start"
    />
  );
};
export default CustomSelect;

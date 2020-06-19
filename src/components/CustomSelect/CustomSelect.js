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
 * @typedef {Object} LabelExtraProps
 * @property {("start")} [labelPlacement]
 */

/**
 * @typedef {Object} CustomSelectPropTypes
 * @property {function} onChange Callback that delegate select changes to caller.
 * @property {OptionType|string|number} value Assign the selected value.
 * @property {Array<OptionType|string|number>} options List of options selectable.
 * @property {string} label Label for the dropdown.
 * @property {boolean} [search] Display autocomplete.
 */

/**
 * Provides a list to browse signal providers.
 *
 * @param {CustomSelectPropTypes} props Component properties.
 * @returns {JSX.Element} Component JSX.
 */
const CustomSelect = (props) => {
  const { label, onChange, options, value, search, ref } = props;
  const storeSettings = useStoreSettingsSelector();

  /**
   * @type {LabelExtraProps} extraProps
   */
  const extraProps = label === "" ? {} : { labelPlacement: "start" };

  return (
    <FormControlLabel
      className={"customSelect " + (storeSettings.darkStyle ? "dark" : "light")}
      control={
        <FormControl className="callout customSelectControl" variant="outlined">
          {!search ? (
            <Select
              className="select"
              classes={{
                root: "callout1",
              }}
              displayEmpty={true}
              onChange={(e) => onChange(e.target.value)}
              ref={ref}
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
              disableClearable={true}
              getOptionLabel={(option) =>
                typeof option === "object" ? option.label : option.toString()
              }
              onChange={(e, val) => onChange(val)}
              openOnFocus={true}
              options={options}
              renderInput={(params) => <TextField {...params} variant="outlined" />}
              value={value}
            />
          )}
        </FormControl>
      }
      label={label ? <Typography className="callout2 selectLabel">{label}</Typography> : null}
      {...extraProps}
    />
  );
};
export default CustomSelect;

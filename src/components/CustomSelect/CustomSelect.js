import React from "react";
import { FormControl, FormControlLabel, Select, MenuItem, Typography } from "@material-ui/core";
import "./CustomSelect.scss";

/**
 * @typedef {Object} OptionType
 * @property {string} label Option label.
 * @property {string} val Option value.
 */

/**
 * @typedef {Object} CustomSelectPropTypes
 * @property {function} onChange Callback that delegate select changes to caller.
 * @property {string|number} value Assign the selected value.
 * @property {Array<OptionType>} options List of options selectable.
 * @property {string} label Label for the dropdown.
 */

/**
 * Provides a list to browse signal providers.
 *
 * @param {CustomSelectPropTypes} props Component properties.
 * @returns {JSX.Element} Component JSX.
 */
const CustomSelect = (props) => {
  const { label, onChange, options, value } = props;
  return (
    <FormControlLabel
      className="customSelect"
      control={
        <FormControl className="callout" variant="outlined">
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
              <MenuItem key={index} value={item.val}>
                item.label
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      }
      label={<Typography className="callout2">{label}</Typography>}
      labelPlacement="start"
    />
  );
};
export default CustomSelect;

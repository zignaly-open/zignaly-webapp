import React from "react";
import PropTypes from "prop-types";
import { FormControl, FormControlLabel, Select, MenuItem, Typography } from "@material-ui/core";
import "./CustomSelect.scss";

/**
 * @typedef {Object} CustomSelectPropTypes
 * @property {function} onChange Callback that delegate select changes to caller.
 * @property {string|number} value Assign the selected value.
 * @property {Array<Object|string>} options List of options selectable.
 * @property {string} label Label for the dropdown.
 */

/**
 * Provides a list to browse signal providers.
 *
 * @param {CustomSelectPropTypes} props Component properties.
 * @returns {Object} Component JSX.
 */
const CustomSelect = ({ options, onChange, value, label }) => {
  return (
    <FormControlLabel
      className="customSelect"
      control={
        <FormControl className="callout" variant="outlined">
          <Select
            classes={{
              root: "callout1",
            }}
            className="select"
            displayEmpty={true}
            onChange={(e) => onChange(e.target.value)}
            value={value}
            variant="outlined"
          >
            {options.map((item, index) => (
              <MenuItem key={index} value={item.val !== undefined ? item.val : item}>
                {item.label !== undefined ? item.label : item}
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

CustomSelect.propTypes = {
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.array.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};
export default CustomSelect;

import React from "react";
import PropTypes from "prop-types";
import { FormControl, FormControlLabel, Select, MenuItem, Typography } from "@material-ui/core";
import "./CustomSelect.scss";

const CustomSelect = ({ options, onChange, value, label, className }) => {
  return (
    <FormControlLabel
      className="customSelect"
      control={
        <FormControl className="callout" variant="outlined">
          <Select
            classes={{
              root: "callout1",
            }}
            className={`select ${className}`}
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

CustomSelect.defaultProps = {
  className: "",
};

CustomSelect.propTypes = {
  className: PropTypes.string,
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.array.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};
export default CustomSelect;

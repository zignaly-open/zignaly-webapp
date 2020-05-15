import React from "react"
import PropTypes from "prop-types"
import {
  FormControl,
  FormControlLabel,
  Select,
  MenuItem,
  Typography,
} from "@material-ui/core"
import "./CustomSelect.sass"

const CustomSelect = ({ options, onChange, value, label, className }) => {
  return (
    <FormControlLabel
      control={
        <FormControl variant="outlined" className="callout">
          <Select
            value={value}
            onChange={e => onChange(e.target.value)}
            displayEmpty={true}
            variant="outlined"
            className={`select ${className}`}
            classes={{
              root: "callout1",
            }}
          >
            {options.map((item, index) => (
              <MenuItem
                key={index}
                value={item.val !== undefined ? item.val : item}
              >
                {item.label !== undefined ? item.label : item}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      }
      labelPlacement="start"
      label={<Typography className="callout2">{label}</Typography>}
      className="customSelect"
    />
  )
}

CustomSelect.propTypes = {
  options: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  label: PropTypes.string.isRequired,
  className: PropTypes.string,
}
export default CustomSelect

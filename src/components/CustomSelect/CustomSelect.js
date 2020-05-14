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

const CustomSelect = ({ options, handleChange, value, label }) => {
  //   const { loading, className, children, onClick, disabled } = props

  return (
    <FormControlLabel
      control={
        <FormControl variant="outlined" className="callout">
          <Select
            value={value}
            onChange={e => handleChange(e.target.value)}
            variant="outlined"
            className="select"
            classes={{
              root: "callout1",
            }}
          >
            {options.map((item, index) => (
              <MenuItem key={index} value={item}>
                {item}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      }
      labelPlacement="start"
      label={<Typography className="callout2">{label}</Typography>}
      className="selectTimeFrame"
    />
  )
}

export default CustomSelect

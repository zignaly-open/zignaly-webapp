import React, { useState } from "react"
import PropTypes from "prop-types"
import {
  FormControl,
  FormControlLabel,
  Select,
  MenuItem,
  Typography
} from "@material-ui/core"
import "../../styles/common.sass"
import "./selectTimeFrame.sass"

const SelectTimeFrame = props => {
  const [value, setValue] = useState(0)
  const handleChange = val => {
    setValue(val)
    props.onChange(val)
  }
  const dates = [
    { label: "Last month", val: 0 },
    { label: "Last 90 days", val: 0 },
    { label: "Last year", val: 1 },
  ]
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
            {dates.map((item, index) => (
              <MenuItem key={index} value={item.val}>
                {item.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      }
      labelPlacement="start"
      label={<Typography className="callout2">Returns Timeframe</Typography>}
      className="selectTimeFrame"
      spacing={0}
    />
  )
}

SelectTimeFrame.propTypes = {
  onChange: PropTypes.func,
}

export default SelectTimeFrame

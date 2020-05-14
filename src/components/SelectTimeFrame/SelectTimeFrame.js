import React, { useState } from "react"
import PropTypes from "prop-types"
import {
  FormGroup,
  FormControl,
  FormControlLabel,
  Select,
  MenuItem,
  Typography,
} from "@material-ui/core"

import "./selectTimeFrame.sass"

const SelectTimeFrame = props => {
  const [value, setValue] = useState(0)
  const handleChange = val => {
    setValue(val)
    props.onChange(val)
  }
  return (
    <>
      {/* <FormGroup row> */}
      <FormControlLabel
        control={
          <Select
            value={value}
            onChange={e => handleChange(e.target.value)}
            variant="outlined"
            className="select"
          >
            <MenuItem value={0}>Last month</MenuItem>
            <MenuItem value={1}>Last year</MenuItem>
          </Select>
        }
        labelPlacement="start"
        label={<Typography className="callout2">Returns Timeframe</Typography>}
        className="selectTimeFrame"
      ></FormControlLabel>
      {/* /> */}
      {/* <FormControl variant="outlined" className="selectInput"></FormControl> */}
      {/* </FormGroup> */}
    </>
  )
}

SelectTimeFrame.propTypes = {
  onChange: PropTypes.func,
}

export default SelectTimeFrame

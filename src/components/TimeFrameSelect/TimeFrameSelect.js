import React, { useState } from "react"
import PropTypes from "prop-types"
import { Box } from "@material-ui/core"
import CustomSelect from "../CustomSelect"
import "../../styles/common.scss"
import "./TimeFrameSelect.scss"

const timeframes = [
  { label: "Last month", val: 0 },
  { label: "Last 90 days", val: 1 },
  { label: "Last year", val: 2 },
]

const TimeFrameSelect = ({ onChange }) => {
  const [val, setVal] = useState(timeframes[1].val)

  const handleChange = val => {
    setVal(val)
    onChange(val)
  }

  return (
    <Box className="selectTimeFrame">
      <CustomSelect
        options={timeframes}
        onChange={handleChange}
        value={val}
        label="Analytics Timeframe"
      />
    </Box>
  )
}

TimeFrameSelect.propTypes = {
  onChange: PropTypes.func,
}

export default TimeFrameSelect

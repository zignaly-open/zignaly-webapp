// import React, { useState } from "react"
// import PropTypes from "prop-types"
// import {
//   FormControl,
//   FormControlLabel,
//   Select,
//   MenuItem,
//   Typography,
// } from "@material-ui/core"
// import "../../styles/common.sass"
// import "./selectTimeFrame.sass"
// import useDropdown from "../../hooks/useDropdown"

// const timeframes = [
//   { label: "Last month", val: 0 },
//   { label: "Last 90 days", val: 1 },
//   { label: "Last year", val: 2 },
// ]

// const SelectTimeFrame = props => {
//   // const [value, setValue] = useState(0)
//   const [timeframe, TimeFrameDropdown] = useDropdown(0, "", timeframes)
//     // const handleChange = val => {
//     //   setValue(val)
//     //   props.onChange(val)
//     // }
//      useEffect(() => {
//        // do something when value changes
//      }, [timeframe])

//   return <TimeFrameDropdown />
// }

// SelectTimeFrame.propTypes = {
//   onChange: PropTypes.func,
// }

// export default SelectTimeFrame

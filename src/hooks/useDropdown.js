// import React, { useState } from "react"
// import PropTypes from "prop-types"
// import {
//   FormControl,
//   FormControlLabel,
//   Select,
//   MenuItem,
//   Typography,
// } from "@material-ui/core"

// const useDropdown = (label, defaultstate, options) => {
//   const [state, setState] = useState(defaultState)
//   const Dropdownmaker = () => (
//     //   <label htmlFor={label}>
//     //     {label}
//     //       <select
//     //       id={label}
//     //       value={state}
//     //       onChange={e=>setState(e.target.value)}
//     //       onBlur={e=>setState(e.target.value)}
//     //       disabled={!options.length}
//     //         >
//     //         <option>All</option>
//     //         {options.map(item=>
//     //         <option key={item} value={item}>{item}</option>)}
//     //       </select>
//     //     </label>
//     <FormControlLabel
//       control={
//         <FormControl variant="outlined" className="callout">
//           <Select
//             value={value}
//             onChange={e => handleChange(e.target.value)}
//             variant="outlined"
//             className="select"
//             classes={{
//               root: "callout1",
//             }}
//           >
//             {options.map((item, index) => (
//               <MenuItem key={index} value={options.val}>
//                 {options.label}
//               </MenuItem>
//             ))}
//           </Select>
//         </FormControl>
//       }
//       labelPlacement="start"
//       label={<Typography className="callout2">Returns Timeframe</Typography>}
//       className="selectTimeFrame"
//     />
//   )
//   return [state, Dropdownmaker, setState]
// }

// export default useDropdown

import React, { useState } from "react";
import { Box, FormControl, Select, MenuItem } from "@material-ui/core";

const UserExchangeList = () => {
  const [exchange, setExchange] = useState(10);

  /**
   *
   * @typedef {Object} TargetObject
   * @property {Number} value
   */

  /**
   *
   * @typedef {Object} EventObject
   * @property {TargetObject} target
   */

  /**
   *
   * @param {EventObject} event
   */
  const handleChange = (event) => setExchange(event.target.value);

  return (
    <Box className="userExchangeList">
      <FormControl className="selectInput" variant="outlined">
        <Select onChange={handleChange} value={exchange}>
          <MenuItem value={10}>Binance</MenuItem>
          <MenuItem value={20}>KuCoin</MenuItem>
          <MenuItem value={30}>Zignaly</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};

export default UserExchangeList;

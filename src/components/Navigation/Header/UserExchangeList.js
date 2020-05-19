import React, { useState } from "react";
import { Box, FormControl, Select, MenuItem } from "@material-ui/core";

const UserExchangeList = () => {
  const [exchange, setExchange] = useState(10);

  /**
   * @typedef {import('react').ChangeEvent} ChangeEvent
   */

  /**
   * Repeat password change state handling.
   *
   * @param {ChangeEvent} event Change event.
   * @return {void}
   */

  const handleChange = (event) => {
    const targetElement = /** @type {HTMLSelectElement} */ (event.target);
    let value = parseInt(targetElement.value);
    setExchange(value);
  };

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

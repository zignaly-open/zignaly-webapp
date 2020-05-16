import React, { useState } from "react";
import { Box, FormControl, Select, MenuItem } from "@material-ui/core";

const UserExchangeList = () => {
  const [exchange, setExchange] = useState(10);

  return (
    <Box className="userExchangeList">
      <FormControl variant="outlined" className="selectInput">
        <Select value={exchange} onChange={(e) => setExchange(e.target.value)}>
          <MenuItem value={10}>Binance</MenuItem>
          <MenuItem value={20}>KuCoin</MenuItem>
          <MenuItem value={30}>Zignaly</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};

export default UserExchangeList;

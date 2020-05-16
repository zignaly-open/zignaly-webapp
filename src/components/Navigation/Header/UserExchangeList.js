import React, { useState } from "react";
import { Box, FormControl, Select, MenuItem } from "@material-ui/core";

const UserExchangeList = () => {
  const [exchange, setExchange] = useState(10);

  return (
    <Box className="userExchangeList">
      <FormControl className="selectInput" variant="outlined">
        <Select onChange={e => setExchange(e.target.value)} value={exchange}>
          <MenuItem value={10}>Binance</MenuItem>
          <MenuItem value={20}>KuCoin</MenuItem>
          <MenuItem value={30}>Zignaly</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};

export default UserExchangeList;

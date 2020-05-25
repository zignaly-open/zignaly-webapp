import React, { useState, useEffect } from "react";
import { Box, FormControl, Select, MenuItem } from "@material-ui/core";
import { useSelector } from "react-redux";

/**
 * @typedef {import('../../../store/initialState').DefaultState} DefaultState
 */

const UserExchangeList = () => {
  /**
   * Settings darkStyle selector.
   *
   * @param {DefaultState} state Redux store state data.
   */

  const selector = (state) => state.user.exchangeConnections;
  const exchangeConnections = useSelector(selector);
  const [selectedExchange, setSelectedExchange] = useState("");

  useEffect(() => {
    if (exchangeConnections.length) {
      setSelectedExchange(exchangeConnections[0].exchangeName);
    }
  }, [exchangeConnections]);

  /**
   * Select change handler.
   *
   * @param {React.ChangeEvent<{name: string, value: string}>} event Change event.
   *
   * @returns {Void} No return.
   */
  const handleChange = (event) => {
    setSelectedExchange(event.target.value);
  };

  return (
    <Box className="userExchangeList">
      <FormControl className="selectInput" variant="outlined">
        <Select onChange={handleChange} value={selectedExchange}>
          {exchangeConnections &&
            exchangeConnections.map((item, index) => (
              <MenuItem key={index} value={item.exchangeName}>
                {item.exchangeName}
              </MenuItem>
            ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default UserExchangeList;

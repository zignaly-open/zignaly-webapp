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

  const selector = (state) => state.userExchanges;
  const userExchanges = useSelector(selector);
  const [selectedExchange, setSelectedExchange] = useState("");

  useEffect(() => {
    if (userExchanges.length) {
      setSelectedExchange(userExchanges[0].exchangeName);
    }
  }, [userExchanges]);

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
    let value = targetElement.value;
    setSelectedExchange(value);
  };

  return (
    <Box className="userExchangeList">
      <FormControl className="selectInput" variant="outlined">
        <Select onChange={handleChange} value={selectedExchange}>
          {userExchanges &&
            userExchanges.map((item, index) => (
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

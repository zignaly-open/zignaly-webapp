import React, { useState, useEffect } from "react";
import { Box, FormControl, Select, MenuItem } from "@material-ui/core";
import tradeApi from "../../../services/tradeApiClient";

const UserExchangeList = () => {
  const [exchange, setExchange] = useState("");
  const [exchangeList, setExchangeList] = useState([]);

  const authenticateUser = async () => {
    const loginPayload = {
      email: "mailxuftg1pxzk@example.test",
      password: "abracadabra",
    };

    return await tradeApi.userLogin(loginPayload);
  };

  useEffect(() => {
    const loadUserExchanges = async () => {
      try {
        const userEntity = await authenticateUser();
        const sessionPayload = {
          token: userEntity.token,
        };
        const responseData = await tradeApi.userExchangesGet(sessionPayload);
        setExchangeList(responseData);
        if (responseData.length) {
          setExchange(responseData[0].exchangeName);
        }
      } catch (e) {
        // TODO: Display error in alert.
      }
    };

    loadUserExchanges();
  }, []);

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
    setExchange(value);
  };

  return (
    <Box className="userExchangeList">
      <FormControl className="selectInput" variant="outlined">
        <Select onChange={handleChange} value={exchange}>
          {exchangeList.map((item, index) => (
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

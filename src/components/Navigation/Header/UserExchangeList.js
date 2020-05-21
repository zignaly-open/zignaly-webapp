import React, { useState, useEffect } from "react";
import { Box, FormControl, Select, MenuItem } from "@material-ui/core";
import tradeApi from "../../../services/tradeApiClient";

const UserExchangeList = () => {
  const [exchange, setExchange] = useState(10);
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
        console.log(responseData);
        setExchangeList(responseData);
      } catch (e) {
        // TODO: Display error in alert.
        console.log(e);
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

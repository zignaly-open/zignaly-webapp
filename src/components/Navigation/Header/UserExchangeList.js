import React, { useState, useEffect } from "react";
import { Box, FormControl, Select, MenuItem } from "@material-ui/core";
import tradeApi from "../../../services/tradeApiClient";
import { useSelector, useDispatch } from "react-redux";
import { addUserExchanges } from "../../../store/actions/userExchanges";

/**
 * @typedef {import('../../../store/initialState').DefaultState} DefaultState
 * @typedef {import('../../../services/tradeApiClient.types').ExchangeConnectionEntity} ExchangeConnectionEntity
 */

const UserExchangeList = () => {
  /**
   * Settings darkStyle selector.
   *
   * @param {DefaultState} state Redux store state data.
   * @return {Array<ExchangeConnectionEntity>} Flag that indicates if darkStyle is enabled.
   */

  const selector = (state) => state.userExchanges;
  const dispatch = useDispatch();
  const userExchanges = useSelector(selector);
  const [selectedExchange, setSelectedExchange] = useState("");

  useEffect(() => {
    if (userExchanges.length) {
      setSelectedExchange(userExchanges[0].exchangeName);
    }
  }, [userExchanges]);

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
        dispatch(addUserExchanges(responseData));
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

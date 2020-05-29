import React, { useState, useEffect } from "react";
import { Box, FormControl, Select, MenuItem } from "@material-ui/core";
import { useSelector, useDispatch } from "react-redux";
import { setSelectedExchange } from "../../../store/actions/settings";
import ZignalyIcon from "../../../images/exchanges/zignaly.svg";
import BinanceIcon from "../../../images/exchanges/binance.svg";
import KucoinIcon from "../../../images/exchanges/kucoin.svg";

/**
 * @typedef {import('../../../store/initialState').DefaultState} DefaultState
 */

const UserExchangeList = () => {
  /**
   * Default redux State.
   *
   * @param {DefaultState} state Redux store state data.
   */

  const exchangeConnectionsSelector = (state) => state.user.exchangeConnections;
  const exchangeConnections = useSelector(exchangeConnectionsSelector);

  /**
   *
   * @param {DefaultState} state
   */
  const selectedExchangeSelector = (state) => state.settings.selectedExchange;
  const selectedExchange = useSelector(selectedExchangeSelector);
  const dispatch = useDispatch();
  /**
   * Select change handler.
   *
   * @param {React.ChangeEvent<{name: string, value: string}>} event Change event.
   *
   * @returns {Void} No return.
   */
  const handleChange = (event) => {
    let found = [...exchangeConnections].find((item) => item.internalId === event.target.value);
    if (found) {
      dispatch(setSelectedExchange(found));
    }
  };

  console.log(exchangeConnections);

  return (
    <Box className="userExchangeList">
      <FormControl className="selectInput" variant="outlined">
        <Select
          onChange={handleChange}
          value={selectedExchange.internalId}
          classes={{ root: "root" }}
        >
          {exchangeConnections &&
            exchangeConnections.map((item, index) => (
              <MenuItem className="exchangeListItem" key={index} value={item.internalId}>
                {item.name.toLowerCase() === "binance" && <img src={BinanceIcon} alt="zignaly" />}
                {item.name.toLowerCase() === "zignaly" && <img src={ZignalyIcon} alt="zignaly" />}
                {item.name.toLowerCase() === "kucoin" && <img src={KucoinIcon} alt="zignaly" />}
                <span className="name"> {item.internalName} </span>
                {item.paperTrading && <span className="name"> (DEMO) </span>}
              </MenuItem>
            ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default UserExchangeList;

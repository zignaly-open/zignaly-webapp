import React, { useState } from "react";
import { Box, Slide, MenuItem, Typography } from "@material-ui/core";
import { useSelector, useDispatch } from "react-redux";
import { setSelectedExchange } from "../../../store/actions/settings";
import ZignalyIcon from "../../../images/exchanges/zignaly.svg";
import BinanceIcon from "../../../images/exchanges/binance.svg";
import KucoinIcon from "../../../images/exchanges/kucoin.svg";
import CloseBlack from "../../../images/sidebar/closeBlack.svg";
import CloseWhite from "../../../images/sidebar/closeWhite.svg";
import { FormattedMessage } from "react-intl";

/**
 * @typedef {import('../../../store/initialState').DefaultState} DefaultState
 */

const MobileExchangeList = () => {
  const [list, showList] = useState(false);

  /**
   * Settings darkStyle selector.
   *
   * @param {DefaultState} state Redux store state data.
   * @return {boolean} Flag that indicates if darkStyle is enabled.
   */
  const selector = (state) => state.settings.darkStyle;
  const darkStyle = useSelector(selector);

  /**
   * Default redux State.
   *
   * @param {DefaultState} state Redux store state data.
   */

  const exchangeConnectionsSelector = (state) => state.user.exchangeConnections;
  const exchangeConnections = useSelector(exchangeConnectionsSelector);

  /**
   *
   * @typedef {import("../../../store/initialState").ExchangeConnectionEntity} ExchangeConnectionEntity
   */

  /**
   *
   * @param {DefaultState} state Default retux state.
   * @returns {ExchangeConnectionEntity} Exchange connections object.
   */
  const selectedExchangeSelector = (state) => state.settings.selectedExchange;
  const selectedExchange = useSelector(selectedExchangeSelector);
  const dispatch = useDispatch();
  /**
   * Select change handler.
   *
   * @param {ExchangeConnectionEntity} item Change event.
   *
   * @returns {Void} No return.
   */
  const handleChange = (item) => {
    dispatch(setSelectedExchange(item));
  };

  return (
    <Box className="mobileExchangeList">
      <Box
        alignItems="center"
        className="currentSelectionBox"
        display="flex"
        flexDirection="row"
        justifyContent="flex-start"
        onClick={() => showList(true)}
      >
        {selectedExchange.name.toLowerCase() === "binance" && (
          <img alt="zignaly" src={BinanceIcon} />
        )}
        {selectedExchange.name.toLowerCase() === "zignaly" && (
          <img alt="zignaly" src={ZignalyIcon} />
        )}
        {selectedExchange.name.toLowerCase() === "kucoin" && <img alt="zignaly" src={KucoinIcon} />}
        <span className="name"> {selectedExchange.internalName} </span>
        {selectedExchange.paperTrading && <span className="name"> (DEMO) </span>}
      </Box>

      <Slide direction="up" in={list}>
        <Box bgcolor="grid.content" className="mobileExchangeListDrawer hideScroll">
          <Box
            alignItems="center"
            className="drawerHeader"
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
          >
            <Typography variant="h3">
              <FormattedMessage id="menu.exchangeSelectionTitle" />
            </Typography>
            <img
              alt="zignaly"
              onClick={() => showList(false)}
              src={darkStyle ? CloseWhite : CloseBlack}
            />
          </Box>
          {exchangeConnections &&
            exchangeConnections.map((item, index) => (
              <MenuItem
                className={
                  "mobileExchangeListItem " +
                  (selectedExchange.internalId === item.internalId ? "selected" : "")
                }
                key={index}
                onClick={() => handleChange(item)}
              >
                {item.name.toLowerCase() === "binance" && <img alt="zignaly" src={BinanceIcon} />}
                {item.name.toLowerCase() === "zignaly" && <img alt="zignaly" src={ZignalyIcon} />}
                {item.name.toLowerCase() === "kucoin" && <img alt="zignaly" src={KucoinIcon} />}
                <span className="name"> {item.internalName} </span>
                {item.paperTrading && <span className="name"> (DEMO) </span>}
              </MenuItem>
            ))}
        </Box>
      </Slide>
    </Box>
  );
};

export default MobileExchangeList;

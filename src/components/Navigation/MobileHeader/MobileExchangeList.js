import React, { useState } from "react";
import { Box, Slide, MenuItem, Typography } from "@material-ui/core";
import { useSelector, useDispatch } from "react-redux";
import { setSelectedExchange } from "../../../store/actions/settings";
import ZignalyIcon from "../../../images/exchanges/zignaly.svg";
import BinanceIcon from "../../../images/exchanges/binance.svg";
import KucoinIcon from "../../../images/exchanges/kucoin.svg";
import CloseBlack from "../../../images/sidebar/closeBlack.svg";
import CloseWhite from "../../../images/sidebar/closeWhite.svg";
import MyExchange from "../../../images/header/myExchange.svg";
import { FormattedMessage } from "react-intl";
import ExchangeIcon from "../../ExchangeIcon";
import { openExchangeConnectionView } from "../../../store/actions/ui";
import useStoreSettingsSelector from "../../../hooks/useStoreSettingsSelector";
import useStoreExchangeConnectionSelector from "../../../hooks/useStoreExchangeConnectionSelector";

/**
 * @typedef {import('../../../store/initialState').DefaultState} DefaultState
 */

const MobileExchangeList = () => {
  const [list, showList] = useState(false);
  const storeSettings = useStoreSettingsSelector();
  const storeUser = useStoreExchangeConnectionSelector();
  const dispatch = useDispatch();

  /**
   *
   * @typedef {import("../../../store/initialState").ExchangeConnectionEntity} ExchangeConnectionEntity
   */
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
        {storeSettings.selectedExchange.name.toLowerCase() === "binance" && (
          <img alt="zignaly" src={BinanceIcon} />
        )}
        {storeSettings.selectedExchange.name.toLowerCase() === "zignaly" && (
          <img alt="zignaly" src={ZignalyIcon} />
        )}
        {storeSettings.selectedExchange.name.toLowerCase() === "kucoin" && (
          <img alt="zignaly" src={KucoinIcon} />
        )}
        <span className="name"> {storeSettings.selectedExchange.internalName} </span>
        {storeSettings.selectedExchange.paperTrading && (
          <span className="name">
            (<FormattedMessage id="menu.demo" />){" "}
          </span>
        )}
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
              className="closeIcon"
              onClick={() => showList(false)}
              src={storeSettings.darkStyle ? CloseWhite : CloseBlack}
            />
          </Box>
          {storeUser.exchangeConnections &&
            storeUser.exchangeConnections.map((item, index) => (
              <MenuItem
                className={
                  "mobileExchangeListItem " +
                  (storeSettings.selectedExchange.internalId === item.internalId ? "selected" : "")
                }
                key={index}
                onClick={() => handleChange(item)}
              >
                <ExchangeIcon exchange={item.name.toLowerCase()} size="medium" />
                <span className="name"> {item.internalName} </span>
                {item.paperTrading && <span className="name"> (DEMO) </span>}
              </MenuItem>
            ))}
          <MenuItem
            className="exchangeListItem action"
            onClick={() => dispatch(openExchangeConnectionView(true))}
          >
            <img src={MyExchange} alt="zignaly" />
            <span className="name">
              <FormattedMessage id="menu.manageaccounts" />
            </span>
          </MenuItem>
        </Box>
      </Slide>
    </Box>
  );
};

export default MobileExchangeList;

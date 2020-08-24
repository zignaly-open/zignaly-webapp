import React, { useState } from "react";
import "./MobileExchangeList.scss";
import { Box, Slide, Typography } from "@material-ui/core";
import CloseBlack from "../../../../images/sidebar/closeBlack.svg";
import CloseWhite from "../../../../images/sidebar/closeWhite.svg";
import { FormattedMessage } from "react-intl";
import ExchangeIcon from "../../../ExchangeIcon";
import useStoreSettingsSelector from "../../../../hooks/useStoreSettingsSelector";
import ExchangeList from "../../Header/UserExchangeList/ExchangeList";
import DownIcon from "../../../../images/header/chevron-down.svg";

/**
 * @typedef {import('../../../../store/initialState').DefaultState} DefaultState
 */

const MobileExchangeList = () => {
  const [list, showList] = useState(false);
  const storeSettings = useStoreSettingsSelector();

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
        <ExchangeIcon exchange={storeSettings.selectedExchange.name.toLowerCase()} size="medium" />
        <span className="name"> {storeSettings.selectedExchange.internalName} </span>
        {storeSettings.selectedExchange.paperTrading && (
          <span className="name">
            (<FormattedMessage id="menu.demo" />){" "}
          </span>
        )}
        {storeSettings.selectedExchange.isTestnet && (
          <span className="name">
            (<FormattedMessage id="menu.testnet" />){" "}
          </span>
        )}
        <img src={DownIcon} />
      </Box>

      <Slide direction="up" in={list}>
        <Box bgcolor="grid.content" className="mobileExchangeListDrawer">
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
          <ExchangeList onClose={() => showList(false)} />
        </Box>
      </Slide>
    </Box>
  );
};

export default MobileExchangeList;

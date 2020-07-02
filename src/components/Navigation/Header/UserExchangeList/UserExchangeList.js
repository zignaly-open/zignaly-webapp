import React, { useState } from "react";
import { Box, Menu } from "@material-ui/core";
import useStoreSettingsSelector from "../../../../hooks/useStoreSettingsSelector";
import ExchangeList from "./ExchangeList";
import ExchangeIcon from "../../../ExchangeIcon";
import { FormattedMessage } from "react-intl";
import "./UserExchangeList.scss";

/**
 * @typedef {import('../../../../store/initialState').DefaultState} DefaultState
 */

const UserExchangeList = () => {
  const [anchorEl, setAnchorEl] = useState(undefined);
  const storeSettings = useStoreSettingsSelector();

  return (
    <Box className="userExchangeList">
      <Box
        alignItems="center"
        className="currentSelectionBox"
        display="flex"
        flexDirection="row"
        justifyContent="flex-start"
        onClick={(e) => setAnchorEl(e.currentTarget)}
      >
        <ExchangeIcon exchange={storeSettings.selectedExchange.name.toLowerCase()} size="small" />
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
      </Box>
      <Menu anchorEl={anchorEl} onClose={() => setAnchorEl(undefined)} open={Boolean(anchorEl)}>
        <ExchangeList onClose={() => setAnchorEl(undefined)} />
      </Menu>
    </Box>
  );
};

export default UserExchangeList;

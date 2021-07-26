import React, { useState } from "react";
import { Box, Popover } from "@material-ui/core";
import useSelectedExchange from "hooks/useSelectedExchange";
import ExchangeList from "./ExchangeList";
import ExchangeIcon from "../../../ExchangeIcon";
import { FormattedMessage } from "react-intl";
import "./UserExchangeList.scss";
import DownIcon from "../../../../images/header/chevron-down.svg";

/**
 * @typedef {import('../../../../store/initialState').DefaultState} DefaultState
 */

const UserExchangeList = () => {
  const [anchorEl, setAnchorEl] = useState(undefined);
  const selectedExchange = useSelectedExchange();

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
        <ExchangeIcon exchange={selectedExchange.name.toLowerCase()} size="small" />
        <span className="name"> {selectedExchange.internalName} </span>
        {selectedExchange.paperTrading && (
          <span className="name">
            (<FormattedMessage id="menu.demo" />){" "}
          </span>
        )}
        {selectedExchange.isTestnet && (
          <span className="name">
            (<FormattedMessage id="menu.testnet" />){" "}
          </span>
        )}
        <img src={DownIcon} />
      </Box>
      <Popover
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        onClose={() => setAnchorEl(undefined)}
        open={Boolean(anchorEl)}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <ExchangeList onClose={() => setAnchorEl(undefined)} />
      </Popover>
    </Box>
  );
};

export default UserExchangeList;

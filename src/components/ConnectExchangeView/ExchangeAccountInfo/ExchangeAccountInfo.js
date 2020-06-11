import React from "react";
import { Box, Typography } from "@material-ui/core";
import TotalEquity from "../../Balance/TotalEquity";
import CryptoComposition from "../../Balance/CryptoComposition";
import AvailableBalance from "../../Balance/AvailableBalance";
import ExchangeIcon from "../../ExchangeIcon";
import "./ExchangeAccountInfo.scss";

const ExchangeAccountInfo = ({ type }) => {
  return (
    <Box className="exchangeAccountInfo">
      <Box className="accountInfoHeader">
        {/* <ExchangeIcon exchange={item.name.toLowerCase()} size="small" /> */}
      </Box>
      <Box display="flex" flexDirection="row" className="accountData">
        <Box className="equityBox">
          <TotalEquity />
        </Box>
        <Box className="cryptoBox">
          <CryptoComposition />
        </Box>
      </Box>
      <Box className="balanceBox">
        <AvailableBalance />
      </Box>
    </Box>
  );
};

export default ExchangeAccountInfo;

import React from "react";
import { Box, Typography } from "@material-ui/core";
import TotalEquity from "../../Balance/TotalEquity";
import CryptoComposition from "../../Balance/CryptoComposition";
import AvailableBalance from "../../Balance/AvailableBalance";
import "./ExchangeAccountInfo.scss";

const ExchangeAccountInfo = ({ type }) => {
  return (
    <Box className="exchangeAccountInfo">
      {type}
      <Box className="equityBox">
        <TotalEquity />
      </Box>
      <Box className="cryptoBox">
        <CryptoComposition />
      </Box>
      <Box className="balanceBox">
        <AvailableBalance />
      </Box>
    </Box>
  );
};

export default ExchangeAccountInfo;

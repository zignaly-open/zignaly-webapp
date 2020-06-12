import React from "react";
import { Box, Typography } from "@material-ui/core";
import TotalEquity from "../../../Balance/TotalEquity";
import CryptoComposition from "../../../Balance/CryptoComposition";
import AvailableBalance from "../../../Balance/AvailableBalance";
import "./ExchangeAccountData.scss";
import useEquity from "../../../../hooks/useEquity";
import useBalance from "../../../../hooks/useBalance";

const ExchangeAccountData = ({ internalId }) => {
  const dailyBalance = useEquity(internalId);
  const balance = useBalance(internalId);

  return (
    <Box className="exchangeAccountData">
      <Box display="flex" flexDirection="row">
        <Box className="equityBox">
          {<TotalEquity balance={balance} dailyBalance={dailyBalance} />}
        </Box>
        <Box className="cryptoBox">
          <CryptoComposition dailyBalance={dailyBalance} />
        </Box>
      </Box>
      <Box className="balanceBox">
        <AvailableBalance balance={balance} />
      </Box>
    </Box>
  );
};

export default ExchangeAccountData;

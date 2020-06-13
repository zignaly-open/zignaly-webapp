import React from "react";
import { Box, Typography } from "@material-ui/core";
import TotalEquity from "../../../Balance/TotalEquity";
import CryptoComposition from "../../../Balance/CryptoComposition";
import AvailableBalance from "../../../Balance/AvailableBalance";
import ConnectedProvidersSummary from "../../../Providers/ConnectedProvidersSummary";
import "./ExchangeAccountData.scss";
import useEquity from "../../../../hooks/useEquity";
import useBalance from "../../../../hooks/useBalance";
import useConnectedProviders from "../../../../hooks/useConnectedProviders";

const ExchangeAccountData = ({ internalId }) => {
  const dailyBalance = useEquity(internalId);
  const balance = useBalance(internalId);
  const providers = useConnectedProviders(30, internalId);

  return (
    <Box className="exchangeAccountData">
      <Box display="flex" flexDirection="row" className="topBoxData">
        <Box className="equityBox">
          {<TotalEquity balance={balance} dailyBalance={dailyBalance} />}
        </Box>
        <Box className="cryptoBox">
          <CryptoComposition dailyBalance={dailyBalance} />
        </Box>
        <Box className="cardsBox" display="flex" flexDirection="column">
          <ConnectedProvidersSummary providers={providers} />
        </Box>
      </Box>
      <Box className="balanceBox">
        <AvailableBalance balance={balance} />
      </Box>
    </Box>
  );
};

export default ExchangeAccountData;

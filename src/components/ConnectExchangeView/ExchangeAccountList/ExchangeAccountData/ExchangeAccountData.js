import React from "react";
import { Box } from "@material-ui/core";
import TotalEquity from "../../../Balance/TotalEquity";
import CryptoComposition from "../../../Balance/CryptoComposition";
import AvailableBalance from "../../../Balance/AvailableBalance";
import ConnectedProvidersSummary from "../../../Providers/ConnectedProvidersSummary";
import "./ExchangeAccountData.scss";
import useEquity from "../../../../hooks/useEquity";
import useBalance from "../../../../hooks/useBalance";
import useConnectedProviders from "../../../../hooks/useConnectedProviders";

/**
 * @typedef {Object} DefaultProps
 * @property {string} internalId Exchange internal Id.
 */

/**
 * Provides data about the exchange account.
 * @param {DefaultProps} props Default props.
 * @returns {JSX.Element} Component JSX.
 */
const ExchangeAccountData = ({ internalId }) => {
  const dailyBalance = useEquity(internalId);
  const balance = useBalance(internalId);
  const providers = useConnectedProviders(30, internalId);

  return (
    <Box className="exchangeAccountData">
      <Box className="topBoxData" display="flex" flexDirection="row">
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

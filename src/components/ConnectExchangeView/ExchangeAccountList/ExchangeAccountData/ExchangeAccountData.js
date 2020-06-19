import React, { useContext } from "react";
import { Box, Typography } from "@material-ui/core";
import TotalEquity from "../../../Balance/TotalEquity";
import CryptoComposition from "../../../Balance/CryptoComposition";
import AvailableBalance from "../../../Balance/AvailableBalance";
import ConnectedProvidersSummary from "../../../Providers/ConnectedProvidersSummary";
import "./ExchangeAccountData.scss";
import useEquity from "../../../../hooks/useEquity";
import useBalance from "../../../../hooks/useBalance";
import useConnectedProviders from "../../../../hooks/useConnectedProviders";
import { FormattedMessage, useIntl } from "react-intl";
import ModalPathContext from "../../ModalPathContext";

/**
 * @typedef {Object} DefaultProps
 * @property {string} internalId Exchange internal Id.
 */

/**
 * Provides data about the exchange account.
 * @param {DefaultProps} props Default props.
 * @returns {JSX.Element} Component JSX.
 */
const ExchangeAccountData = ({ account }) => {
  const { navigateToPath } = useContext(ModalPathContext);
  const dailyBalance = useEquity(account.internalId);
  const balance = useBalance(account.internalId);
  const providers = useConnectedProviders(30, account.internalId);
  const intl = useIntl();

  return (
    <Box className="exchangeAccountData">
      <Box className="topBoxData" display="flex" flexDirection="row">
        <Box className="equityBox">
          {(!balance.totalBTC && account.isBrokerAccount && (
            <Box
              width={1}
              height={1}
              justifyContent="center"
              alignItems="center"
              display="flex"
              className="noBalance"
            >
              <Typography variant="h3">
                <FormattedMessage
                  id="accounts.deposit.make"
                  values={{
                    depositLink: (
                      <a onClick={() => navigateToPath("deposit")}>
                        {intl.formatMessage({ id: "accounts.deposit" }).toLowerCase()}
                      </a>
                    ),
                  }}
                />
              </Typography>
            </Box>
          )) ||
            (!account.paperTrading && (
              <TotalEquity balance={balance} dailyBalance={dailyBalance} />
            ))}
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

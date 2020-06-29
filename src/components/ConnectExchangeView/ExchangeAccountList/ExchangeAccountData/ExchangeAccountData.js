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
 * @typedef {import('../../../../services/tradeApiClient.types').ExchangeConnectionEntity} ExchangeConnectionEntity
 */

/**
 * @typedef {Object} DefaultProps
 * @property {ExchangeConnectionEntity} account Exchange account.
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
        {!account.paperTrading && (
          <>
            <Box className="equityBox">
              {(!balance.totalBTC && account.isBrokerAccount && (
                <Box
                  alignItems="center"
                  className="noBalance"
                  display="flex"
                  height={1}
                  justifyContent="center"
                  width={1}
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
              )) || <TotalEquity balance={balance} dailyBalance={dailyBalance} />}
            </Box>
            <Box className="cryptoBox">
              <CryptoComposition dailyBalance={dailyBalance} />
            </Box>
          </>
        )}
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

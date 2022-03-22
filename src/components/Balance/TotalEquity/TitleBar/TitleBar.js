import React from "react";
import "./TitleBar.scss";
import { Box, Typography } from "@mui/material";
import { FormattedMessage } from "react-intl";
import { formatFloat } from "../../../../utils/format";

/**
 * @typedef {import("../../../../services/tradeApiClient.types").ExchangeConnectionEntity} ExchangeConnectionEntity
 * @typedef {import("../../../../services/tradeApiClient.types").UserEquityEntity} UserEquityEntity
 * @typedef {UserEquityEntity} BalanceObject
 * @property {Number} totalBTC
 * @property {Number} totalUSDT
 * @property {Number} totalWalletBTC
 * @property {Number} totalWalletUSDT
 */

/**
 * @typedef {Object} DefaultProps
 * @property {BalanceObject} balance Balance
 * @property {ExchangeConnectionEntity} selectedExchange Selected Exchange.
 */

/**
 * @param {DefaultProps} props Default props.
 * @returns {JSX.Element} Component JSX.
 */
const TitleBar = ({ balance, selectedExchange }) => {
  return (
    <Box
      alignItems="center"
      className="titleBar"
      display="flex"
      flexDirection="row"
      justifyContent="space-between"
    >
      <Box
        alignItems="flex-start"
        display="flex"
        flexDirection="column"
        justifyContent="flex-start"
      >
        <Typography className="boxTitle" variant="h3">
          {selectedExchange.exchangeType === "futures" ? (
            <FormattedMessage id="balance.wallet" />
          ) : (
            <FormattedMessage id="dashboard.balance" />
          )}
        </Typography>
        <Box
          alignItems="center"
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
          mt={1}
        >
          <Typography className="number2">
            BTC{" "}
            {formatFloat(
              selectedExchange.exchangeType === "futures"
                ? balance.totalWalletBTC
                : balance.totalBTC,
            )}
          </Typography>
          <Typography className="smallText number3">
            = USDT{" "}
            {formatFloat(
              selectedExchange.exchangeType === "futures"
                ? balance.totalWalletUSDT
                : balance.totalUSDT,
            )}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default TitleBar;

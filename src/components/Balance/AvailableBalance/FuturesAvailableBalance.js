import React from "react";
import "./AvailableBalance.scss";
import { Box, Tooltip, Typography } from "@material-ui/core";
import { FormattedMessage } from "react-intl";
import { formatFloat } from "../../../utils/format";
import AllInclusiveIcon from "@material-ui/icons/AllInclusive";

/**
 * @typedef {import("../../../services/tradeApiClient.types").UserBalanceEntity} UserBalanceEntity
 * @typedef {import("../../../services/tradeApiClient.types").ExchangeConnectionEntity} ExchangeConnectionEntity
 * @typedef {Object} DefaultProps
 * @property {UserBalanceEntity} balance
 * @property {ExchangeConnectionEntity} selectedExchange
 */

/**
 * @param {DefaultProps} props Default props.
 * @returns {JSX.Element} Component JSX.
 */

const FuturesAvailableBalance = ({ balance, selectedExchange }) => {
  const color = balance && balance.pnlBTC >= 0 ? "green" : "red";

  return (
    <Box
      alignItems="center"
      className="availableBalance"
      display="flex"
      flexDirection="row"
      justifyContent="space-between"
    >
      {balance && (
        <>
          <Box
            alignItems="flex-start"
            className="dataBox"
            display="flex"
            flexDirection="column"
            justifyContent="flex-start"
          >
            <Box
              alignItems="center"
              display="flex"
              flexDirection="row"
              justifyContent="space-between"
              mb={1}
            >
              <Tooltip placement="top" title={<FormattedMessage id="balance.wallet.tooltip" />}>
                <Typography variant="h4">
                  <FormattedMessage id="balance.wallet" />
                </Typography>
              </Tooltip>
              <Typography className="number3 smallText">= USDT {formatFloat(0)}</Typography>
            </Box>
            <Box alignItems="center" display="flex" flexDirection="row" justifyContent="flex-start">
              <Typography className="number1">BTC {formatFloat(balance.totalLockedBTC)}</Typography>
              {/* <Typography className="number1 pnlPercent">
                {balance.totalLockedBTC && balance.totalBTC
                  ? formatFloat2Dec((balance.totalLockedBTC / balance.totalBTC) * 100)
                  : 0}
                %
              </Typography> */}
            </Box>
          </Box>
          <span className="operator">+</span>
          <Box
            alignItems="flex-start"
            className="dataBox"
            display="flex"
            flexDirection="column"
            justifyContent="flex-start"
          >
            <Box
              alignItems="center"
              display="flex"
              flexDirection="row"
              justifyContent="space-between"
              mb={1}
            >
              <Tooltip placement="top" title={<FormattedMessage id="balance.profit.tooltip" />}>
                <Typography variant="h4">
                  <FormattedMessage id="balance.profit" />
                </Typography>
              </Tooltip>

              <Typography className={`smallText number3 ${color}`}>
                = USDT {formatFloat(balance.pnlUSDT)}
              </Typography>
            </Box>
            <Box alignItems="center" display="flex" flexDirection="row" justifyContent="flex-start">
              <Typography className={`number1 ${color}`}>
                BTC {formatFloat(balance.pnlBTC)}
              </Typography>
              <Typography className={`number1 pnlPercent ${color}`}>0%</Typography>
            </Box>
          </Box>
          <span className="operator">=</span>
          <Box
            alignItems="flex-start"
            className="dataBox"
            display="flex"
            flexDirection="column"
            justifyContent="flex-start"
          >
            <Box
              alignItems="center"
              display="flex"
              flexDirection="row"
              justifyContent="space-between"
              mb={1}
            >
              <Tooltip placement="top" title={<FormattedMessage id="balance.margin.tooltip" />}>
                <Typography variant="h4">
                  <FormattedMessage id="balance.margin" />
                </Typography>
              </Tooltip>

              <Typography className="smallText number3">= USDT{formatFloat(0)}</Typography>
            </Box>
            <Typography className="number1">BTC{formatFloat(0)}</Typography>
          </Box>
          <span className="operator">&mdash;</span>
          <Box
            alignItems="flex-start"
            className="dataBox"
            display="flex"
            flexDirection="column"
            justifyContent="flex-start"
          >
            <Box
              alignItems="center"
              display="flex"
              flexDirection="row"
              justifyContent="space-between"
              mb={1}
            >
              <Tooltip placement="top" title={<FormattedMessage id="balance.current.tooltip" />}>
                <Typography variant="h4">
                  <FormattedMessage id="balance.current" />
                </Typography>
              </Tooltip>

              <Typography className="smallText number3">= USDT{formatFloat(0)}</Typography>
            </Box>
            <Typography className="number1">BTC{formatFloat(0)}</Typography>
          </Box>
          <span className="operator">=</span>
          <Box
            alignItems="flex-start"
            className="dataBox"
            display="flex"
            flexDirection="column"
            justifyContent="flex-start"
          >
            <Box
              alignItems="center"
              display="flex"
              flexDirection="row"
              justifyContent="space-between"
              mb={1}
            >
              <Tooltip placement="top" title={<FormattedMessage id="balance.available.tooltip" />}>
                <Typography variant="h4">
                  <FormattedMessage id="balance.available" />
                </Typography>
              </Tooltip>

              <Typography className="number3 smallText">
                = USDT{" "}
                {selectedExchange.paperTrading && !selectedExchange.isTestnet ? (
                  <AllInclusiveIcon className="infinity" />
                ) : (
                  formatFloat(0)
                )}
              </Typography>
            </Box>
            <Box alignItems="center" display="flex" flexDirection="row" justifyContent="flex-start">
              <Typography className="number1">
                BTC{" "}
                {selectedExchange.paperTrading && !selectedExchange.isTestnet ? (
                  <AllInclusiveIcon className="infinity" />
                ) : (
                  formatFloat(0)
                )}
              </Typography>
              {/* <Typography className="number1 pnlPercent">
                {balance.totalFreeBTC && balance.totalBTC
                  ? formatFloat2Dec((balance.totalFreeBTC / balance.totalBTC) * 100)
                  : 0}
                %
              </Typography> */}
            </Box>
          </Box>
        </>
      )}
    </Box>
  );
};

export default FuturesAvailableBalance;

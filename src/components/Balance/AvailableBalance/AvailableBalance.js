import React from "react";
import "./AvailableBalance.scss";
import { Box, Typography } from "@material-ui/core";
import { FormattedMessage } from "react-intl";
import { formatFloat2Dec, formatFloat } from "../../../utils/format";

/**
 * @typedef {import("../../../services/tradeApiClient.types").UserBalanceEntity} UserBalanceEntity
 * @typedef {Object} DefaultProps
 * @property {UserBalanceEntity} balance
 */

/**
 * @param {DefaultProps} props Default props.
 * @returns {JSX.Element} Component JSX.
 */

const AvailableBalance = ({ balance }) => {
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
              <Typography variant="h4">
                <FormattedMessage id="balance.available" />
              </Typography>
              <Typography className="smallText" variant="subtitle2">
                = USDT {formatFloat(balance.totalFreeUSDT)}
              </Typography>
            </Box>
            <Typography variant="h5">BTC {formatFloat(balance.totalFreeBTC)}</Typography>
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
              <Typography variant="h4">
                <FormattedMessage id="balance.invested" />
              </Typography>
              <Typography className="smallText" variant="subtitle2">
                = USDT {formatFloat(balance.totalLockedUSDT)}
              </Typography>
            </Box>
            <Typography variant="h5">BTC {formatFloat(balance.totalLockedBTC)}</Typography>
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
              <Typography variant="h4">
                <FormattedMessage id="balance.profit" />
              </Typography>
              <Typography className={`smallText ${color}`} variant="subtitle2">
                = USDT {formatFloat(balance.pnlUSDT)}
              </Typography>
            </Box>
            <Box alignItems="center" display="flex" flexDirection="row" justifyContent="flex-start">
              <Typography className={color} variant="h5">
                BTC {formatFloat(balance.pnlBTC)}
              </Typography>
              <Typography className={`pnlPercent ${color}`} variant="subtitle2">
                {balance.pnlBTC && balance.totalLockedBTC
                  ? formatFloat2Dec((balance.pnlBTC * 100) / balance.totalLockedBTC)
                  : 0}
                %
              </Typography>
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
              <Typography variant="h4">
                <FormattedMessage id="balance.total" />
              </Typography>
              <Typography className="smallText" variant="subtitle2">
                = USDT {formatFloat(balance.totalUSDT)}
              </Typography>
            </Box>
            <Typography variant="h5">BTC {formatFloat(balance.totalBTC)}</Typography>
          </Box>
        </>
      )}
    </Box>
  );
};

export default AvailableBalance;

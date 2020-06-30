import React from "react";
import "./AvailableBalance.scss";
import { Box, Typography } from "@material-ui/core";
import { FormattedMessage } from "react-intl";

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
                = USD {balance.totalFreeUSDT}
              </Typography>
            </Box>
            <Typography variant="h5">
              BTC {balance.totalFreeBTC ? balance.totalFreeBTC : 0}
            </Typography>
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
                = USD {balance.totalLockedUSDT}
              </Typography>
            </Box>
            <Typography variant="h5">
              BTC {balance.totalLockedBTC ? balance.totalLockedBTC : 0}
            </Typography>
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
              <Typography className="smallText" variant="subtitle2">
                = USD {balance.pnlUSDT}
              </Typography>
            </Box>
            <Typography variant="h5">BTC {balance.pnlBTC}</Typography>
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
                = USD {balance.totalUSDT}
              </Typography>
            </Box>
            <Typography variant="h5">BTC {balance.totalBTC}</Typography>
          </Box>
        </>
      )}
    </Box>
  );
};

export default AvailableBalance;

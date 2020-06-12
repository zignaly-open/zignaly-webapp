import React from "react";
import "./AvailableBalance.scss";
import { Box, Typography } from "@material-ui/core";
import { FormattedMessage } from "react-intl";
import useStoreUserSelector from "../../../hooks/useStoreUserSelector";

const AvailableBalance = (balance) => {
  return (
    <Box
      alignItems="center"
      className="availableBalance"
      display="flex"
      flexDirection="row"
      justifyContent="space-between"
    >
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
        <Typography variant="h5">BTC {balance.totalFreeBTC}</Typography>
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
        <Typography variant="h5">BTC {balance.totalLockedBTC}</Typography>
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
    </Box>
  );
};

export default AvailableBalance;

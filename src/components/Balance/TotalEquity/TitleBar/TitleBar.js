import React from "react";
import "./TitleBar.scss";
import { Box, Typography } from "@material-ui/core";
import { FormattedMessage } from "react-intl";
import { formatFloat } from "../../../../utils/format";

/**
 *
 * @typedef {Object} BalanceObject
 * @property {Number} totalBTC
 * @property {Number} totalUSDT
 */

/**
 * @typedef {Object} DefaultProps
 * @property {BalanceObject} balance Balance
 */

/**
 * @param {DefaultProps} props Default props.
 * @returns {JSX.Element} Component JSX.
 */
const TitleBar = ({ balance }) => {
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
          <FormattedMessage id="dashboard.balance" />
        </Typography>
        <Box
          alignItems="center"
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
          mt={1}
        >
          <Typography className="number2">BTC {formatFloat(balance.totalBTC)}</Typography>
          <Typography className="smallText number3">
            = USDT {formatFloat(balance.totalUSDT)}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default TitleBar;

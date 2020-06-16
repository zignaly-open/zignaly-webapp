import React from "react";
import "./Performance.scss";
import { Box, Typography } from "@material-ui/core";
import { FormattedMessage } from "react-intl";
import { formatCurrency } from "../../../../utils/format";
import PerformanceGraph from "./PerformanceGraph";

/**
 * @typedef {Object} DefaultProps
 * @property {import('../../../../services/tradeApiClient.types').DefaultProviderGetObject} provider
 */
/**
 * Performance component for CT profile.
 *
 * @param {DefaultProps} props Default props
 * @returns {JSX.Element} Component JSX.
 */
const PerformanceOverview = ({ provider }) => {
  return (
    <Box
      alignItems="flex-start"
      className="performanceOverview"
      display="flex"
      flexDirection="column"
      justifyContent="flex-start"
    >
      <Typography variant="h3">
        <FormattedMessage id="srv.performanceoverview" />
      </Typography>

      <Box className="infoBox" display="flex" flexDirection="column" alignItems="flex-start">
        <Box
          className="infoRow"
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="body1">
            <FormattedMessage id="srv.positionsopened" />
          </Typography>
          <Typography variant="h4">{provider.performance.openPositions}</Typography>
        </Box>

        <Box
          className="infoRow"
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="body1">
            {provider.copyTradingQuote}&nbsp;
            <FormattedMessage id="accounts.balance" />
          </Typography>
          <Typography variant="h4" className="green">
            {formatCurrency(provider.performance.totalBalance)}
          </Typography>
        </Box>

        <Box
          className="infoRow"
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="body1">
            <FormattedMessage id="srv.totalvol" />
          </Typography>
          <Typography variant="h4">
            {formatCurrency(provider.performance.totalTradingVolume)} {provider.copyTradingQuote}
          </Typography>
        </Box>
      </Box>

      <Box className="chartBox">
        <Typography variant="h4">
          <FormattedMessage id="srv.performance12weeks" />
        </Typography>
        <PerformanceGraph provider={provider} />
      </Box>
    </Box>
  );
};

export default PerformanceOverview;

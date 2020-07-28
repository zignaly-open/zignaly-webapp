import React, { useState, useEffect } from "react";
import "./Performance.scss";
import { Box, Typography, useMediaQuery } from "@material-ui/core";
import { FormattedMessage } from "react-intl";
import { formatCurrency } from "../../../../utils/format";
import PerformanceGraph from "./PerformanceGraph";
import { useTheme } from "@material-ui/core/styles";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [show, setShow] = useState(true);

  const initShow = () => {
    if (!isMobile) {
      setShow(true);
    } else {
      setShow(false);
    }
  };

  useEffect(initShow, [isMobile]);

  return (
    <Box
      alignItems="flex-start"
      className="performanceOverview"
      display="flex"
      flexDirection="column"
      justifyContent="flex-start"
    >
      {!isMobile && (
        <Typography variant="h3">
          <FormattedMessage id="srv.performanceoverview" />
        </Typography>
      )}

      {isMobile && (
        <Typography variant="h3" onClick={() => setShow(!show)}>
          <FormattedMessage id="srv.performanceoverview" />
          {show && <ExpandLessIcon className="expandIcon" />}
          {!show && <ExpandMoreIcon className="expandIcon" />}
        </Typography>
      )}

      {show && (
        <>
          <Box alignItems="flex-start" className="infoBox" display="flex" flexDirection="column">
            <Box
              alignItems="center"
              className="infoRow"
              display="flex"
              flexDirection="row"
              justifyContent="space-between"
            >
              <Typography variant="body1">
                <FormattedMessage id="srv.positionsopened" />
              </Typography>
              <Typography variant="h4">{provider.performance.openPositions}</Typography>
            </Box>

            <Box
              alignItems="center"
              className="infoRow"
              display="flex"
              flexDirection="row"
              justifyContent="space-between"
            >
              <Typography variant="body1">
                <FormattedMessage id="srv.positionsclosed" />
              </Typography>
              <Typography variant="h4">{provider.performance.closePositions}</Typography>
            </Box>

            {provider.isCopyTrading && (
              <Box
                alignItems="center"
                className="infoRow"
                display="flex"
                flexDirection="row"
                justifyContent="space-between"
              >
                <Typography variant="body1">
                  {provider.copyTradingQuote}&nbsp;
                  <FormattedMessage id="accounts.balance" />
                </Typography>
                <Typography className="green" variant="h4">
                  {formatCurrency(provider.performance.totalBalance)}
                </Typography>
              </Box>
            )}

            <Box
              alignItems="center"
              className="infoRow"
              display="flex"
              flexDirection="row"
              justifyContent="space-between"
            >
              <Typography variant="body1">
                <FormattedMessage id="srv.totalvol" />
              </Typography>
              <Typography variant="h4">
                {formatCurrency(provider.performance.totalTradingVolume)}{" "}
                {provider.copyTradingQuote}
              </Typography>
            </Box>
          </Box>

          <Box className="chartBox">
            <Typography variant="h4">
              <FormattedMessage id="srv.performance12weeks" />
            </Typography>
            <PerformanceGraph provider={provider} />
          </Box>
        </>
      )}
    </Box>
  );
};

export default PerformanceOverview;

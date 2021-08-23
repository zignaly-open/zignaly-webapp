import React from "react";
import "./Performance.scss";
import { Box, Typography } from "@material-ui/core";
import { FormattedMessage } from "react-intl";
import { formatPrice } from "utils/formatters";
import PerformanceGraph from "./PerformanceGraph";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import useProfileBoxShow from "../../../../hooks/useProfileBoxShow";

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
  const { show, setShow, isMobile } = useProfileBoxShow();

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
        <Typography onClick={() => setShow(!show)} variant="h3">
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
                  <FormattedMessage id="copyt.management.totalallocated" />
                </Typography>
                <Typography variant="h4">
                  {`${formatPrice(provider.performance.totalBalance, "", " ", true)}`}
                  {provider.maxAllocatedBalance &&
                    ` / ${formatPrice(provider.maxAllocatedBalance, "", " ", true)}`}
                  {` ${provider.copyTradingQuote}`}
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
                {formatPrice(provider.performance.totalTradingVolume, "", " ", true)}{" "}
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

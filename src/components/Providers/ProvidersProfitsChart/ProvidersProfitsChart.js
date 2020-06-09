import React, { useState } from "react";
import { Paper, Box, Typography, useMediaQuery, useTheme } from "@material-ui/core";
import BarChart from "../../Graphs/BarChart";
import { FormattedMessage } from "react-intl";
import "./ProvidersProfitsChart.scss";
import { formatFloat2Dec } from "../../../utils/format";

/**
 * @typedef {import("../../../services/tradeApiClient.types").ProvidersStatsCollection} ProvidersStatsCollection
 */

/**
 * @typedef {Object} ProvidersAnalyticsPropTypes
 * @property {ProvidersStatsCollection} stats Table stats data.
 * @property {string} quote Selected quote (base currency).
 * @property {string} base Selected base (pair).
 * @property {string} timeFrame Selected time frame.
 */

/**
 * Provides chart to display providers profits.
 *
 * @param {ProvidersAnalyticsPropTypes} props Component properties.
 * @returns {JSX.Element} Component JSX.
 */
const ProvidersProfitsChart = ({ stats, timeFrame, base, quote }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const values = stats.map((s) => s.percentageProfit);
  const images = stats.map((s) => s.logoUrl);
  const options = {};
  const tooltipFormat = (tooltipItems /* data */) =>
    `${stats[tooltipItems.index].name}: ${formatFloat2Dec(
      tooltipItems[isMobile ? "xLabel" : "yLabel"],
    )} %`;

  const [tabValue, setTabValue] = useState(0);

  /**
   * Map tab index to positions collection type.
   *
   * @returns {PositionsCollectionType} Collection type.
   */
  //   const mapIndexToCollectionType = () => {
  //     switch (tabValue) {
  //       case 1:
  //         return "sumProfit";

  //       default:
  //         return "percentageProfit";
  //     }
  //   };

  /**
   * Event handler to change tab value.
   *
   * @param {React.ChangeEvent<{checked: boolean}>} event Tab index to set active.
   * @param {Number} val Tab index to set active.
   * @returns {void}
   */
  //   const changeTab = (event, val) => {
  //     setTabValue(val);
  //   };

  //   const selectedType = mapIndexToCollectionType();

  return (
    <Paper className="providersProfitsChart">
      <Box
        className="profitsHeader"
        display="flex"
        flexDirection="row"
        flexWrap="wrap"
        justifyContent="space-between"
      >
        <Box display="flex" flexDirection="row">
          <Typography
            className={tabValue === 0 ? "selected" : null}
            onClick={() => setTabValue(0)}
            variant="h4"
          >
            <FormattedMessage id="srv.profitspercentage" />
          </Typography>
          <Typography
            className={tabValue === 1 ? "selected" : null}
            onClick={() => setTabValue(1)}
            variant="h4"
          >
            <FormattedMessage id="srv.netprofit" />
          </Typography>
        </Box>
        {/* <Typography variant="h3">Last 7 days / BTC / All Pairs</Typography> */}
        <Typography variant="h3">{`${timeFrame} / ${quote} / ${base}`}</Typography>
      </Box>
      <BarChart
        adjustHeightToContent={isMobile}
        horizontal={isMobile}
        images={images}
        options={options}
        tooltipFormat={tooltipFormat}
        values={values}
      />
    </Paper>
  );
};
export default ProvidersProfitsChart;

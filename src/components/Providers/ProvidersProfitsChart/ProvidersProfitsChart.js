import React, { useState } from "react";
import { Paper, Box, Typography, useMediaQuery } from "@material-ui/core";
import { useTheme } from "@material-ui/core/styles";
import BarChart from "../../Graphs/BarChart";
import { FormattedMessage } from "react-intl";
import "./ProvidersProfitsChart.scss";
import { formatFloat2Dec } from "../../../utils/format";

/**
 * @typedef {import("../../../services/tradeApiClient.types").ProviderStats} ProviderStats
 * @typedef {import("../../../services/tradeApiClient.types").ProvidersStatsCollection} ProvidersStatsCollection
 * @typedef {import('chart.js').ChartTooltipItem} ChartTooltipItem
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
  const [tabValue, setTabValue] = useState(0);

  /**
   * @type {'percentageProfit'|'sumTotalProfit'}
   */
  let key = "percentageProfit";
  let unit = "%";
  if (tabValue === 1) {
    key = "sumTotalProfit";
    unit = quote;
  }

  const statsSorted = stats
    .map((s) => ({ name: s.name, val: parseFloat(s[key]), logoUrl: s.logoUrl }))
    .sort((a, b) => b.val - a.val);
  const values = statsSorted.map((s) => s.val);
  const images = statsSorted.map((s) => s.logoUrl);
  const options = {};

  // Get base without quote
  let actualBase = base.split("/")[0] || base;

  /**
   * @param {ChartTooltipItem} tooltipItems Tooltip item.
   * @returns {string} Tooltip text.
   */
  const tooltipFormat = (tooltipItems /* data */) =>
    `${statsSorted[tooltipItems.index].name}: ${formatFloat2Dec(
      tooltipItems[isMobile ? "xLabel" : "yLabel"],
    )} ${unit}`;

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
        <Typography variant="h3">{`${timeFrame} / ${quote} / ${actualBase}`}</Typography>
      </Box>
      <BarChart
        adjustHeightToContent={isMobile}
        horizontal={isMobile}
        imageUrls={images}
        options={options}
        tooltipFormat={tooltipFormat}
        values={values}
      />
    </Paper>
  );
};
export default ProvidersProfitsChart;

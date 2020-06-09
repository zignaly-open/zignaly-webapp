import React, { useState } from "react";
import { Paper, Box, Typography, Tab, Tabs, useMediaQuery, useTheme } from "@material-ui/core";
import BarChart from "../../Graphs/BarChart";
import { FormattedMessage, useIntl } from "react-intl";
import "./ProvidersProfitsChart.scss";
import { formatFloat2Dec } from "../../../utils/format";

/**
 * @typedef {import("../../Graphs/LineChart/LineChart").ChartColorOptions} ChartColorOptions
 * @typedef {import("../../Graphs/LineChart/LineChart").ChartData} ChartData
 * @typedef {import("../../../services/tradeApiClient.types").ProvidersStatsCollection} ProvidersStatsCollection
 */

/**
 * @typedef {Object} ProvidersAnalyticsPropTypes
 * @property {string} type Type of provider to retreive.
 * @property {string} quote
 * @property {OptionType} base
 * @property {string} timeFrame
 * @property {ProvidersStatsCollection} stats Table stats data.
 */

/**
 * Provides chart to display providers profits.
 *
 * @param {ProvidersAnalyticsPropTypes} props Component properties.
 * @returns {JSX.Element} Component JSX.
 */
const ProvidersProfitsChart = ({ type, timeFrame, quote, base, stats }) => {
  const intl = useIntl();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  /**
   * @type {ChartData}
   */
  const values = stats.map((s) => formatFloat2Dec(s.percentageProfit));
  const images = stats.map((s) => s.logoUrl);
  const options = {};
  const tooltipFormat = (tooltipItems, data) =>
    `${stats[tooltipItems.index].name}: ${tooltipItems.yLabel} %`;

  const [tabValue, setTabValue] = useState(0);

  /**
   * Map tab index to positions collection type.
   *
   * @returns {PositionsCollectionType} Collection type.
   */
  const mapIndexToCollectionType = () => {
    switch (tabValue) {
      case 1:
        return "sumProfit";

      default:
        return "percentageProfit";
    }
  };

  /**
   * Event handler to change tab value.
   *
   * @param {React.ChangeEvent<{checked: boolean}>} event Tab index to set active.
   * @param {Number} val Tab index to set active.
   * @returns {void}
   */
  const changeTab = (event, val) => {
    setTabValue(val);
  };

  const selectedType = mapIndexToCollectionType();

  return (
    <Paper className="providersProfitsChart">
      <Box
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
        className="profitsHeader"
        flexWrap="wrap"
      >
        <Box display="flex" flexDirection="row">
          <Typography
            variant="h4"
            className={tabValue === 0 ? "selected" : null}
            onClick={() => setTabValue(0)}
          >
            <FormattedMessage id="srv.profitspercentage" />
          </Typography>
          <Typography
            variant="h4"
            className={tabValue === 1 ? "selected" : null}
            onClick={() => setTabValue(1)}
          >
            <FormattedMessage id="srv.netprofit" />
          </Typography>
        </Box>
        <Typography variant="h3">Last 7 days / BTC / All Pairs</Typography>
      </Box>
      <BarChart
        options={options}
        values={values}
        tooltipFormat={tooltipFormat}
        horizontal={isMobile}
        images={images}
        adjustHeightToContent={isMobile}
      />
    </Paper>
  );
};
export default ProvidersProfitsChart;

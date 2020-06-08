import React from "react";
import { Paper, Box } from "@material-ui/core";
import BarChart from "../../Graphs/BarChart";
import { useIntl } from "react-intl";
import "./ProvidersProfitsChart.scss";

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
  // todo: pass as props directly?
  /**
   * @type {ChartData}
   */
  const values = stats.map((s) => s.percentageProfit);
  const labels = stats.map((s) => ({ src: s.logoUrl, width: 40, height: 40 }));
  let chartData = { values, labels };
  /**
   * @type {ChartColorOptions} colorsOptions
   */
  let colorsOptions = {
    backgroundColor: "",
    borderColor: "#00cb3a",
    gradientColor1: "#b6f2cb",
    gradientColor2: "#e5f8ed",
  };

  return (
    <Paper
      title={intl.formatMessage({
        id: "srv.profitspercentage",
      })}
      className="providersProfitsChart"
    >
      <BarChart chartData={chartData} />
    </Paper>
  );
};
export default ProvidersProfitsChart;

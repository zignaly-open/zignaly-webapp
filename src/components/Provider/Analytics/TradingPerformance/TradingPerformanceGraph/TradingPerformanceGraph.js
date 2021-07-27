import React from "react";
import "./TradingPerformanceGraph.scss";
import BarChart from "../../../../Graphs/BarChart";
import { formatNumber } from "utils/formatters";
import { Box, useMediaQuery } from "@material-ui/core";
import { useTheme } from "@material-ui/core/styles";

/**
 *
 * @typedef {import("../../../../../services/tradeApiClient.types").DefaultProviderPerformanceWeeklyStats} DefaultProviderPerformanceWeeklyStats
 * @typedef {import('chart.js').ChartTooltipItem} ChartTooltipItem
 */

/**
 *
 * @typedef {Object} DefaultQuarter
 * @property {Array<DefaultProviderPerformanceWeeklyStats>} weeklyStats
 * @property {Number} total
 */

/**
 *
 * @typedef {Object} DefaultProps
 * @property {DefaultQuarter} quarter
 * @property {string} [unit]
 */

/**
 * Trading performance chart component.
 *
 * @param {DefaultProps} props Default props.
 * @return {JSX.Element} JSX component.
 */
const PerformanceGraph = ({ quarter, unit = "%" }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const values =
    quarter && quarter.weeklyStats ? quarter.weeklyStats.map((item) => item.return) : [];
  const labels = quarter && quarter.weeklyStats ? quarter.weeklyStats.map(() => "") : [];
  const options = {
    scales: {
      xAxes: [
        {
          gridLines: {
            display: false,
          },
        },
      ],
      yAxes: [
        {
          stacked: false,
          ticks: {
            display: true,
          },
          gridLines: {
            color: "transparent",
            display: true,
            drawBorder: false,
            zeroLineColor: "#d4d4d4",
          },
        },
      ],
    },
  };

  /**
   * @param {ChartTooltipItem} tooltipItems Tooltip item.
   * @returns {string} Tooltip text.
   */
  const tooltipFormat = (tooltipItems /* data */) =>
    `${formatNumber(tooltipItems[isMobile ? "xLabel" : "yLabel"], 2)}${unit}`;

  return (
    <Box className="tradingPerformanceGraph">
      <BarChart
        adjustHeightToContent={isMobile}
        horizontal={isMobile}
        labels={labels}
        options={options}
        tooltipFormat={tooltipFormat}
        values={values}
      />
    </Box>
  );
};

export default PerformanceGraph;

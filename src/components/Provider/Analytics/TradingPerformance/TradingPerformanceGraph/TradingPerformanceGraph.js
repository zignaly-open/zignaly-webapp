import React from "react";
import "./TradingPerformanceGraph.scss";
import BarChart from "../../../../Graphs/BarChart";
import { Box, useMediaQuery } from "@material-ui/core";
import { useTheme } from "@material-ui/core/styles";

/**
 *
 * @typedef {import("../../../../../services/tradeApiClient.types").DefaultProviderPermormanceWeeklyStats} DefaultProviderPermormanceWeeklyStats
 * @typedef {import('chart.js').ChartTooltipItem} ChartTooltipItem
 */

/**
 *
 * @typedef {Object} DefaultQuarter
 * @property {Array<DefaultProviderPermormanceWeeklyStats>} weeklyStats
 * @property {Number} total
 * @property {Number} id
 */

/**
 *
 * @typedef {Object} DefaultProps
 * @property {DefaultQuarter} quarter
 */

/**
 * Trading performance chart component.
 *
 * @param {DefaultProps} props Default props.
 * @return {JSX.Element} JSX component.
 */
const PerformanceGraph = ({ quarter }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const values = quarter.weeklyStats.map((item) => item.return);
  const labels = quarter.weeklyStats.map(() => "");
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
   * @param {ChartTooltipItem} tooltipItems Tooltip itwm.
   * @returns {string} Tooltip text.
   */
  const tooltipFormat = (tooltipItems /* data */) =>
    `${tooltipItems[isMobile ? "xLabel" : "yLabel"]}%`;

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

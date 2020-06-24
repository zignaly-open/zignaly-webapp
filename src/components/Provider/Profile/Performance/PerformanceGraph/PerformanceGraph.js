import React from "react";
import "./PerformanceGraph.scss";
import BarChart from "../../../../Graphs/BarChart";
import { Box, useMediaQuery } from "@material-ui/core";
import { useTheme } from "@material-ui/core/styles";

/**
 *
 * @typedef {import("../../../../../services/tradeApiClient.types").DefaultProviderGetObject} DefaultProviderGetObject
 * @typedef {import('chart.js').ChartTooltipItem} ChartTooltipItem
 */

/**
 *
 * @typedef {Object} DefaultProps
 * @property {DefaultProviderGetObject} provider
 */

/**
 *
 * @param {DefaultProps} props Default props.
 */

const PerformanceGraph = ({ provider }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const values = provider.performance.weeklyStats.map((item) => item.return);
  const labels = provider.performance.weeklyStats.map(() => "");
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
            display: false,
          },
          gridLines: {
            color: "transparent",
            display: true,
            drawBorder: false,
            zeroLineColor: "rgba(0, 0, 0, 0.2)",
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
    `${tooltipItems[isMobile ? "xLabel" : "yLabel"]}`;

  return (
    <Box className="performanceGraph">
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

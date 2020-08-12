import React from "react";
import "./PerformanceGraph.scss";
import BarChart from "../../../../Graphs/BarChart";
import { Box, useMediaQuery, Typography } from "@material-ui/core";
import { useTheme } from "@material-ui/core/styles";
import { formatFloat2Dec } from "../../../../../utils/format";

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

  /**
   * @typedef {Object} ValuesObject
   * @property {Array<Number>} values
   * @property {Array<String>} labels
   */

  /**
   * @returns {ValuesObject} Values object for graoh.
   */
  const prepareValues = () => {
    let stats = provider.performance.weeklyStats;
    /**
     * @type {Array<Number>}
     */
    let values = [];
    /**
     * @type {Array<String>}
     */
    let labels = [];
    if (stats) {
      stats.sort((a, b) => new Date(a.day).getTime() - new Date(b.day).getTime());
      if (stats.length > 12) {
        const list = [...stats].splice(stats.length - 12, 12);
        values = list.map((item) => item.return);
        labels = list.map((item) => item.day);
      } else {
        values = stats.map((item) => item.return);
        labels = stats.map((item) => item.day);

        for (let a = 0; a < 12 - stats.length; a++) {
          values.unshift(0);
          labels.unshift("");
        }
      }
    }
    return { labels, values };
  };

  const { labels, values } = prepareValues();
  const options = {
    scales: {
      xAxes: [
        {
          ticks: {
            display: false,
          },
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
            zeroLineColor: "#d4d4d4",
          },
        },
      ],
    },
  };

  /**
   * @param {ChartTooltipItem} tooltipItems Tooltip item.
   * @returns {React.ReactNode} Tooltip text.
   */
  const tooltipFormat = (tooltipItems /* data */) => {
    return (
      <Box display="flex" flexDirection="column" justifyContent="flex-start">
        <Typography variant="h5">{tooltipItems.label}</Typography>
        <Typography variant="h5">
          {`${formatFloat2Dec(tooltipItems[isMobile ? "xLabel" : "yLabel"])}%`}
        </Typography>
      </Box>
    );
  };

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

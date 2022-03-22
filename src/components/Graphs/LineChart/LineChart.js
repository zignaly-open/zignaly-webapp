import React, { useCallback } from "react";
import "./LineChart.scss";
import { Box } from "@mui/material";
import { Line } from "react-chartjs-2";
import { isEqual } from "lodash";
import TooltipChart from "../TooltipChart";
import useChartTooltip from "../../../hooks/useChartTooltip";

/**
 * @typedef {import('chart.js').ChartData} Chart.ChartData
 * @typedef {import('chart.js').ChartOptions} Chart.ChartOptions
 */

/**
 * @typedef {Object} ChartData
 * @property {Array<Number>} values Chart values.
 * @property {Array<String|Date>} labels Chart labels.
 */

/**
 * @typedef {Object} ChartColorOptions
 * @property {string} borderColor Border HTML color.
 *
 */

// Memoize the chart and only re-renders when the data is updated.
// Otherwise it will be rendered everytime the toolip is trigered(state update).
const MemoizedLine = React.memo(
  Line,
  (prevProps, nextProps) =>
    isEqual(prevProps.data, nextProps.data) && isEqual(prevProps.options, nextProps.options),
);

/**
 * @typedef {Object} LineChartPropTypes
 * @property {ChartColorOptions} colorsOptions Chart colors.
 * @property {ChartData} chartData Chart dataset.
 * @property {function} tooltipFormat Function to format data based on selected value.
 */

/**
 * Provides a wrapper to display a line chart.
 *
 * @param {LineChartPropTypes} props Component properties.
 * @returns {JSX.Element} Component JSX.
 */
const LineChart = (props) => {
  const { chartData, colorsOptions, tooltipFormat } = props;
  const { chartRef, pointHoverRef, tooltipData, showTooltip } = useChartTooltip(tooltipFormat);
  const showTooltipCallback = useCallback(showTooltip, [chartData]);

  /**
   * @type Chart.ChartData
   */
  const data = {
    labels: chartData.labels,
    datasets: [
      {
        label: "",
        fill: false,
        data: chartData.values,
        borderColor: colorsOptions.borderColor,
        backgroundColor: "transparent",
        borderWidth: 3,
        // pointHitRadius: 20,
        pointHoverRadius: 8,
        pointHoverBorderWidth: 4,
        pointHoverBorderColor: "#5200c5",
        pointHoverBackgroundColor: "#fff",
      },
    ],
  };

  /**
   * @type Chart.ChartOptions
   */
  const options = {
    layout: {
      padding: {
        top: 10,
      },
    },
    responsive: true,
    maintainAspectRatio: false,
    legend: {
      display: false,
    },
    hover: {
      intersect: false,
      mode: "index",
      animationDuration: 0,
    },
    tooltips: {
      mode: "index",
      intersect: false,
      position: "nearest",
      displayColors: false,
      enabled: false,
      custom: showTooltipCallback,
    },
    elements: {
      point: {
        radius: 0,
      },
    },
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
            display: false,
          },
        },
      ],
    },
    // events: ["click", "touchstart", "touchmove"],
  };

  return (
    <Box className="lineChart">
      <TooltipChart pointHoverRef={pointHoverRef} tooltipData={tooltipData}>
        <MemoizedLine data={data} options={options} ref={chartRef} />
      </TooltipChart>
    </Box>
  );
};

export default LineChart;

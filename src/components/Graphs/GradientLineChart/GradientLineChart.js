import React, { useCallback } from "react";
import "./GradientLineChart.scss";
import { Box } from "@mui/material";
import { Line } from "react-chartjs-2";
import { isEqual } from "lodash";
import TooltipChart from "../TooltipChart";
import useChartTooltip from "../../../hooks/useChartTooltip";

/**
 * @typedef {import('chart.js').ChartData} Chart.ChartData
 * @typedef {import('chart.js').ChartOptions} Chart.ChartOptions
 * @typedef {import('chart.js').ChartTooltipModel} Chart.ChartTooltipModel
 */

/**
 * @typedef {Object} ChartData
 * @property {Array<Number>} values Chart values.
 * @property {Array<String|Date>} labels Chart labels.
 */

/**
 * @typedef {Object} ChartColorOptions
 * @property {string} backgroundColor Background HTML color.
 * @property {string} borderColor Border HTML color.
 * @property {string} gradientColor1 Chart gradient color top.
 * @property {string} gradientColor2 Chart gradient color bottom.
 */

// Memoize the chart and only re-renders when the data is updated.
// Otherwise it will be rendered everytime the toolip is trigered(state update).
const MemoizedLine = React.memo(
  Line,
  (prevProps, nextProps) =>
    isEqual(prevProps.data, nextProps.data) && isEqual(prevProps.options, nextProps.options),
);

/**
 * @typedef {Object} ChartOptions
 * @property {boolean} beginAtZero Start y axis at 0
 */

/**
 * @typedef {Object} LineChartPropTypes
 * @property {ChartColorOptions} colorsOptions Chart colors.
 * @property {ChartData} chartData Chart dataset.
 * @property {function} tooltipFormat Function to format data based on selected value.
 * @property {ChartOptions} [options] Options
 */

/**
 * Provides a wrapper to display a line chart.
 *
 * @param {LineChartPropTypes} props Component properties.
 * @returns {JSX.Element} Component JSX.
 */
const LineChart = (props) => {
  const defaultOptions = {
    beginAtZero: false,
  };
  const {
    chartData,
    colorsOptions,
    tooltipFormat,
    options: customOptions = defaultOptions,
  } = props;
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
        data: chartData.values,
        backgroundColor: colorsOptions.backgroundColor,
        borderColor: colorsOptions.borderColor,
        fill: "start",
        // pointHitRadius: 20,
        pointHoverRadius: 0,
        pointHoverBorderWidth: 0,
      },
    ],
  };

  /**
   * @type Chart.ChartOptions
   */
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    legend: {
      display: false,
    },
    animation: {
      duration: 0,
    },
    hover: {
      intersect: false,
      mode: "index",
      //   animationDuration: 0,
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
      line: {
        tension: 0,
      },
    },
    scales: {
      xAxes: [
        {
          ticks: {
            display: false,
            fontStyle: "bold",
          },
          gridLines: {
            display: false,
            tickMarkLength: 0,
          },
        },
      ],
      yAxes: [
        {
          stacked: false,
          ticks: {
            display: false,
            beginAtZero: customOptions.beginAtZero,
          },
          gridLines: {
            display: false,
            tickMarkLength: 0,
          },
        },
      ],
    },
    plugins: {
      /**
       * @type {ResponsiveGradientOptions}
       */
      responsiveGradient: {
        gradientColor1: colorsOptions.gradientColor1,
        gradientColor2: colorsOptions.gradientColor2,
      },
    },
    // events: ["click", "touchstart", "touchmove"],
  };

  const plugins = [
    {
      id: "responsiveGradient",
      /**
       * @typedef {Object} ChartWithScales
       * @property {*} scales
       *
       * @typedef {Chart & ChartWithScales} ExtendedChart
       */

      /**
       * @typedef {Object} ResponsiveGradientOptions
       * @property {string} gradientColor1
       * @property {string} gradientColor2
       */

      /**
       * Fill chart with gradient on layout change.
       *
       * @param {ExtendedChart} chart Chart instance.
       * @param {ResponsiveGradientOptions} opts Plugin options.
       * @returns {void}
       */
      afterLayout: (chart, opts) => {
        let scales = chart.scales;
        let color = chart.ctx.createLinearGradient(0, scales["y-axis-0"].bottom, 0, 0);
        color.addColorStop(0, opts.gradientColor2);
        color.addColorStop(1, opts.gradientColor1);
        chart.data.datasets[0].backgroundColor = color;
      },
    },
  ];

  return (
    <Box className="gradientChart">
      <TooltipChart pointHoverRef={pointHoverRef} tooltipData={tooltipData}>
        <MemoizedLine data={data} options={options} plugins={plugins} ref={chartRef} />
      </TooltipChart>
    </Box>
  );
};

export default LineChart;

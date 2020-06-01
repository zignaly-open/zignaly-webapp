import React, { useState, useEffect, useRef, useCallback } from "react";
import "./Chart.scss";
import { prepareLineChartOptions, generateChart, getCanvasContext } from "../../../utils/chart";
import { Box } from "@material-ui/core";
import { positions } from "@material-ui/system";
import CustomToolip from "../../CustomTooltip";
import { Line } from "react-chartjs-2";

/**
 * @typedef {import('../../../utils/chart').ChartColorOptions} ChartColorOptions
 * @typedef {import('../../../utils/chart').ChartData} ChartData
 */

const MemoizedLine = React.memo(Line, () => true);

/**
 * @typedef {Object} GenericChartPropTypes
 * @property {String} id ID of the cnavas passed as a child.
 * @property {Object} children Canvas component to render the chart.
 * @property {ChartColorOptions} colorsOptions Chart colors.
 * @property {ChartData} chartData Chart dataset.
 */

/**
 * Provides a wrapper to display a chart.
 *
 * @param {GenericChartPropTypes} props Component properties.
 * @returns {JSX.Element} Component JSX.
 */
const LineChart = (props) => {
  const { chartData, colorsOptions } = props;
  const chartRef = useRef(null);
  const [tooltipData, setTooltipData] = useState(null);

  const showTooltip = useCallback((tooltip) => {
    // if chart is not defined, return early
    const chart = chartRef.current;
    if (!chart) {
      return;
    }

    // hide the tooltip when chartjs determines you've hovered out
    if (tooltip.opacity === 0) {
      setTooltipData({ show: false });
      return;
    }

    const position = chart.chartInstance.canvas.getBoundingClientRect();

    const left = position.left + window.pageXOffset + tooltip.caretX;
    const bottom = position.top + window.pageYOffset + tooltip.caretY;

    // set values for display of data in the tooltip
    const date = tooltip.dataPoints[0].xLabel;
    const value = tooltip.dataPoints[0].yLabel + "%";
    const message = (
      <Box className="contentTooltip">
        <Box>{value}</Box>
        <Box className="subtitleTooltip">{date}</Box>
      </Box>
    );
    setTooltipData({
      pos: { bottom, left },
      title: message,
      show: true,
    });
  }, []);

  const data = {
    labels: chartData.labels,
    datasets: [
      {
        label: "",
        data: chartData.values,
        backgroundColor: colorsOptions.backgroundColor,
        borderColor: colorsOptions.borderColor,
        fill: "start",
        pointHoverRadius: 7,
        pointHoverBorderWidth: 4,
        pointHoverBorderColor: "#5200c5",
        pointHoverBackgroundColor: "#fff",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    legend: {
      display: false,
    },
    hover: {
      intersect: false,
      mode: "nearest",
      animationDuration: 0,
    },
    tooltips: {
      mode: "nearest",
      intersect: false,
      //   position: "nearest",
      displayColors: false,
      callbacks: {
        /**
         * Default Tooltip component configurations.
         *
         * @typedef {Object} TooltipItemParam
         * @property {String} index
         */
        /**
         * Default Tooltip component configurations.
         *
         * @typedef {Object} DatasetObject
         * @property {Array<Number>} data
         */
        /**
         * Default Datasets object proteries
         *
         * @typedef {Array<DatasetObject>} DatasetCollection
         */
        /**
         * Default Dara params.
         *
         * @typedef {Object} DataParam
         * @property {DatasetCollection} datasets
         */
        /**
         * Tooltip configuration params.
         *
         * @param {TooltipItemParam} tooltipItem
         * @param {DataParam} data
         */
        //   label,
        //   afterLabel: () => {
        //     return "%";
        //   },
      },
      enabled: false,
      custom: showTooltip,
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
            fontFamily: "PlexSans-Bold",
          },
          gridLines: {
            display: false,
            tickMarkLength: 0,
          },
        },
      ],
      yAxes: [
        {
          stacked: true,
          ticks: {
            display: false,
          },
          gridLines: {
            display: false,
            tickMarkLength: 0,
          },
        },
      ],
    },
    // events: ["click", "touchstart", "touchmove"],
    // pointHitRadius: 10,
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
       * Fill chart with gradient on layout change.
       *
       * @param {ExtendedChart} chart Chart instance.
       * @returns {void}
       */
      afterLayout: (chart /* options */) => {
        let scales = chart.scales;
        let color = chart.ctx.createLinearGradient(0, scales["y-axis-0"].bottom, 0, 0);
        color.addColorStop(0, colorsOptions.gradientColor2);
        color.addColorStop(1, colorsOptions.gradientColor1);
        chart.data.datasets[0].backgroundColor = color;
      },
    },
  ];

  return (
    <Box className="chart">
      {tooltipData && (
        <CustomToolip title={tooltipData.title} open={tooltipData.show} pos={tooltipData.pos}>
          <div></div>
        </CustomToolip>
      )}

      <MemoizedLine data={data} options={options} ref={chartRef} plugins={plugins} />
    </Box>
  );
};

export default LineChart;

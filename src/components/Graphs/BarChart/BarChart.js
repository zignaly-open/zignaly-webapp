import React, { useRef, useEffect, useCallback } from "react";
import "./BarChart.scss";
import { Box } from "@material-ui/core";
import { Chart, Bar, HorizontalBar } from "react-chartjs-2";
import "../Chart.roundedBarCharts";
import { isEqual } from "lodash";

/**
 * @typedef {import('chart.js').ChartData} Chart.ChartData
 * @typedef {import('chart.js').ChartOptions} Chart.ChartOptions
 */

/**
 * @typedef {Object} ChartData
 * @property {Array<Number>} values Chart values.
 * @property {Array<String>} labels Chart labels.
 */

/**
 * @typedef {Object} LineChartPropTypes
 * @property {ChartData} chartData Chart dataset.
 */

// const MemoizedBar = React.memo(Bar, (prevProps, nextProps) =>
//   isEqual(prevProps.data, nextProps.data),
// );

/**
 * Provides a wrapper to display a bar chart.
 *
 * @param {LineChartPropTypes} props Component properties.
 * @returns {JSX.Element} Component JSX.
 */
const BarChart = (props) => {
  const { data: values, labels, horizontal, tooltipFormat, images } = props;
  const chartRef = useRef(null);
  /**
   * @type Chart.ChartData
   */
  const data = {
    // labels: chartData.labels,
    labels: images && images.length ? values.map(() => "") : labels,
    // labels: ["", ""],
    datasets: [
      {
        data: values,
        barThickness: 24,
        maxBarThickness: 24,
        //     // barPercentage: 0.5,
        //   label: "group 1",
        // backgroundColor: colorsOptions.backgroundColor,
        backgroundColor: values.map((v) => (v < 0 ? "#f63f82" : "#08a441")),
        // borderColor: colorsOptions.borderColor,
        // borderWidth: 24,
        //     fill: false,
        //     lineTension: 0,
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
    scales: {
      yAxes: [
        {
          ticks: {
            fontColor: "#191927",
            fontSize: 14,
            // padding: 75,
            padding: 0,
            // stepSize: 1,
          },
          gridLines: {
            color: "transparent",
            display: true,
            drawBorder: false,
            zeroLineColor: "rgba(0, 0, 0, 0.1)",
          },
        },
      ],
      xAxes: [
        {
          gridLines: {
            display: false,
          },
          ticks: {
            display: false,
          },
        },
      ],
    },
    layout: {
      padding: {
        // left: 25,
        left: 0,
        right: 0,
        top: 20,
        bottom: 56,
      },
    },
    cornerRadius: 4,
    tooltips: {
      displayColors: false,
      intersect: false,
      mode: "index",
      position: "nearest",
      callbacks: {
        label: tooltipFormat,
      },
    },
    plugins: {
      legendImages: images
        ? {
            images,
          }
        : false,
    },
  };

  const plugins = [
    {
      id: "legendImages",
      // Draw images at the bottom of the graph
      afterDraw: (chart, easing) => {
        const { images } = chart.options.plugins.legendImages;
        var ctx = chart.chart.ctx;
        var xAxis = chart.scales["x-axis-0"];
        var yAxis = chart.scales["y-axis-0"];

        xAxis.ticks.forEach((value, index) => {
          var x = xAxis.getPixelForTick(index);
          const imageOptions = images[index];
          if (imageOptions) {
            var image = new Image();
            image.src = imageOptions.src;
            ctx.drawImage(image, x - 20, yAxis.bottom + 20, 40, 40);
          }
        });
      },
    },
  ];

  const BarComponent = horizontal ? HorizontalBar : Bar;

  return (
    <Box className="barChart">
      <BarComponent data={data} options={options} ref={chartRef} plugins={plugins} />
    </Box>
  );
};

export default BarChart;

import React, { useRef, useEffect, useCallback, useState } from "react";
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

const MemoizedBar = React.memo(Bar, (prevProps, nextProps) =>
  isEqual(prevProps.data, nextProps.data),
);

const MemoizedHorizontalBar = React.memo(
  HorizontalBar,
  (prevProps, nextProps) =>
    isEqual(prevProps.data, nextProps.data) && prevProps.height === nextProps.height,
);

/**
 * Provides a wrapper to display a bar chart.
 *
 * @param {LineChartPropTypes} props Component properties.
 * @returns {JSX.Element} Component JSX.
 */
const BarChart = (props) => {
  const {
    values,
    labels,
    horizontal,
    tooltipFormat,
    images,
    adjustHeightToContent,
    options: customOptions,
  } = props;
  const chartRef = useRef(null);

  /**
   * @type Chart.ChartData
   */
  const data = {
    labels: images && images.length ? values.map(() => "") : labels,
    datasets: [
      {
        data: values,
        barThickness: 20,
        maxBarThickness: 24,
        // barPercentage: 0.5,
        //   label: "group 1",
        // backgroundColor: colorsOptions.backgroundColor,
        backgroundColor: values.map((v) => (v < 0 ? "#f63f82" : "#08a441")),
      },
    ],
  };

  const yAxes = {
    ticks: {
      fontColor: "#191927",
      fontSize: 14,
      // padding: 75,
      padding: 0,
      // stepSize: 1,
      min: -2,
    },
    gridLines: {
      // draw zero line only
      color: "transparent",
      display: true,
      drawBorder: false,
      zeroLineColor: "rgba(0, 0, 0, 0.1)",
    },
  };

  const xAxes = {
    gridLines: {
      display: false,
    },
    ticks: {
      display: true,
      padding: horizontal ? 10 : 40,
    },
    // categoryPercentage: 1.0,
    // barPercentage: 1.0,
  };

  /**
   * @type Chart.ChartOptions
   */
  let options = {
    responsive: true,
    maintainAspectRatio: false,
    legend: {
      display: false,
    },
    scales: {
      yAxes: [horizontal ? xAxes : yAxes],
      xAxes: [horizontal ? yAxes : xAxes],
    },
    layout: {
      padding: {
        // left: 25,
        left: horizontal ? 15 : 0,
        right: 0,
        top: 20,
        bottom: horizontal ? 0 : 56,
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
    animation: {
      duration: 1000,
      onProgress(chartAnimation) {
        if (!images) return;

        const chart = chartAnimation.chart;
        const ctx = chart.chart.ctx;
        const xAxis = chart.scales["x-axis-0"];
        const yAxis = chart.scales["y-axis-0"];

        //     chart.data.datasets.forEach(function (dataset, i) {
        //       var meta = chart.controller.getDatasetMeta(i);
        //       meta.data.forEach(function (bar, index) {
        //         // var data = (dataset.data[index] / total) * 100;
        //         ctx.fillText(data, bar._model.x - 15, bar._model.y);
        //       });
        //     });

        values.forEach((value, index) => {
          const imageSrc = images[index];
          var image = new Image();
          image.src = imageSrc;

          if (horizontal) {
            // Draw image on the left
            const y = yAxis.getPixelForTick(index);
            const size = 26;
            ctx.drawImage(image, 0, y - size / 2, size, size);
          } else {
            // Draw image at the bottom
            const x = xAxis.getPixelForTick(index);
            const size = 40;
            ctx.drawImage(image, x - size / 2, yAxis.bottom + 20, size, size);
          }
        });
      },
    },
  };

  // Merge user options
  options = Object.assign(options, customOptions);

  const BarComponent = horizontal ? MemoizedHorizontalBar : MemoizedBar;

  let height;
  if (horizontal && adjustHeightToContent) {
    // Calculate optimal height to display all the bars
    const BAR_GAP = 3;
    const X_AXIS_HEIGHT = 60;
    height = values.length * (data.datasets[0].barThickness + BAR_GAP * 2) + X_AXIS_HEIGHT;
  }

  return (
    <Box className="barChart" style={{ ...(height && { height }) }}>
      <BarComponent data={data} options={options} ref={chartRef} redraw={true} />
    </Box>
  );
};

export default BarChart;

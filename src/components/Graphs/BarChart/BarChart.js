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

const MemoizedBar = React.memo(Bar, (prevProps, nextProps) =>
  isEqual(prevProps.data, nextProps.data),
);

const MemoizedHorizontalBar = React.memo(HorizontalBar, (prevProps, nextProps) =>
  isEqual(prevProps.data, nextProps.data),
);

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
        barThickness: 20,
        maxBarThickness: 24,
        // barPercentage: 0.5,
        //   label: "group 1",
        // backgroundColor: colorsOptions.backgroundColor,
        backgroundColor: values.map((v) => (v < 0 ? "#f63f82" : "#08a441")),
        // borderColor: colorsOptions.borderColor,
        // borderWidth: 24,
      },
    ],
  };

  const xAxes = {
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

  const yAxes = {
    gridLines: {
      display: false,
    },
    ticks: {
      display: true,
      padding: horizontal ? 10 : 40,
    },
    //   categoryPercentage: 1.0,
    // barPercentage: 1.0,
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
      yAxes: [xAxes],
      xAxes: [yAxes],
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
    plugins: {
      legendImages: images
        ? {
            images,
          }
        : false,
    },
  };

  if (horizontal) {
    options.scales.xAxes = [yAxes];
    options.scales.yAxes = [xAxes];
  }

  const plugins = [
    {
      id: "legendImages",
      // Draw images at the bottom of the graph
      afterDraw: (chart, easing) => {
        const { images } = chart.options.plugins.legendImages;
        var ctx = chart.chart.ctx;
        var xAxis = chart.scales["x-axis-0"];
        var yAxis = chart.scales["y-axis-0"];

        //     // chartData.values.forEach(function (dataset, i) {
        //     chart.data.datasets.forEach(function (dataset, i) {
        //       //   var label = dataset.label;
        //       var meta = chart.controller.getDatasetMeta(i);
        //       //   var total = dataset.data.reduce(function (total, num) {
        //       //     return total + num;
        //       //   });

        //       meta.data.forEach(function (bar, index) {
        //         // var data = (dataset.data[index] / total) * 100;
        //         // data = Math.ceil(data) + "%";
        //         console.log(bar);
        //         ctx.fillText("AAAAAAAAAAAAAAAAA", bar._model.x - 15, bar._model.y);
        //       });
        //     });

        xAxis.ticks.forEach((value, index) => {
          var x = xAxis.getPixelForTick(index);
          var y = yAxis.getPixelForTick(index);
          const imageOptions = images[index];
          //   console.log(chart.scales);
          if (imageOptions) {
            var image = new Image();
            image.src = imageOptions.src;
            // console.log(index, x, y);
            if (horizontal) {
              ctx.drawImage(image, 0, y - 13, 26, 26);
            } else {
              ctx.drawImage(image, x - 20, yAxis.bottom + 20, 40, 40);
            }
          }
        });
      },
    },
  ];

  const BarComponent = horizontal ? MemoizedHorizontalBar : MemoizedBar;

  const { top, bottom } = options.layout.padding;
  const BAR_GAPS = 3;
  //   const xAxisHeight = chartRef.current
  //     ? chartRef.current.chartInstance.scales["y-axis-0"].height
  //     : 0;
  const xAxisHeight = 60;
  //   console.log(chartRef);
  const height = values.length * (data.datasets[0].barThickness + BAR_GAPS * 2) + xAxisHeight;
  console.log(height);
  //   console.log(chartRef.current && chartRef.current.chartInstance);
  //   console.log(xAxisHeight);

  return (
    <Box className="barChart" style={{ height }}>
      <BarComponent data={data} options={options} ref={chartRef} plugins={plugins} redraw={true} />
    </Box>
  );
};

export default BarChart;

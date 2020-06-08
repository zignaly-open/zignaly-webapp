import React, { useRef, useEffect } from "react";
import "./BarChart.scss";
import { Box } from "@material-ui/core";
import { Chart, Bar, HorizontalBar } from "react-chartjs-2";
// import "../chartjs-plugin-labels";
// import "chartjs-plugin-labels";
import "../Chart.roundedBarCharts";

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

/**
 * Provides a wrapper to display a bar chart.
 *
 * @param {LineChartPropTypes} props Component properties.
 * @returns {JSX.Element} Component JSX.
 */
const BarChart = (props) => {
  const { chartData, horizontal, tooltipFormat } = props;
  const chartRef = useRef(null);

  //   useEffect(() => {
  //     Chart.pluginService.register({
  //       afterDraw: (chart, easing) => {
  //         var ctx = chart.chart.ctx;
  //         var xAxis = chart.scales["x-axis-0"];
  //         var yAxis = chart.scales["y-axis-0"];
  //         xAxis.ticks.forEach((value, index) => {
  //           var x = xAxis.getPixelForTick(index);
  //           console.log(x);
  //           var image = new Image();
  //           image.src = "https://zignaly.com/images/providersLogo/5c0e732a6c20cd6ad01f0522.png";
  //           ctx.drawImage(image, x - 40, yAxis.bottom - 36 - 40, 40, 40);
  //         });
  //       },
  //       beforeInit: function (chart, options) {
  //         console.log("a");
  //         chart.legend.afterFit = function () {
  //           console.log("aa");
  //           this.height = this.height + 100;
  //         };
  //       },
  //     });
  //     return () => {
  //       //   Chart.pluginService.unregister(this.horizonalLinePlugin);
  //     };
  //   }, []);
  /**
   * @type Chart.ChartData
   */
  const data = {
    // labels: chartData.labels,
    labels: ["", "", "", ""],
    datasets: [
      {
        data: chartData.values,
        barThickness: 24,
        maxBarThickness: 24,
        //     // barPercentage: 0.5,
        //   label: "group 1",
        // backgroundColor: colorsOptions.backgroundColor,
        backgroundColor: chartData.values.map((v) => (v < 0 ? "#f63f82" : "#08a441")),
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
  };

  const plugins = [
    {
      // Draw images at the bottom of the graph
      afterDraw: (chart, easing) => {
        var ctx = chart.chart.ctx;
        var xAxis = chart.scales["x-axis-0"];
        var yAxis = chart.scales["y-axis-0"];
        xAxis.ticks.forEach((value, index) => {
          var x = xAxis.getPixelForTick(index);
          var image = new Image();
          image.src = "https://zignaly.com/images/providersLogo/5c0e732a6c20cd6ad01f0522.png";
          ctx.drawImage(image, x - 20, yAxis.bottom + 20, 40, 40);
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

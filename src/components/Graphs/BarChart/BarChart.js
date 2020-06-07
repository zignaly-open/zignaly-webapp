import React, { useRef } from "react";
import "./BarChart.scss";
import { Box } from "@material-ui/core";
import { Bar } from "react-chartjs-2";
// import "../chartjs-plugin-labels";
import "chartjs-plugin-labels";

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
  const { chartData } = props;
  const chartRef = useRef(null);

  /**
   * @type Chart.ChartData
   */
  const data = {
    labels: chartData.labels,
    // labels: ["W1-W4", "W5-W9", "W10-W13"],

    // labels: ["30.08.2019 00:08:00", "31.08.2019 00:08:00", "01.09.2019 00:08:00"],
    // labels: ["W1", "W2", "W3", "W4"],
    // data: [
    //   [0.2, 0.8, -1.5, 0.4],
    //   [1.2, 0.8, -1.5, 0.4],
    //   [-0.2, 0.8, -1.5, 0.4],
    //   [0.5, 0.8, -1.5, 0.4],
    // ],
    datasets: [
      //   {
      //     label: "Float",
      //     data: [
      //       [0, 1],
      //       [0, -1],
      //       [0, 0.5],
      //     ],
      //     backgroundColor: "rgba(75, 192, 192, 0.2)",
      //     borderColor: "rgba(75, 192, 192, 1)",
      //     borderWidth: 1,
      //     fill: false,
      //     lineTension: 0,
      //     type: "bar",
      //   },
      //   {
      //     label: "Blue",
      //     backgroundColor: "blue",
      //     data: [3, 7, 4],
      //     // barPercentage: 0.5,
      //     // categoryPercentage: 0.3,
      //   },
      //   {
      //     label: "Red",
      //     backgroundColor: "red",
      //     data: [4, 3, 5],
      //   },
      //   {
      //     label: "Green",
      //     backgroundColor: "green",
      //     data: [7, 2, 6],
      //   },
      {
        data: chartData.values,
        barThickness: 6,
        maxBarThickness: 8,
        //     // barPercentage: 0.5,

        //   data: [0.2, 0.8, -1.5, 0.4],
        //   label: "group 1",
        // backgroundColor: colorsOptions.backgroundColor,
        // borderColor: colorsOptions.borderColor,
      },
      //   {
      //     data: [0.2, 0.8, -1.5, 0.4],
      //     label: "group 2",
      //   },
      //   {
      //     data: [0.2, 0.8, -1.5, 0.4],
      //     label: "group 3",
      //   },
      //   {
      //     data: [0.2, 0.8, -1.5, 0.4],
      //     label: "group 4",
      //   },
    ],
  };

  const data1 = {
    labels: ["January", "February", "March"],
    datasets: [
      {
        label: "January",
        data: [
          {
            x: -10,
            y: "January",
          },
          {
            x: 0,
            y: "February",
          },
          {
            x: 10,
            y: "February",
          },
        ],
      },
    ],
  };

  var data22 = {
    labels: ["W1-W4", "W5-W9", "W10-W13"],
    datasets: [
      {
        label: "Blue",
        backgroundColor: "blue",
        data: [3, 7, 4],
      },
      {
        label: "Red",
        backgroundColor: "red",
        data: [4, 3, 5],
      },
      {
        label: "Green",
        backgroundColor: "green",
        data: [7, 2, 6],
      },
    ],
  };

  var dataa = {
    labels: ["W1", "W2", "W3", "W4", "W5", "W6", "W"],
    datasets: [
      {
        label: "Blue",
        backgroundColor: "blue",
        data: [3, 7, 4, 8, 7, 4, -3, 0.7, 4],
      },
      //   {
      //     label: "Red",
      //     backgroundColor: "red",
      //     data: [4, 3, 5],
      //   },
      //   {
      //     label: "Green",
      //     backgroundColor: "green",
      //     data: [7, 2, 6],
      //   },
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
    barValueSpacing: 20,
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
            fontColor: "#787878",
            fontSize: 14,
            padding: 100,
          },
          gridLines: {
            zeroLineColor: "#fff",
            color: "#fff",
            drawBorder: false,
            //        lineWidth: 50
          },
        },
      ],
      xAxes: [
        {
          gridLines: {
            display: false,
            tickMarkLength: 8,
          },
          ticks: {
            fontSize: 12,
            //         display: false,
            //         min: 0,
          },
        },
      ],
    },
    // plugins: {
    //   datalabels: {
    //     anchor: "center",
    //     align: "center",
    //   },
    //   labels: {
    //     // render 'label', 'value', 'percentage', 'image' or custom function, default is 'percentage'
    //     render: "image",

    //     // identifies whether or not labels of value 0 are displayed, default is false
    //     showZero: true,

    //     // position to draw label, available value is 'default', 'border' and 'outside'
    //     // bar chart ignores this
    //     // default is 'default'
    //     position: "outside",

    //     // set images when `render` is 'image'
    //     images: chartData.labels,

    //     // add padding when position is `outside`
    //     // default is 2
    //     outsidePadding: 4,

    //     // add margin of text when position is `outside` or `border`
    //     // default is 2
    //     textMargin: 4,
    //   },
    // },
    // animation: {
    //   duration: 1000,
    //   onProgress(chartAnimation) {
    //     // let chartInstance = this.chart;
    //     const chart = chartAnimation.chart;
    //     let ctx = chart.ctx;
    //     console.log(chart, chartRef);

    //     // ctx.fillStyle = this.scale.textColor

    //     ctx.textAlign = "center";
    //     ctx.textBaseline = "middle";
    //     ctx.fillStyle = "#fff";

    //     chartData.values.forEach(function (dataset, i) {
    //       //   var label = dataset.label;
    //       var meta = chart.controller.getDatasetMeta(i);
    //       //   var total = dataset.data.reduce(function (total, num) {
    //       //     return total + num;
    //       //   });

    //       meta.data.forEach(function (bar, index) {
    //         // var data = (dataset.data[index] / total) * 100;
    //         // data = Math.ceil(data) + "%";
    //         ctx.fillText("AAAAAAAAAAAAAAAAA", bar._model.x - 15, bar._model.y);
    //       });
    //     });
    //   },
    // },

    // hover: {
    //   intersect: false,
    //   mode: "index",
    //   animationDuration: 0,
    // },
    // tooltips: {
    //   mode: "index",
    //   intersect: false,
    //   position: "nearest",
    //   displayColors: false,
    //   enabled: false,
    // },
    // scales: {
    //   xAxes: [
    //     {
    //       ticks: {
    //         display: false,
    //         fontFamily: "PlexSans-Bold",
    //       },
    //       gridLines: {
    //         display: false,
    //         tickMarkLength: 0,
    //       },
    //     },
    //   ],
    //   yAxes: [
    //     {
    //       stacked: true,
    //       ticks: {
    //         display: false,
    //       },
    //       gridLines: {
    //         display: false,
    //         tickMarkLength: 0,
    //       },
    //     },
    //   ],
    // },
  };

  console.log(chartData);
  return (
    <Box className="barChart">
      <Bar data={data} options={options} ref={chartRef} />
    </Box>
  );
};

export default BarChart;

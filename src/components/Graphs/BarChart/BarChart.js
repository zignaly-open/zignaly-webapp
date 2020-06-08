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
            beginAtZero: true,
            fontColor: "#787878",
            fontSize: 14,
            padding: 75,
          },
          gridLines: {
            zeroLineColor: "#fff",
            color: "#fff",
            drawBorder: false,
            //        lineWidth: 50
            //         tickMarkLength: 0,
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
    layout: {
      padding: {
        left: 25,
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
        // label: function (tooltipItems, data) {
        //   console.log(tooltipItems, data);
        //   return tooltipItems.yLabel + "%";
        // },
        label: tooltipFormat,
      },
    },
    // hover: {
    //   intersect: false,
    //   mode: "index",
    // },

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
    //     console.log(chart);

    //     // ctx.fillStyle = this.scale.textColor

    //     ctx.textAlign = "center";
    //     ctx.textBaseline = "middle";
    //     ctx.fillStyle = "#fff";

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
    //   },
    // },
  };

  const plugins = [
    {
      afterDraw: (chart, easing) => {
        var ctx = chart.chart.ctx;
        var xAxis = chart.scales["x-axis-0"];
        var yAxis = chart.scales["y-axis-0"];
        xAxis.ticks.forEach((value, index) => {
          var x = xAxis.getPixelForTick(index);
          console.log(x);
          var image = new Image();
          image.src = "https://zignaly.com/images/providersLogo/5c0e732a6c20cd6ad01f0522.png";
          ctx.drawImage(image, x - 20, yAxis.bottom + 33, 40, 40);
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

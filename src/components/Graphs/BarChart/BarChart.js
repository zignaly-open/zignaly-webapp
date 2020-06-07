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
    // labels: chartData.labels,
    // labels: ["aaaa"],
    datasets: [
      {
        data: chartData.values,
        // backgroundColor: colorsOptions.backgroundColor,
        // borderColor: colorsOptions.borderColor,
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
    plugins: {
      datalabels: {
        anchor: "center",
        align: "center",
      },
      labels: {
        // render 'label', 'value', 'percentage', 'image' or custom function, default is 'percentage'
        render: "image",

        // identifies whether or not labels of value 0 are displayed, default is false
        showZero: true,

        // position to draw label, available value is 'default', 'border' and 'outside'
        // bar chart ignores this
        // default is 'default'
        position: "outside",

        // set images when `render` is 'image'
        images: chartData.labels,

        // add padding when position is `outside`
        // default is 2
        outsidePadding: 4,

        // add margin of text when position is `outside` or `border`
        // default is 2
        textMargin: 4,
      },
    },
    animation: {
      duration: 1000,
      onProgress(chartAnimation) {
        // let chartInstance = this.chart;
        const chart = chartAnimation.chart;
        let ctx = chart.ctx;
        console.log(chart, chartRef);

        // ctx.fillStyle = this.scale.textColor

        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "#fff";

        chartData.values.forEach(function (dataset, i) {
          //   var label = dataset.label;
          var meta = chart.bcontroller.getDatasetMeta(i);
          //   var total = dataset.data.reduce(function (total, num) {
          //     return total + num;
          //   });

          meta.data.forEach(function (bar, index) {
            // var data = (dataset.data[index] / total) * 100;
            // data = Math.ceil(data) + "%";
            ctx.fillText("AAAAAAAAAAAAAAAAA", bar._model.x - 15, bar._model.y);
          });
        });
      },
    },

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

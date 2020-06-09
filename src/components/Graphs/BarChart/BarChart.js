import React, { useRef } from "react";
import "./BarChart.scss";
import { Box } from "@material-ui/core";
import { Bar, HorizontalBar } from "react-chartjs-2";
import "../Chart.roundedBarCharts";

/**
 * @typedef {import('chart.js').ChartData} ChartData
 * @typedef {import('chart.js').ChartOptions} ChartOptions
 * @typedef {import('chart.js').ChartPluginsOptions} ChartPluginsOptions
//  * @typedef {import('chart.js').ChartTooltipCallback} ChartTooltipCallback
 * @typedef {import('chart.js').Chart} Chart
 */

/**
 * @typedef {Object} BarChartPropTypes
 * @property {Array<Number>} values Chart values.
 * @property {Array<String>} [labels] Chart labels.
 * @property {Array<String>} [images] Chart images (used instead of labels).
 * @property {boolean} [horizontal] Flag to display the bars horizontally.
 * @property {boolean} [adjustHeightToContent] Adjust thw height of the canvas dynamicaly to fit its content. (Horizontal only)
 * @property {function} tooltipFormat Function to format data based on selected value.
 * @property {ChartOptions} options Custom user options to override.
 */

/**
 * Provides a wrapper to display a bar chart.
 *
 * @param {BarChartPropTypes} props Component properties.
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
   * @type ChartData
   */
  const data = {
    labels: images && images.length ? values.map(() => "") : labels,
    datasets: [
      {
        data: values,
        barThickness: 20,
        maxBarThickness: 24,
        // barPercentage: 0.5,
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
      padding: horizontal ? 10 : 0,
    },
    // categoryPercentage: 1.0,
    // barPercentage: 1.0,
  };

  /**
   * @type ChartOptions
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
        bottom: horizontal ? 10 : images ? 25 : 0,
      },
    },
    cornerRadius: 4,
    tooltips: {
      displayColors: false,
      intersect: false,
      mode: "index",
      position: "nearest",
      callbacks: {
        title: (/** tooltipItems, data**/) => "",
        label: tooltipFormat,
      },
    },
    plugins: {
      legendImages: images
        ? {
            images,
            horizontal,
          }
        : false,
    },
  };

  /**
   * @type {ChartPluginsOptions}
   */
  const plugins = [
    {
      id: "legendImages",
      /**
       * @typedef {Object} ChartWithScales
       * @property {*} scales
       *
       * @typedef {Chart & ChartWithScales} ExtendedChart
       */
      /**
       * Draw images at the bottom of the graph
       * @param {ExtendedChart} chart Chart instance.
       * @returns {void}
       */
      afterDraw: (chart) => {
        if (!chart.data.datasets) return;
        const {
          images: legendImages,
          horizontal: isHorizontal,
        } = chart.options.plugins.legendImages;
        let ctx = chart.chart.ctx;
        let xAxis = chart.scales["x-axis-0"];
        let yAxis = chart.scales["y-axis-0"];

        /**
         * @param {HTMLImageElement} image The image to draw.
         * @param {number} index Data infex.
         * @returns {void}
         */
        const drawImage = (image, index) => {
          if (isHorizontal) {
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
        };

        chart.data.datasets[0].data.forEach((value, index) => {
          const imageSrc = legendImages[index];
          let image = new Image();
          image.src = imageSrc;
          if (!image.complete) {
            image.onload = () => drawImage(image, index);
          } else {
            drawImage(image, index);
          }
        });
      },
    },
  ];

  // Merge user options
  options = Object.assign(options, customOptions);

  const BarComponent = horizontal ? HorizontalBar : Bar;

  let height = 0;
  if (horizontal && adjustHeightToContent) {
    // Calculate optimal height to display all the bars.
    const BAR_GAP = 3;
    const X_AXIS_HEIGHT = 60;
    let barThickness = data.datasets[0].barThickness;
    barThickness = typeof barThickness === "number" ? barThickness : 0;
    height = values.length * (barThickness + BAR_GAP * 2) + X_AXIS_HEIGHT;
  }

  return (
    <Box className="barChart" style={{ ...(height && { height }) }}>
      <BarComponent data={data} options={options} plugins={plugins} redraw={true} ref={chartRef} />
    </Box>
  );
};

export default BarChart;

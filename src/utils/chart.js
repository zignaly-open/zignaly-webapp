import { Chart } from "chart.js";

/**
 * Find DOM canvas element by ID.
 *
 * @param {String} id Canvas element ID.
 * @returns {CanvasRenderingContext2D} Chart canvas.
 */
export const getCanvasContext = (id) => {
  const elementMatch = document.getElementById(id);
  const chartCanvas = /** @type {HTMLCanvasElement} */ (elementMatch);
  return chartCanvas.getContext("2d");
};

/**
 * Generate a chart instance.
 *
 * @param {CanvasRenderingContext2D} context Element context.
 * @param {Object} options Chart options.
 * @return {Chart} Chart JS instance.
 */
export const generateChart = (context, options) => {
  return new Chart(context, options);
};

/**
 * @typedef {Object} ChartData
 * @property {Array<Number|String>} values Chart values.
 * @property {Array<String>} labels Chart labels.
 */

/**
 * @typedef {Object} ChartColorOptions
 * @property {string} backgroundColor Background HTML color.
 * @property {string} borderColor Border HTML color.
 * @property {string} [gradientColor1] Chart gradient color top.
 * @property {string} [gradientColor2] Chart gradient color bottom.
 */

/**
 * @typedef {Object} DoughnutColorOptions
 * @property {Array<String>} backgroundColor Background HTML color.
 * @property {string} [borderColor] Border HTML color.
 */

/**
 * Prepare line chart options.
 *
 * @param {ChartData} chartData Chart dataset.
 * @param {DoughnutColorOptions} colorsOptions Chart colors.
 * @returns {Object} Chart options.
 */
export const preparePieChartOptions = (chartData, colorsOptions) => {
  return {
    type: "doughnut",
    data: {
      labels: chartData.labels,
      datasets: [
        {
          data: chartData.values,
          backgroundColor: colorsOptions.backgroundColor,
          borderColor: colorsOptions.borderColor,
        },
      ],
    },
    options: {
      responsive: true,
      legend: {
        display: true,
        position: "right",
      },
      elements: {
        arc: {
          borderWidth: 0,
        },
      },
    },
  };
};

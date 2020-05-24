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
 * Prepare line chart options.
 *
 * @param {CanvasGradient} backgroundColor Background HTML color.
 * @param {string} borderColor Border HTML color.
 * @param {Array<Object>} chartData Chart data (todo).
 * @returns {Object} Chart options.
 */
export const prepareLineChartOptions = (backgroundColor, borderColor, chartData) => {
  return {
    type: "line",
    data: {
      labels: ["", "", "", "", "", "", "", ""],
      datasets: [
        {
          label: "Equity",
          data: chartData,
          backgroundColor: backgroundColor,
          borderColor: borderColor,
        },
      ],
    },
    options: {
      responsive: true,
      legend: {
        display: false,
      },
      tooltips: {
        mode: "index",
        intersect: false,
        position: "nearest",
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

          label: (tooltipItem, data) => {
            let index = parseInt(tooltipItem.index);
            return "returns " + data.datasets[0].data[index];
          },
          //   afterLabel: () => {
          //     return new Date();
          //   },
        },
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
    },
  };
};

/**
 * Prepare pie chart options.
 *
 * @param {Array<string>} chunksColors Pie chunks HTML colors.
 * @param {string} borderColor Border HTML color.
 * @returns {Object} Chart options.
 */
export const preparePieChartOptions = (chunksColors, borderColor) => {
  return {
    type: "doughnut",
    data: {
      labels: ["BTC", "ETH"],
      datasets: [
        {
          data: [25, 75],
          backgroundColor: chunksColors,
          borderColor: borderColor,
        },
      ],
    },
    options: {
      responsive: true,
      legend: {
        display: true,
        position: "right",
      },
    },
  };
};

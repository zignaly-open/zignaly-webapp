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
 * Prepare line chart options.
 *
 * @param {ChartColorOptions} colorsOptions Chart colors.
 * @param {ChartData} chartData Chart dataset.
 * @param {string} label Tooltip label.
 * @returns {Object} Chart options.
 */
export const prepareLineChartOptions = (colorsOptions, chartData, label) => {
  return {
    type: "line",
    data: {
      labels: chartData.labels,
      datasets: [
        {
          label,
          data: chartData.values,
          backgroundColor: colorsOptions.backgroundColor,
          borderColor: colorsOptions.borderColor,
          fill: "start",
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
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
          //   label: (tooltipItem, data) => {
          //     let index = parseInt(tooltipItem.index);
          //     return "returns " + data.datasets[0].data[index];
          //   },
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
    plugins: [
      {
        id: "responsiveGradient",
        /**
         * @typedef {Object} ChartWithScales
         * @property {*} scales
         *
         * @typedef {Chart & ChartWithScales} ExtendedChart
         */

        /**
         * Fill chart with gradient on layout change.
         *
         * @param {ExtendedChart} chart Chart instance.
         * @returns {void}
         */
        afterLayout: (chart /* options */) => {
          let scales = chart.scales;
          let color = chart.ctx.createLinearGradient(0, scales["y-axis-0"].bottom, 0, 0);
          color.addColorStop(0, colorsOptions.gradientColor2);
          color.addColorStop(1, colorsOptions.gradientColor1);
          chart.data.datasets[0].backgroundColor = color;
        },
      },
    ],
  };
};

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

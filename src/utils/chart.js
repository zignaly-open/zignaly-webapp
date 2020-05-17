import { Chart } from "chart.js";

/**
 * Generate a chart instance.
 *
 * @param {string} context Element context.
 * @param {Object} options Chart options.
 * @return {Chart} Chart JS instance.
 */
export const generateChart = (context, options) => {
  return new Chart(context, options);
};

/**
 * Prepare chart options.
 *
 * @param {string} backgroundColor Background HTML color.
 * @param {string} borderColor Border HTML color.
 * @returns {Object} Chart options.
 */
export const prepareChartOptions = (backgroundColor, borderColor) => {
  return {
    type: "line",
    data: {
      labels: ["", "", "", "", "", "", "", ""],
      datasets: [
        {
          label: "Equity",
          data: [100, 107, 116, 120, 130, 120, 137, 151],
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
          label: (tooltipItem, data) => {
            return "returns " + data.datasets[0].data[tooltipItem.index];
          },
          afterLabel: (tooltipItem, data) => {
            return new Date();
          },
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

import React from "react";
import "./Doughnut.scss";
import { Box } from "@material-ui/core";
import { Doughnut as DoughnutChart } from "react-chartjs-2";

/**
 * @typedef {import('chart.js').ChartData} ChartData
 * @typedef {import('chart.js').ChartOptions} ChartOptions
 * @typedef {Object} DoughnutColorOptions
 * @property {Array<String>} backgroundColor Background HTML color.
 * @property {string} [borderColor] Border HTML color.
 */

/**
 *
 * @typedef {Object} DefaultProps
 * @property {Array<Number>} values Chart values.
 * @property {Array<String>} labels Chart labels.
 * @property {DoughnutColorOptions} colorOptions
 */

/**
 *
 * @param {DefaultProps} props
 */

const Doughnut = (props) => {
  const { values, labels, colorOptions } = props;
  /**
   * @type Chart.ChartData
   */
  const data = {
    labels: labels,
    datasets: [
      {
        data: values,
        backgroundColor: colorOptions.backgroundColor,
        borderColor: colorOptions.borderColor,
      },
    ],
  };

  /**
   * @type Chart.ChartOptions
   */
  const options = {
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
  };

  return (
    <Box className="doughnut">
      <DoughnutChart data={data} options={options} />
    </Box>
  );
};

export default Doughnut;

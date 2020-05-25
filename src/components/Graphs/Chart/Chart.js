import React, { useEffect } from "react";
import "./Chart.scss";
import { prepareLineChartOptions, generateChart } from "../../../utils/chart";
import { Box } from "@material-ui/core";

/**
 * @typedef {import('../../../utils/chart').ChartColorOptions} ChartColorOptions
 * @typedef {import('../../../utils/chart').ChartData} ChartData
 */

/**
 * @typedef {Object} GenericChartPropTypes
 * @property {String} id ID of the cnavas passed as a child.
 * @property {Object} children Canvas component to render the chart.
 * @property {ChartColorOptions} colorsOptions Chart colors.
 * @property {ChartData} chartData Chart dataset.
 */

/**
 * Provides a wrapper to display a chart.
 *
 * @param {GenericChartPropTypes} props Component properties.
 * @returns {JSX.Element} Component JSX.
 */
const GenericChart = (props) => {
  const { id, chartData, colorsOptions, children } = props;

  useEffect(() => {
    const elementId = id;
    const context = document.getElementById(elementId).getContext("2d");
    generateChart(context, prepareLineChartOptions(colorsOptions, chartData, ""));
  }, [id, chartData, colorsOptions]);

  return <Box className="chart">{children}</Box>;
};

export default GenericChart;

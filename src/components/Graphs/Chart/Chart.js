import React, { useEffect } from "react";
import "./Chart.scss";
import { prepareLineChartOptions, generateChart } from "../../../utils/chart";
import { Box } from "@material-ui/core";

/**
 *
 * @typedef {Object} GenericChartPropTypes
 * @property {String} id ID of the cnavas passed as a child.
 * @property {Object} children Canvas component to render the chart.
 * @property {Array<Object>} data Chart data. (todo)
 */

/**
 * Provides a wrapper to display a chart.
 *
 * @param {GenericChartPropTypes} props Component properties.
 * @returns {JSX.Element} Component JSX.
 */
const GenericChart = (props) => {
  const { id, data, children } = props;

  /**
   * Find DOM canvas element by ID.
   *
   * @returns {HTMLCanvasElement} Chart canvas.
   */
  const getCanvasElement = () => {
    const elementMatch = document.getElementById(id);
    return /** @type {HTMLCanvasElement} */ (elementMatch);
  };

  const chartCanvas = getCanvasElement();
  useEffect(() => {
    const context = chartCanvas.getContext("2d");
    const background = context.createLinearGradient(0, 0, 0, 500);
    background.addColorStop(1, "rgba(216, 216, 216, .1)");
    background.addColorStop(0, "#a946f6");
    const borderColor = "#770fc8";
    generateChart(context, prepareLineChartOptions(background, borderColor, data));
  }, [chartCanvas, data]);

  return <Box className="chart">{children}</Box>;
};

export default GenericChart;

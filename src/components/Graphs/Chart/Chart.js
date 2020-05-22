import React, { useEffect } from "react";
import "./Chart.scss";
import { prepareLineChartOptions, generateChart } from "../../../utils/chart";
import { Box } from "@material-ui/core";

/**
 * @typedef {Object} DayStats
 * @property {string} returns
 * @property {string} day
 *
 * @typedef {Array<DayStats>} DayStatsCollection
 */

/**
 * @typedef {Object} GenericChartPropTypes
 * @property {String} id ID of the cnavas passed as a child.
 * @property {Object} children Canvas component to render the chart.
 * @property {DayStatsCollection} data Daily stats data.
 */

/**
 * Provides a wrapper to display a chart.
 *
 * @param {GenericChartPropTypes} props Component properties.
 * @returns {JSX.Element} Component JSX.
 */
const GenericChart = (props) => {
  const { id, data, labels, children } = props;

  useEffect(() => {
    const elementId = id;
    const context = document.getElementById(elementId).getContext("2d");
    const background = context.createLinearGradient(0, 0, 0, 500);
    background.addColorStop(1, "rgba(216, 216, 216, .1)");
    background.addColorStop(0, "#a946f6");
    const borderColor = "#770fc8";
    generateChart(
      context,
      prepareLineChartOptions(background, borderColor, data, labels, "Equity"),
    );
  }, [id, data]);

  return <Box className="chart">{children}</Box>;
};

/**
 * Provides a wrapper to display a chart.
 *
 * @param {GenericChartPropTypes} props Component properties.
 * @returns {JSX.Element} Component JSX.
 */
export const ReturnsChart = (props) => {
  const { id, data, labels, children } = props;

  useEffect(() => {
    const elementId = id;
    const context = document.getElementById(elementId).getContext("2d");
    const background = context.createLinearGradient(0, 0, 0, 700);
    //   background: linear-gradient(144deg, rgb(0, 0, 0) 0%, rgba(0, 0, 0, 0.34) 20%, rgba(104, 213, 114, 0.19) 22%, rgba(165, 216, 178, 0.08) 69%, rgba(223, 223, 223, 0.03) 89%, rgba(255, 255, 255, 0) 100%);

    background.addColorStop(1, "rgba(255, 255, 255, 0) ");
    background.addColorStop(0.89, "rgba(223, 223, 223, 0.03)");
    background.addColorStop(0.69, "rgba(165, 216, 178, 0.08)");
    background.addColorStop(0.22, "rgba(104, 213, 114, 0.19)");
    background.addColorStop(0.2, "rgba(0, 0, 0, 0.34)");
    background.addColorStop(0, "rgb(0, 0, 0)");
    const borderColor = "#00cb3a";
    console.log(background, borderColor);
    generateChart(context, prepareLineChartOptions(background, borderColor, data, labels, ""));
  }, [id, data]);

  return <Box className="chart">{children}</Box>;
};

export default GenericChart;

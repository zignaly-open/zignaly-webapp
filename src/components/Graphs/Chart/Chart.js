import React, { useEffect } from "react";
import "./Chart.scss";
import { prepareLineChartOptions, generateChart } from "../../../utils/chart";
import { Box } from "@material-ui/core";
import PropTypes from "prop-types";

/**
 *
 * @typedef {Object} DefaultProps
 * @property {String} id
 * @property {Object} children
 */

/**
 *
 * @param {DefaultProps} props
 */

const GenericChart = (props) => {
  const { id, children } = props;

  useEffect(() => {
    const elementId = id;
    const context = document.getElementById(elementId).getContext("2d");
    const background = context.createLinearGradient(0, 0, 0, 500);
    background.addColorStop(1, "rgba(216, 216, 216, .1)");
    background.addColorStop(0, "#a946f6");
    const borderColor = "#770fc8";
    generateChart(context, prepareLineChartOptions(background, borderColor));
  }, [props.id]);

  return <Box className="chart">{children}</Box>;
};

GenericChart.prototype = {
  children: PropTypes.node.isRequired,
  id: PropTypes.string.isRequired,
};

export default GenericChart;

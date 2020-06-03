import React, { useEffect } from "react";
import "./Doughnut.scss";
import { Box } from "@material-ui/core";
import { preparePieChartOptions, generateChart, getCanvasContext } from "../../../utils/chart";

/**
 *
 * @typedef {import("../../../utils/chart").ChartData} ChartData
 * @typedef {import("../../../utils/chart").DoughnutColorOptions} DoughnutColorOptions
 */

/**
 *
 * @typedef {Object} DefaultProps
 * @property {ChartData} chartData
 * @property {DoughnutColorOptions} colorOptions
 */

/**
 *
 * @param {DefaultProps} props
 */

const Doughnut = (props) => {
  const { chartData, colorOptions } = props;

  useEffect(() => {
    const canvasContext = getCanvasContext("myDoughnut");
    generateChart(canvasContext, preparePieChartOptions(chartData, colorOptions));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chartData.values]);

  return (
    <Box className="doughnut">
      <canvas className="doughnutCanvas" id="myDoughnut" />
    </Box>
  );
};

export default Doughnut;

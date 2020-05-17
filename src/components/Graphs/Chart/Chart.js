import React, { useEffect } from "react";
import "./Chart.scss";
import { prepareChartOptions, generateChart } from "../../../utils/chart";
import { Box } from "@material-ui/core";

const GenericChart = (props) => {
  useEffect(() => {
    const elementId = props.id;
    const context = document.getElementById(elementId).getContext("2d");
    const background = context.createLinearGradient(0, 0, 0, 500);
    background.addColorStop(1, "rgba(216, 216, 216, .1)");
    background.addColorStop(0, "#a946f6");
    const borderColor = "#770fc8";
    generateChart(context, prepareChartOptions(background, borderColor));
  }, [props.id]);

  return <Box className="chart">{props.children}</Box>;
};

export default GenericChart;

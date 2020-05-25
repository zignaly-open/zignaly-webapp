import React, { useEffect } from "react";
import "./Doughnut.scss";
import { Box } from "@material-ui/core";
import { preparePieChartOptions, generateChart, getCanvasContext } from "../../../utils/chart";

const Doughnut = () => {
  useEffect(() => {
    const canvasContext = getCanvasContext("myDoughnut");
    const borderColor = "#770fc8";
    const chunksColors = ["#a946f6", "#770fc8"];
    generateChart(canvasContext, preparePieChartOptions(chunksColors, borderColor));
  }, []);

  return (
    <Box className="doughnut">
      <canvas className="doughnutCanvas" id="myDoughnut" />
    </Box>
  );
};

export default Doughnut;

import React, { useEffect } from "react";
import "./Doughnut.scss";
import { Box } from "@material-ui/core";
import { preparePieChartOptions, generateChart } from "../../../utils/chart";

const Doughnut = () => {
  useEffect(() => {
    const context = document.getElementById("myDoughnut").getContext("2d");
    const borderColor = "#770fc8";
    const gradientColors = ["#a946f6", "#770fc8"];
    generateChart(context, preparePieChartOptions(gradientColors, borderColor));
  }, []);

  return (
    <Box className="doughnut">
      <canvas className="doughnutCanvas" id="myDoughnut" />
    </Box>
  );
};

export default Doughnut;

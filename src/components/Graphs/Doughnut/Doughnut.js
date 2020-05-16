import React, { useEffect } from "react";
import "./Doughnut.scss";
import { Box } from "@material-ui/core";
import { Chart } from "chart.js";

const Doughnut = props => {
  useEffect(() => {
    let ctx = document.getElementById("myDoughnut").getContext("2d");
    let background = ctx.createLinearGradient(0, 0, 0, 500);
    background.addColorStop(1, "rgba(216, 216, 216, 1)");
    background.addColorStop(0, "#a946f6");
    let border = "#770fc8";
    new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: ["BTC", "ETH"],
        datasets: [
          {
            data: [25, 75],
            backgroundColor: ["#a946f6", "#770fc8"],
            borderColor: border,
          },
        ],
      },
      options: {
        responsive: true,
        legend: {
          display: true,
          position: "right",
        },
      },
    });
  }, []);

  return (
    <Box className="doughnut">
      <canvas className="doughnutCanvas" id="myDoughnut" />
    </Box>
  );
};

export default Doughnut;

import React from "react";
import { Box } from "@material-ui/core";
import "./WinRate.scss";

const WinRate = ({ val }) => (
  <Box className="winRate" title={val + "%"}>
    <Box
      className={"bar " + (val > 90 ? "green" : val > 51 ? "yellow" : "pink")}
      style={{
        width: `${val}%`,
      }}
    />
  </Box>
);

export default WinRate;

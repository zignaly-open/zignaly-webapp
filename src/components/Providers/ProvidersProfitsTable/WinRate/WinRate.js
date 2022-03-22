import React from "react";
import { Box } from "@mui/material";
import "./WinRate.scss";

/**
 * Provides a bar to display win rate.
 *
 * @typedef {Object} DefaultProps
 * @property {number} val Win rate value.
 *
 * @param {DefaultProps} props Component props.
 * @returns {JSX.Element} Component JSX.
 */
const WinRate = ({ val }) => (
  <Box className="winRate" title={val.toFixed(2) + "%"}>
    <Box
      className={"bar " + (val > 90 ? "green" : val > 51 ? "yellow" : "pink")}
      style={{
        width: `${val}%`,
      }}
    />
  </Box>
);

export default WinRate;

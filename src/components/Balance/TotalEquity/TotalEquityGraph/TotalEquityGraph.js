import React from "react";
import "./TotalEquityGraph.scss";
import GenericChart from "../../../Graphs/Chart";
import { Box } from "@material-ui/core";
import { toNumber } from "lodash";

/**
 *
 * @typedef {import("../../../../services/tradeApiClient.types").UserEquityEntity} UserEquityEntity
 */

/**
 *
 * @typedef {Object} DefaultProps
 * @property {Array<UserEquityEntity>} list
 */

/**
 *
 * @param {DefaultProps} props Default props.
 */

const TotalEquityGraph = ({ list }) => {
  /**
   * @typedef {import("../../../Graphs/Chart/Chart").ChartData} ChartData
   * @type {ChartData}
   */
  let chartData = { values: [], labels: [] };

  const colorsOptions = {
    backgroundColor: "",
    borderColor: "#a946f6",
    gradientColor1: "#a946f6",
    gradientColor2: "#fafafa",
  };

  const prepareChartData = () => {
    [...list].forEach((item) => {
      chartData.values.unshift(parseFloat(item.totalUSDT));
      chartData.labels.unshift("");
    });
  };

  prepareChartData();

  /**
   *
   * @typedef {import('chart.js').ChartTooltipItem} ChartTooltipItem
   */

  /**
   * Format tooltip content.
   * @param {ChartTooltipItem} tooltipItem Tooltip object.
   * @returns {React.ReactNode} Tooltip content.
   */

  const tooltipFormat = (tooltipItem) => {
    // console.log(list[list.length - tooltipItem.index]);
    return (
      <Box className="equityTooltip">
        <Box>
          <span className="label"> Date:</span>
          <span>
            {list[list.length - tooltipItem.index]
              ? list[list.length - tooltipItem.index].date
              : "0"}
          </span>
        </Box>
        <Box>
          <span className="label">Total BTC:</span>
          <span>
            {list[list.length - tooltipItem.index]
              ? +toNumber(list[list.length - tooltipItem.index].totalBTC).toFixed(8)
              : "0"}
          </span>
        </Box>
        <Box>
          <span className="label">Total USDT:</span>
          <span>
            {list[list.length - tooltipItem.index]
              ? +toNumber(list[list.length - tooltipItem.index].totalUSDT).toFixed(8)
              : "0"}
          </span>
        </Box>
      </Box>
    );
  };

  return (
    <GenericChart
      chartData={chartData}
      colorsOptions={colorsOptions}
      tooltipFormat={tooltipFormat}
    />
  );
};

export default TotalEquityGraph;

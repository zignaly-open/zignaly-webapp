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

const TotalEquityGraph = (props) => {
  const { list } = props;
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

  const tooltipFormat = (tooltipItem) => (
    <Box className="contentTooltip">
      <Box>{+toNumber(tooltipItem.yLabel).toFixed(8)}</Box>
      <Box className="subtitleTooltip">{tooltipItem.xLabel}</Box>
    </Box>
  );

  return (
    <GenericChart
      chartData={chartData}
      colorsOptions={colorsOptions}
      tooltipFormat={tooltipFormat}
    />
  );
};

export default TotalEquityGraph;

import React from "react";
import "./TotalEquityGraph.scss";
import GenericChart from "../../../Graphs/GradientLineChart";
import { Box } from "@material-ui/core";
import { toNumber } from "lodash";
import useStoreSettingsSelector from "../../../../hooks/useStoreSettingsSelector";
import { colors } from "../../../../services/theme";

/**
 *
 * @typedef {import("../../../../services/tradeApiClient.types").UserEquityEntity} UserEquityEntity
 */

/**
 *
 * @typedef {Object} DefaultProps
 * @property {Array<UserEquityEntity>} list
 * @property {boolean} modal Flag to indicate if chart is displayed inside a modal.
 */

/**
 *
 * @param {DefaultProps} props Default props.
 */

const TotalEquityGraph = ({ list, modal }) => {
  const { darkStyle } = useStoreSettingsSelector();

  /**
   * @typedef {import("../../../Graphs/GradientLineChart/GradientLineChart").ChartData} ChartData
   * @type {ChartData}
   */
  let chartData = { values: [], labels: [] };

  const colorsOptions = {
    backgroundColor: "",
    borderColor: darkStyle ? "#460088" : "#a946f6",
    gradientColor1: darkStyle ? (modal ? "#191328" : "#170823") : "#9c39eb",
    gradientColor2: darkStyle ? (modal ? colors.lighterBlack : "#12111d") : "#fafafa",
  };

  const prepareChartData = () => {
    [...list].forEach((item) => {
      chartData.values.push(item.totalUSDT);
      chartData.labels.push("");
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
          <span>{list[tooltipItem.index] ? list[tooltipItem.index].date : "0"}</span>
        </Box>
        <Box>
          <span className="label">BTC:</span>
          <span>
            {toNumber(list[tooltipItem.index].totalBTC) > 1
              ? +toNumber(list[tooltipItem.index].totalBTC).toFixed(2)
              : +toNumber(list[tooltipItem.index].totalBTC).toFixed(8)}
          </span>
        </Box>
        <Box>
          <span className="label">USDT:</span>
          <span>
            {toNumber(list[tooltipItem.index].totalUSDT) > 1
              ? +toNumber(list[tooltipItem.index].totalUSDT).toFixed(2)
              : +toNumber(list[tooltipItem.index].totalUSDT).toFixed(8)}
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

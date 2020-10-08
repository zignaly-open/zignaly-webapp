import React from "react";
import "./TotalEquityGraph.scss";
import GenericChart from "../../../Graphs/GradientLineChart";
import { Box } from "@material-ui/core";
import useStoreSettingsSelector from "../../../../hooks/useStoreSettingsSelector";
import { colors } from "../../../../services/theme";
import { formatFloat } from "../../../../utils/format";

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
    borderColor: darkStyle ? (modal ? "#571991" : "#460088") : "#a946f6",
    gradientColor1: darkStyle ? (modal ? "#492C6D" : "#270B48") : "#9c39eb",
    gradientColor2: darkStyle ? (modal ? colors.lightestBlack : colors.lightBlack) : "#fafafa",
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
    return (
      <Box className="equityTooltip">
        <Box>
          <span className="label"> Date:</span>
          <span>{list[tooltipItem.index] ? list[tooltipItem.index].date : "0"}</span>
        </Box>
        <Box>
          <span className="label">BTC:</span>
          <span>{formatFloat(list[tooltipItem.index].totalBTC)}</span>
        </Box>
        <Box>
          <span className="label">USDT:</span>
          <span>{formatFloat(list[tooltipItem.index].totalUSDT)}</span>
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

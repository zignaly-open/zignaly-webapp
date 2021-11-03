import React from "react";
import GenericChart from "../../../Graphs/LineChart";
import { Box } from "@material-ui/core";

/**
 *
 * @typedef {import("../../../../services/tradeApiClient.types").ProviderCopiersEntity} ProviderCopiersEntity
 */

/**
 *
 * @typedef {Object} DefaultProps
 * @property {Array<ProviderCopiersEntity>} list
 */

/**
 * Copier chart component.
 *
 * @param {DefaultProps} props Default props.
 * @returns {JSX.Element} JSX component.
 */
const CopiersGraph = ({ list }) => {
  /**
   * @typedef {import("../../../Graphs/GradientLineChart/GradientLineChart").ChartData} ChartData
   * @type {ChartData}
   */
  let chartData = { values: [], labels: [] };

  const colorsOptions = {
    borderColor: "#a946f6",
  };

  const prepareChartData = () => {
    [...list].forEach((item) => {
      chartData.values.push(item.totalFollowers);
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
          <span className="label">Followers:</span>
          <span>{list[tooltipItem.index] ? list[tooltipItem.index].totalFollowers : "0"}</span>
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

export default CopiersGraph;

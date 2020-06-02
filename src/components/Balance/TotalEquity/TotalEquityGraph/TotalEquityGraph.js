import React, { useState, useEffect } from "react";
import "./TotalEquityGraph.scss";
import GenericChart from "../../../Graphs/Chart";

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
      chartData.values.push(parseFloat(item.totalUSD));
      chartData.labels.push("");
    });
  };

  prepareChartData();

  return (
    <GenericChart chartData={chartData} colorsOptions={colorsOptions} tooltipFormat={() => 100} />
  );
};

export default TotalEquityGraph;

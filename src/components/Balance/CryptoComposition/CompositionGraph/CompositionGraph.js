import React from "react";
import "./CompositionGraph.scss";
import Doughnut from "../../../Graphs/Doughnut";

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

const CompositionGraph = (props) => {
  const { list } = props;

  const sectionColors = [
    "#770fc8",
    "#a25cd9",
    "#a946f6",
    "#f63f82",
    "#c12860",
    "#b52a00",
    "#c91919",
  ];

  const cryptos = ["BNB", "BTC", "ETH", "PAX", "TUSD", "USDC", "USDT"];

  /**
   * @typedef {import("../../../Graphs/Chart/Chart").ChartData} ChartData
   * @type {ChartData}
   */
  let chartData = { values: [], labels: [] };

  const colorsOptions = {
    backgroundColor: sectionColors,
    borderColor: "#4e07da",
  };

  const prepareChartData = () => {
    /**
     * @type {*}
     */
    let data = list.length ? list[0] : {};
    if (data) {
      for (let a = 0; a < cryptos.length; a++) {
        if (data[cryptos[a]] && data[cryptos[a]] !== "0E-12") {
          chartData.values.push(data[cryptos[a]]);
          chartData.labels.push(cryptos[a]);
        }
      }
    }
  };

  prepareChartData();

  return <Doughnut chartData={chartData} colorOptions={colorsOptions} />;
};

export default CompositionGraph;

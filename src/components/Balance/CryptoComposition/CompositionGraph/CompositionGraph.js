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
 * @property {Array<String>} quotes
 */

/**
 *
 * @param {DefaultProps} props Default props.
 */

const CompositionGraph = (props) => {
  const { list, quotes } = props;

  const sectionColors = [
    "#770fc8",
    "#a25cd9",
    "#a946f6",
    "#f63f82",
    "#c12860",
    "#b52a00",
    "#c91919",
    "#08a441",
    "#f6ad3f",
    "#017aff",
  ];

  /**
   * @typedef {import("../../../Graphs/Chart/Chart").ChartData} ChartData
   * @type {ChartData}
   */
  let chartData = { values: [], labels: [] };

  const colorsOptions = {
    backgroundColor: sectionColors,
  };

  const prepareChartData = () => {
    /**
     * @type {*}
     */
    let equity = list.length ? list[0] : {};
    if (equity) {
      for (let a = 0; a < quotes.length; a++) {
        let property = quotes[a] + "percantage";
        console.log(property);
        if (equity[property]) {
          chartData.values.push(equity[property]);
          chartData.labels.push(quotes[a]);
        }
      }
      chartData.values.push(equity.otherPercentage);
      chartData.labels.push("Others");
    }
    console.log(chartData);
  };

  prepareChartData();

  return <Doughnut chartData={chartData} colorOptions={colorsOptions} />;
};

export default CompositionGraph;

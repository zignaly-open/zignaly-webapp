import React from "react";
import "./CompositionGraph.scss";
import Doughnut from "../../../Graphs/Doughnut";
import { useIntl } from "react-intl";

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

const CompositionGraph = ({ list, quotes }) => {
  const intl = useIntl();

  const sectionColors = [
    "#770fc8",
    "#c12860",
    "#f63f82",
    "#b52a00",
    "#c91919",
    "#08a441",
    "#f6ad3f",
    "#017aff",
  ];

  /**
   * @typedef {import("../../../Graphs/LineChart/LineChart").ChartData} ChartData
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
        let property = quotes[a] + "percentage";
        let value =
          typeof equity[property] === "string" ? parseFloat(equity[property]) : equity[property];
        if (value > 0) {
          chartData.values.push(value);
          chartData.labels.push(quotes[a]);
        }
      }
      chartData.values.push(
        typeof equity.otherPercentage === "string"
          ? parseFloat(equity.otherPercentage)
          : equity.otherPercentage,
      );
      chartData.labels.push(intl.formatMessage({ id: "graph.others" }));
    }
  };

  prepareChartData();

  return <Doughnut chartData={chartData} colorOptions={colorsOptions} />;
};

export default CompositionGraph;

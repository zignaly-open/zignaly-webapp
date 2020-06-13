import React from "react";
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

const CompositionGraph = ({ list, quotes }) => {
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
   * @type {Array<Number>}
   */
  let values = [];

  /**
   * @type {Array<String>}
   */
  let labels = [];

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
        if (equity[property]) {
          values.push(equity[property]);
          labels.push(quotes[a]);
        }
      }
      values.push(equity.otherPercentage);
      labels.push("Others");
    }
  };

  prepareChartData();

  return <Doughnut colorOptions={colorsOptions} labels={labels} values={values} />;
};

export default CompositionGraph;

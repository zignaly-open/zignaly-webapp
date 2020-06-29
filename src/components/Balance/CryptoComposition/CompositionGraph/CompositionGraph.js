import React from "react";
import Doughnut from "../../../Graphs/Doughnut";
import { useIntl } from "react-intl";
import { formatFloat } from "../../../../utils/format";

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
    "#f63f82",
    "#b52a00",
    "#c12860",
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
    let currentDate = new Date();
    /**
     * @type {*}
     */
    let equity = list.length
      ? list.find(
          (item) =>
            new Date(item.date).getDate() === currentDate.getDate() &&
            new Date(item.date).getMonth() === currentDate.getMonth(),
        )
      : {};
    if (equity) {
      for (let a = 0; a < quotes.length; a++) {
        let property = quotes[a] + "percentage";
        let value =
          typeof equity[property] === "string" ? parseFloat(equity[property]) : equity[property];
        if (value > 0) {
          values.push(value.toFixed(2));
          labels.push(quotes[a] + "%");
        }
      }
      if (equity.otherPercentage > 0) {
        /* @ts-ignore */
        values.push(formatFloat(equity.otherPercentage));
        labels.push(intl.formatMessage({ id: "graph.others" }));
      }
    }
  };

  prepareChartData();

  return <Doughnut colorOptions={colorsOptions} labels={labels} values={values} />;
};

export default CompositionGraph;

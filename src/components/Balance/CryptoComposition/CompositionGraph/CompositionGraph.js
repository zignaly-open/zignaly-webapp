import React from "react";
import Doughnut from "../../../Graphs/Doughnut";
import { useIntl } from "react-intl";
import { formatFloat2Dec } from "../../../../utils/format";

/**
 *
 * @typedef {import("../../../../services/tradeApiClient.types").UserEquityEntity} UserEquityEntity
 */

/**
 *
 * @typedef {Object} DefaultProps
 * @property {Array<UserEquityEntity>} list
 * @property {Array<String>} quotes
 * @property {boolean} vertical Display legend under the doughnut.
 */

/**
 *
 * @param {DefaultProps} props Default props.
 */

const CompositionGraph = ({ list, quotes, vertical }) => {
  const intl = useIntl();

  const sectionColors = [
    "#770fc8",
    "#e0009d",
    "#ff256e",
    "#ff7d4b",
    "#ffbf45",
    "#f9f871",
    "#9c2eef",
    "#ff1fbc",
    "#ff70a0",
    "#ffd485",
    "#fcfcb1",
    "#770fc8",
    "#e0009d",
    "#ff256e",
    "#ff7d4b",
    "#ffbf45",
    "#f9f871",
    "#9c2eef",
    "#ff1fbc",
    "#ff70a0",
    "#ffd485",
    "#fcfcb1",
  ];

  /**
   * @type {Array<String>}
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
    let equity = list.length ? list[list.length - 1] : {};
    if (equity) {
      for (let i = 0; i < quotes.length; i++) {
        let property = quotes[i] + "percentage";
        let value =
          typeof equity[property] === "string" ? parseFloat(equity[property]) : equity[property];
        if (value > 0) {
          //   values.push(formatFloat2Dec(value));
          values.push(value);
          labels.push(quotes[i]);
        }
      }
      if (equity.otherPercentage > 0) {
        values.push(formatFloat2Dec(equity.otherPercentage));

        labels.push(
          intl.formatMessage({
            id: "graph.others",
          }),
        );
      }
    }
  };

  prepareChartData();

  return (
    <Doughnut colorOptions={colorsOptions} labels={labels} values={values} vertical={vertical} />
  );
};

export default CompositionGraph;

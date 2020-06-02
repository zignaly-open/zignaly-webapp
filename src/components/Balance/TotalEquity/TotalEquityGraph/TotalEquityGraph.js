import React from "react";
import "./TotalEquityGraph.scss";
import GenericChart from "../../../Graphs/Chart";

// /**
//  *
//  * @typedef {import("../../../../services/tradeApiClient.types").UserEquityEntity} UserEquityEntity
//  */

// /**
//  *
//  * @typedef {Object} DefaultProps
//  * @property {Array<UserEquityEntity>} list
//  */

// /**
//  *
//  * @param {DefaultProps} props Default props.
//  */

const TotalEquityGraph = () => {
  let chartData = { values: [100, 200, 150, 200, 220, 250], labels: ["", "", "", "", "", ""] };

  let colorsOptions = {
    backgroundColor: "",
    borderColor: "#a946f6",
    gradientColor1: "#a946f6",
    gradientColor2: "#fafafa",
  };

  return (
    <GenericChart chartData={chartData} colorsOptions={colorsOptions} tooltipFormat={() => 100} />
  );
};

export default TotalEquityGraph;

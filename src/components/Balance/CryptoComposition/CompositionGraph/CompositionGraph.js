import React from "react";
import "./CompositionGraph.scss";
import { Box, Typography } from "@material-ui/core";
import Doughnut from "../../../Graphs/Doughnut";
import { FormattedMessage } from "react-intl";

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
  console.log(list);
  return <Doughnut />;
};

export default CompositionGraph;

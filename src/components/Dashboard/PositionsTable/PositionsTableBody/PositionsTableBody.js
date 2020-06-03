import React, { useState } from "react";
import "./PositionsTableBody.scss";
import { colors } from "../../../../services/theme";
import { formatNumber, formatPrice } from "../../../../utils/formatters";
import tradeApi from "../../../../services/tradeApiClient";
import { FormattedMessage } from "react-intl";

/**
 * @typedef {import("../../../../services/tradeApiClient.types").PositionEntity} PositionEntity
 * @typedef {import("../PositionsTable").PositionsTableProps} PositionsTableProps
 * @typedef {Object} PositionTableBodyProps
 * @property {Array<PositionEntity>} positions
 * @property {PositionsTableProps["type"]} type
 */

/**
 * Display user positions table body rows.
 *
 * @param {PositionTableBodyProps} props Component properties.
 *
 * @return {JSX.Element} Position table body element.
 */
const PositionsTableBody = (props) => {
  const storeSession = useStoreSessionSelector();
  const { positions, type } = props;

  return <></>;
};

export default PositionsTableBody;

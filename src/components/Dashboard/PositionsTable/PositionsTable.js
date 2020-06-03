import React from "react";
import "./PositionsTable.scss";
import { Box } from "@material-ui/core";
import Table from "../../Table";
import {
  composeOpenPositionsDataTable,
  composeClosePositionsDataTable,
  composeLogPositionsDataTable,
} from "../../../utils/composePositionsDataTable";

/**
 * @typedef {import("../../../services/tradeApiClient.types").UserPositionsCollection} UserPositionsCollection
 * @typedef {import("../../../utils/composePositionsDataTable").DataTableContent} DataTableContent
 * @typedef {import("../../../hooks/usePositionsList").PositionsCollectionType} PositionsCollectionType
 * @typedef {Object} PositionsTableProps
 * @property {PositionsCollectionType} type
 * @property {UserPositionsCollection} positions
 */

/**
 * Component that display user positions in table view.
 *
 * @param {PositionsTableProps} props Component properties.
 * @returns {JSX.Element} Positions table element.
 */
const PositionsTable = (props) => {
  const { type, positions } = props;

  /**
   * Compose MUI data table for positions collection of selected type.
   *
   * @returns {DataTableContent} Data table content.
   */
  const composeDataTableForPositionsType = () => {
    if (type === "closed") {
      return composeClosePositionsDataTable(positions);
    }

    if (type === "log") {
      return composeLogPositionsDataTable(positions);
    }

    return composeOpenPositionsDataTable(positions);
  };

  const { columns, data } = composeDataTableForPositionsType();

  return (
    <Box className="positionsTable" display="flex" flexDirection="column" width={1}>
      <Table columns={columns} data={data} persistKey="openPositions" title={false} />
    </Box>
  );
};

export default PositionsTable;

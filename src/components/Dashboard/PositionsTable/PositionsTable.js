import React from "react";
import "./PositionsTable.scss";
import { Box, Table } from "@material-ui/core";
import PositionsTableHead from "./PositionsTableHead";
import PositionsTableBody from "./PositionsTableBody";

/**
 * @typedef {import("../../../services/tradeApiClient.types").UserPositionsCollection} UserPositionsCollection
 * @typedef {import("../../../hooks/usePositionsList").PositionsCollectionType} PositionsCollectionType
 */

/**
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

  return (
    <Box
      alignItems="center"
      className="positionsTable"
      display="flex"
      flexDirection="column"
      justifyContent="center"
    >
      <Box
        className="tableBox hideScroll"
        display="flex"
        flexDirection="row"
        justifyContent="flex-start"
      >
        <Table className="table">
          <PositionsTableHead type={type} />
          <PositionsTableBody positions={positions} type={type} />
        </Table>
      </Box>
    </Box>
  );
};

export default PositionsTable;

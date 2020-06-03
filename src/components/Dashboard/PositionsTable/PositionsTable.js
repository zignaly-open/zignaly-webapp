import React from "react";
import "./PositionsTable.scss";
import { Box } from "@material-ui/core";
import Table from "../../Table";
import { composeOpenPositionsDataTable } from "../../../utils/composePositionsDataTable";

/**
 * @typedef {import("../../../services/tradeApiClient.types").UserPositionsCollection} UserPositionsCollection
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
  const { columns, data } = composeOpenPositionsDataTable(positions);

  return (
    <Box className="positionsTable" display="flex" flexDirection="column" width={1}>
      <Table
        columns={columns}
        data={data}
        persistKey="openPositions"
        title={<h2>Open positions</h2>}
      />
    </Box>
  );
};

export default PositionsTable;

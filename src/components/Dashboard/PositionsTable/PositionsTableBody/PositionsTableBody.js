import React from "react";
import "./PositionsTableBody.scss";
import { TableBody, TableRow, TableCell } from "@material-ui/core";

/**
 * @typedef {import("../../../../services/tradeApiClient.types").PositionEntity} PositionEntity
 */

/**
 *
 * @typedef {Object} DefaultProps
 * @property {Array<PositionEntity>} positions
 */

/**
 * Default component props.
 *
 * @param {DefaultProps} props
 */

const PositionsTableBody = (props) => {
  const { positions } = props;

  return (
    <TableBody className="tableBody">
      {positions.map((position) => (
        <TableRow className="row" key={position.positionId}>
          <TableCell align="left" className="cell">
            {position.openDate}
          </TableCell>
          <TableCell align="left" className="cell">
            {position.side}
          </TableCell>
          <TableCell align="left" className="cell">
            {"data"}
          </TableCell>
          <TableCell align="left" className="cell">
            {"data"}
          </TableCell>
          <TableCell align="left" className="cell">
            {"time"}
          </TableCell>
          <TableCell align="left" className="cell">
            {"data"}
          </TableCell>
          <TableCell align="left" className="cell">
            {"data"}
          </TableCell>
          <TableCell align="left" className="cell">
            {"data"}
          </TableCell>
          <TableCell align="left" className="cell">
            {"time"}
          </TableCell>
          <TableCell align="left" className="cell">
            {"data"}
          </TableCell>
          <TableCell align="left" className="cell">
            {"time"}
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  );
};

export default PositionsTableBody;

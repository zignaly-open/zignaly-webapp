import React from "react";
import "./PositionsTableHead.scss";
import { TableHead, TableRow, TableCell } from "@material-ui/core";

const PositionsTableHead = () => {
  return (
    <TableHead className="tableHead">
      <TableRow className="row">
        <TableCell align="left" className="cell">
          Time
        </TableCell>
        <TableCell align="left" className="cell">
          Type
        </TableCell>
        <TableCell align="left" className="cell">
          Pair
        </TableCell>
        <TableCell align="left" className="cell">
          Trader
        </TableCell>
        <TableCell align="left" className="cell">
          Invested
        </TableCell>
        <TableCell align="left" className="cell">
          Entry Price
        </TableCell>
        <TableCell align="left" className="cell">
          Current Price
        </TableCell>
        <TableCell align="left" className="cell">
          P/L %
        </TableCell>
        <TableCell align="left" className="cell">
          P/L #
        </TableCell>
        <TableCell align="left" className="cell">
          Net Profit
        </TableCell>
        <TableCell align="left" className="cell">
          Risk
        </TableCell>
      </TableRow>
    </TableHead>
  );
};

export default PositionsTableHead;

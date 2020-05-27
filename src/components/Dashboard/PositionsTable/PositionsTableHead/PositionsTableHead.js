import React from "react";
import "./PositionsTableHead.scss";
import { TableHead, TableRow, TableCell } from "@material-ui/core";

const PositionsTableHead = () => {
  return (
    <TableHead className="tableHead">
      <TableRow className="row">
        <TableCell align="left" className="cell">
          {" "}
        </TableCell>
        <TableCell align="left" className="cell">
          Open Date
        </TableCell>
        <TableCell align="left" className="cell">
          Provider
        </TableCell>
        <TableCell align="left" className="cell">
          Signal ID
        </TableCell>
        <TableCell align="left" className="cell">
          Pair
        </TableCell>
        <TableCell align="left" className="cell">
          Entry Price
        </TableCell>
        <TableCell align="left" className="cell">
          Leverage
        </TableCell>
        <TableCell align="left" className="cell">
          Current Price
        </TableCell>
        <TableCell align="left" className="cell">
          P/L #
        </TableCell>
        <TableCell align="left" className="cell">
          Price Difference
        </TableCell>
        <TableCell align="left" className="cell">
          Type
        </TableCell>
        <TableCell align="left" className="cell">
          Stop Loss Price
        </TableCell>
        <TableCell align="left" className="cell">
          Initial Amount
        </TableCell>
        <TableCell align="left" className="cell">
          Remaining Amount
        </TableCell>
        <TableCell align="left" className="cell">
          Invested
        </TableCell>
        <TableCell align="left" className="cell">
          TSL
        </TableCell>
        <TableCell align="left" className="cell">
          TP
        </TableCell>
        <TableCell align="left" className="cell">
          DCA
        </TableCell>
        <TableCell align="left" className="cell">
          Risk
        </TableCell>
        <TableCell align="left" className="cell">
          Age
        </TableCell>
        <TableCell align="left" className="cell">
          Open Trigger
        </TableCell>
        <TableCell align="left" className="cell">
          Edit
        </TableCell>
        <TableCell align="left" className="cell">
          Exit Position
        </TableCell>
        <TableCell align="left" className="cell">
          Cancel Position
        </TableCell>
      </TableRow>
    </TableHead>
  );
};

export default PositionsTableHead;

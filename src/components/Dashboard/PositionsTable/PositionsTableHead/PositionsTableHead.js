import React from "react";
import "./PositionsTableHead.scss";
import { TableHead, TableRow, TableCell } from "@material-ui/core";

/**
 * @typedef {import("../PositionsTable").PositionsTableProps} PositionsTableProps
 */

/**
 * Display user position table header cells.
 *
 * @param {PositionsTableProps} props Component properties.
 *
 * @returns {JSX.Element} Table head element.
 */
const PositionsTableHead = (props) => {
  const { type } = props;
  return (
    <TableHead className="tableHead">
      <TableRow className="row">
        <TableCell align="left" className="cell">
          {" "}
        </TableCell>
        <TableCell align="left" className="cell">
          Open Date
        </TableCell>
        {type === "closed" && (
          <TableCell align="left" className="cell">
            Close Date
          </TableCell>
        )}
        <TableCell align="left" className="cell">
          Provider
        </TableCell>
        <TableCell align="left" className="cell">
          Provider Name
        </TableCell>
        {type === "closed" && (
          <TableCell align="left" className="cell">
            Status
          </TableCell>
        )}
        <TableCell align="left" className="cell">
          Signal ID
        </TableCell>
        <TableCell align="left" className="cell">
          Pair
        </TableCell>
        <TableCell align="left" className="cell">
          Entry Price
        </TableCell>
        {type === "closed" && (
          <TableCell align="left" className="cell">
            Exit Price
          </TableCell>
        )}
        {type === "open" && (
          <TableCell align="left" className="cell">
            Leverage
          </TableCell>
        )}
        {type === "open" && (
          <TableCell align="left" className="cell">
            Current Price
          </TableCell>
        )}
        <TableCell align="left" className="cell">
          P/L #
        </TableCell>
        <TableCell align="left" className="cell">
          Price Difference
        </TableCell>
        <TableCell align="left" className="cell">
          Side
        </TableCell>
        <TableCell align="left" className="cell">
          Stop Loss Price
        </TableCell>
        {type === "closed" && (
          <TableCell align="left" className="cell">
            Initial Amount
          </TableCell>
        )}
        {type === "open" && (
          <TableCell align="left" className="cell">
            Initial Amount
          </TableCell>
        )}
        {type === "open" && (
          <TableCell align="left" className="cell">
            Remaining Amount
          </TableCell>
        )}
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
        {type === "open" && (
          <TableCell align="left" className="cell">
            Age
          </TableCell>
        )}
        <TableCell align="left" className="cell">
          Open Trigger
        </TableCell>
        {type === "closed" && (
          <>
            <TableCell align="left" className="cell">
              Fees
            </TableCell>
            <TableCell align="left" className="cell">
              Net Profit %
            </TableCell>
            <TableCell align="left" className="cell">
              Net Profit
            </TableCell>
            <TableCell align="left" className="cell">
              View
            </TableCell>
          </>
        )}
        {type === "open" && (
          <>
            <TableCell align="left" className="cell">
              Edit
            </TableCell>
            <TableCell align="left" className="cell">
              Exit Position
            </TableCell>
            <TableCell align="left" className="cell">
              Cancel Position
            </TableCell>
          </>
        )}
      </TableRow>
    </TableHead>
  );
};

export default PositionsTableHead;

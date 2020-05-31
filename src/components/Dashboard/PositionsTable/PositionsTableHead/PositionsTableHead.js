import React from "react";
import "./PositionsTableHead.scss";
import { TableHead, TableRow, TableCell } from "@material-ui/core";
import { FormattedMessage } from "react-intl";

/**
 * @typedef {import("../../../../hooks/usePositionsList").PositionsCollectionType} PositionsCollectionType
 * @typedef {Object} PositionsTableHeadProps
 * @property {PositionsCollectionType} type
 */

/**
 * Display user position table header cells.
 *
 * @param {PositionsTableHeadProps} props Component properties.
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
        <TableCell align="left" className="cell bold">
          <span>▼ </span>
          <FormattedMessage id="col.date.open" />
        </TableCell>
        {type === "closed" && (
          <TableCell align="left" className="cell">
            <FormattedMessage id="col.date.close" />
          </TableCell>
        )}
        <TableCell align="center" className="cell">
          <FormattedMessage id="col.provider.logo" />
        </TableCell>
        <TableCell align="left" className="cell">
          <FormattedMessage id="col.provider.name" />
        </TableCell>
        {["closed", "log"].includes(type) && (
          <TableCell align="left" className="cell">
            <FormattedMessage id="col.stat" />
          </TableCell>
        )}
        <TableCell align="left" className="cell">
          <FormattedMessage id="col.signalid" />
        </TableCell>
        <TableCell align="left" className="cell">
          <FormattedMessage id="col.pair" />
        </TableCell>
        <TableCell align="left" className="cell">
          <FormattedMessage id="col.price.entry" />
        </TableCell>
        {type === "closed" && (
          <TableCell align="left" className="cell">
            <FormattedMessage id="col.price.exit" />
          </TableCell>
        )}
        {type === "open" && (
          <TableCell align="left" className="cell">
            <FormattedMessage id="col.leverage" />
          </TableCell>
        )}
        {type === "open" && (
          <TableCell align="left" className="cell">
            <FormattedMessage id="col.price.current" />
          </TableCell>
        )}
        {["closed", "open"].includes(type) && (
          <>
            <TableCell align="left" className="cell">
              <FormattedMessage id="col.plnumber" />
            </TableCell>
            <TableCell align="left" className="cell">
              <FormattedMessage id="col.plpercentage" />
            </TableCell>
          </>
        )}
        <TableCell align="left" className="cell">
          <FormattedMessage id="col.side" />
        </TableCell>
        {["closed", "open"].includes(type) && (
          <TableCell align="left" className="cell">
            <FormattedMessage id="col.stoplossprice" />
          </TableCell>
        )}
        {["closed", "log"].includes(type) && (
          <TableCell align="left" className="cell">
            <FormattedMessage id="col.amount" />
          </TableCell>
        )}
        {type === "open" && (
          <TableCell align="left" className="cell">
            <FormattedMessage id="col.initialamount" />
          </TableCell>
        )}
        {["open", "log"].includes(type) && (
          <TableCell align="left" className="cell">
            <FormattedMessage id="col.remainingamount" />
          </TableCell>
        )}
        <TableCell align="left" className="cell">
          <FormattedMessage id="col.invested" />
        </TableCell>
        {["closed", "open"].includes(type) && (
          <>
            <TableCell align="center" className="cell">
              <FormattedMessage id="col.tsl" />
            </TableCell>
            <TableCell align="center" className="cell">
              <FormattedMessage id="col.tp" />
            </TableCell>
            <TableCell align="center" className="cell">
              <FormattedMessage id="col.dca" />
            </TableCell>
            <TableCell align="left" className="cell">
              <FormattedMessage id="col.risk" />
            </TableCell>
          </>
        )}
        {type === "open" && (
          <TableCell align="left" className="cell">
            <FormattedMessage id="col.age" />
          </TableCell>
        )}
        {["closed", "open"].includes(type) && (
          <TableCell align="left" className="cell">
            <FormattedMessage id="col.opentrigger" />
          </TableCell>
        )}
        {type === "closed" && (
          <>
            <TableCell align="left" className="cell">
              <FormattedMessage id="col.fees" />
            </TableCell>
            <TableCell align="left" className="cell">
              <FormattedMessage id="col.netprofit.percentage" />
            </TableCell>
            <TableCell align="left" className="cell">
              <FormattedMessage id="col.netprofit.amount" />
            </TableCell>
          </>
        )}
        <TableCell align="right" className="cell">
          <FormattedMessage id="col.actions" />
        </TableCell>
      </TableRow>
    </TableHead>
  );
};

export default PositionsTableHead;

import React from "react";
import { FormattedMessage } from "react-intl";
import "./ProvidersProfitsTableHead.scss";
import { TableHead, TableRow, TableCell } from "@material-ui/core";

/**
 * @typedef {import("../ProvidersProfitsTable").Column} Column
 */

/**
 *
 * @typedef {Object} DefaultProps
 * @property {Array<Column>} columns
 */

/**
 * Default component props.
 *
 * @param {DefaultProps} props
 */
const ProvidersProfitsTableHead = ({ columns }) => {
  return (
    <TableHead className="tableHead">
      <TableRow className="row">
        {columns.map((column) => (
          <TableCell align="left" className="cell">
            <FormattedMessage id={column.id} />
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};

export default ProvidersProfitsTableHead;

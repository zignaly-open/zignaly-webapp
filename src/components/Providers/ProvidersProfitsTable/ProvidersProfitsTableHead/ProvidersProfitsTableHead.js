import React from "react";
import { FormattedMessage } from "react-intl";
import "./ProvidersProfitsTableHead.scss";
import { TableHead, TableRow, TableCell } from "@material-ui/core";

const ProvidersProfitsTableHead = () => {
  return (
    <TableHead className="tableHead">
      <TableRow className="row">
        <TableCell align="left" className="cell">
          <FormattedMessage id="col.name" />
        </TableCell>
        <TableCell align="left" className="cell">
          <FormattedMessage id="col.protit-percentage" />
        </TableCell>
        <TableCell align="left" className="cell">
          <FormattedMessage id="col.totalsignals" />
        </TableCell>
        <TableCell align="left" className="cell">
          <FormattedMessage id="col.positions.total" />
        </TableCell>
        <TableCell align="left" className="cell">
          <FormattedMessage id="col.winrate" />
        </TableCell>
        <TableCell align="left" className="cell">
          <FormattedMessage id="col.position.closed" />
        </TableCell>
        <TableCell align="left" className="cell">
          <FormattedMessage id="col.averageclosing" />
        </TableCell>
        <TableCell align="left" className="cell">
          <FormattedMessage id="col.soldbysignal" />
        </TableCell>
        <TableCell align="left" className="cell">
          <FormattedMessage id="col.soldbystop" />
        </TableCell>
        <TableCell align="left" className="cell">
          <FormattedMessage id="col.soldbytake" />
        </TableCell>
      </TableRow>
    </TableHead>
  );
};

export default ProvidersProfitsTableHead;

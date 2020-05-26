import React from "react";
import "./ProvidersProfitsTableBody.scss";
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

const ProvidersProfitsTableBody = (props) => {
  const { stats } = props;
  console.log(stats);

  return (
    <TableBody className="tableBody">
      {stats.map((provider) => (
        <TableRow className="row" key={provider.providerId}>
          <TableCell align="left" className="cell">
            {provider.name}
          </TableCell>
          <TableCell align="left" className="cell">
            {parseFloat(provider.percentageProfit).toFixed(2)}
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

export default ProvidersProfitsTableBody;

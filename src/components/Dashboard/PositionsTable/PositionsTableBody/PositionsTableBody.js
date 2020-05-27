import React from "react";
import { Link } from "gatsby";
import "./PositionsTableBody.scss";
import { TableBody, TableRow, TableCell } from "@material-ui/core";
import { File } from "react-feather";

/**
 * @typedef {import("../../../../services/tradeApiClient.types").PositionEntity} PositionEntity
 */

/**
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

  /**
   * Compose provider icon column content.
   *
   * @param {PositionEntity} position Position entity to compose icon for.
   * @returns {JSX.Element} Provider icon JSX element.
   */
  const composeProviderIcon = (position) => {
    // Wrap with link to provider provile when available.
    if (position.providerLink) {
      return (
        <Link to={position.providerLink}>
          <img src={position.providerLogo} title={position.providerName} width="30px" />
        </Link>
      );
    }

    return (
      <>
        <img src={position.providerLogo} title={position.providerName} width="30px" />
      </>
    );
  };

  return (
    <TableBody className="tableBody">
      {positions.map((position) => (
        <TableRow className="row" key={position.positionId}>
          <TableCell align="left" className="cell">
            {position.paperTrading && <File />}
          </TableCell>
          <TableCell align="left" className="cell">
            {position.openDateReadable}
          </TableCell>
          <TableCell align="left" className="cell">
            {composeProviderIcon(position)}
          </TableCell>
          <TableCell align="left" className="cell">
            {position.providerName}
          </TableCell>
          <TableCell align="left" className="cell">
            {position.signalId}
          </TableCell>
          <TableCell align="left" className="cell">
            {position.pair}
          </TableCell>
          <TableCell align="left" className="cell">
            {position.buyPrice}
          </TableCell>
          <TableCell align="left" className="cell">
            {position.leverage}
          </TableCell>
          <TableCell align="left" className="cell">
            {position.sellPrice}
          </TableCell>
          <TableCell align="left" className="cell">
            {position.profit}
          </TableCell>
          <TableCell align="left" className="cell">
            {position.profitPercentage}
          </TableCell>
          <TableCell align="left" className="cell">
            {position.side}
          </TableCell>
          <TableCell align="left" className="cell">
            {position.stopLossPrice}
          </TableCell>
          <TableCell align="left" className="cell">
            {position.amount}
          </TableCell>
          <TableCell align="left" className="cell">
            {position.remainAmount}
          </TableCell>
          <TableCell align="left" className="cell">
            {position.positionSizeQuote}
          </TableCell>
          <TableCell align="left" className="cell">
            {position.trailingStopTriggerPercentage}
          </TableCell>
          <TableCell align="left" className="cell">
            {position.takeProfitTargetsCountSuccess}
          </TableCell>
          <TableCell align="left" className="cell">
            {position.reBuyTargetsCountFail}, {position.reBuyTargetsCountPending},{" "}
            {position.reBuyTargetsCountSuccess}
          </TableCell>
          <TableCell align="left" className="cell">
            "Calculate Risk"
          </TableCell>
          <TableCell align="left" className="cell">
            "Calculate Age"
          </TableCell>
          <TableCell align="left" className="cell">
            {position.openTrigger}
          </TableCell>
          <TableCell align="left" className="cell">
            "Edit"
          </TableCell>
          <TableCell align="left" className="cell">
            "Exit"
          </TableCell>
          <TableCell align="left" className="cell">
            "Cancel"
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  );
};

export default PositionsTableBody;

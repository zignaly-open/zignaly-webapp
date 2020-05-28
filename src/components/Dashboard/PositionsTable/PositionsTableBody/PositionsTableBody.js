import React from "react";
import { Link } from "gatsby";
import "./PositionsTableBody.scss";
import { TableBody, TableRow, TableCell } from "@material-ui/core";
import { Edit2, Eye, File, LogOut, TrendingUp, XCircle } from "react-feather";

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
            {position.status === 1 ? (
              <span>Still entering...</span>
            ) : (
              <span className={position.profitStyle}>{position.profit}</span>
            )}
          </TableCell>
          <TableCell align="left" className="cell">
            {position.status === 1 ? (
              <span>Still entering...</span>
            ) : (
              <span className={position.profitStyle}>{position.profitPercentage}</span>
            )}
          </TableCell>
          <TableCell align="left" className="cell">
            {position.side}
          </TableCell>
          <TableCell align="left" className="cell">
            <span className={position.stopLossStyle}>{position.stopLossPrice}</span>
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
            {position.trailingStopTriggerPercentage && <TrendingUp />}
          </TableCell>
          <TableCell align="left" className="cell">
            {position.takeProfitTargetsCountFail > 0 && (
              <span className="targetRed" title="Take profits failed.">
                {position.takeProfitTargetsCountFail}
              </span>
            )}
            {position.takeProfitTargetsCountSuccess > 0 && (
              <span className="targetGreen" title="Take profits successfully completed.">
                {position.takeProfitTargetsCountSuccess}
              </span>
            )}
            {position.takeProfitTargetsCountPending > 0 && (
              <span className="targetGray" title="Pending take profits.">
                {position.takeProfitTargetsCountPending}
              </span>
            )}
          </TableCell>
          <TableCell align="left" className="cell">
            {position.reBuyTargetsCountFail > 0 && (
              <span className="targetRed" title="DCAs failed.">
                {position.reBuyTargetsCountFail}
              </span>
            )}
            {position.reBuyTargetsCountSuccess > 0 && (
              <span className="targetGreen" title="DCAs successfully completed.">
                {position.reBuyTargetsCountSuccess}
              </span>
            )}
            {position.reBuyTargetsCountPending > 0 && (
              <span className="targetGray" title="Pending DCAs">
                {position.reBuyTargetsCountPending}
              </span>
            )}
          </TableCell>
          <TableCell align="left" className="cell">
            <span className={position.riskStyle}>{position.risk.toFixed(2)} %</span>
          </TableCell>
          <TableCell align="left" className="cell">
            {position.age}
          </TableCell>
          <TableCell align="left" className="cell">
            {position.openTrigger}
          </TableCell>
          <TableCell align="left" className="cell">
            {position.isCopyTrading ? <Eye /> : <Edit2 />}
          </TableCell>
          <TableCell align="left" className="cell">
            <LogOut />
          </TableCell>
          <TableCell align="left" className="cell">
            <XCircle />
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  );
};

export default PositionsTableBody;

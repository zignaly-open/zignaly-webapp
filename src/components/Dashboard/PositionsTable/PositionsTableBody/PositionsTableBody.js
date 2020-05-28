import React, { useState } from "react";
import { Link } from "gatsby";
import "./PositionsTableBody.scss";
import { TableBody, TableRow, TableCell } from "@material-ui/core";
import { Edit2, Eye, File, LogOut, TrendingUp, XCircle } from "react-feather";
import { colors } from "../../../../services/theme";
import { formatNumber } from "../../../../utils/formatters";
import { ConfirmDialog } from "../../../Dialogs";
import { useSelector } from "react-redux";
import tradeApi from "../../../../services/tradeApiClient";

/**
 * @typedef {import("../../../../services/tradeApiClient.types").PositionEntity} PositionEntity
 * @typedef {import("../PositionsTable").PositionsTableProps} PositionsTableProps
 * @typedef {import("../../../../store/initialState").DefaultState} DefaultStateType
 * @typedef {import("../../../../store/initialState").DefaultStateSession} StateSessionType
 */

/**
 * @typedef {Object} PositionTableBodyProps
 * @property {Array<PositionEntity>} positions
 * @property {PositionsTableProps["type"]} type
 */

/**
 * Display user positions table body rows.
 *
 * @param {PositionTableBodyProps} props Component properties.
 *
 * @return {JSX.Element} Position table body element.
 */
const PositionsTableBody = (props) => {
  /**
   * Select store session data.
   *
   * @param {DefaultStateType} state Application store data.
   * @returns {StateSessionType} Store session data.
   */
  const selectStoreSession = (state) => state.session;
  const storeSession = useSelector(selectStoreSession);
  const { positions, type } = props;

  /**
   * @typedef {import("../../../Dialogs/ConfirmDialog/ConfirmDialog").ConfirmDialogConfig} ConfirmDialogConfig
   * @type {ConfirmDialogConfig} initConfirmConfig
   */
  const initConfirmConfig = {
    titleTranslationId: "",
    messageTranslationId: "",
    visible: false,
  };

  const [confirmConfig, setConfirmConfig] = useState(initConfirmConfig);
  const [actionData, setActionData] = useState({
    positionId: "",
    action: "",
  });

  /**
   * Handle action element click event.
   *
   * @param {React.MouseEvent<HTMLButtonElement>} event Action element click.
   * @returns {Void} None.
   */
  const confirmAction = (event) => {
    const targetElement = event.currentTarget;
    const positionId = targetElement.getAttribute("data-position-id");
    const action = targetElement.getAttribute("data-action");
    setActionData({
      action: action || "",
      positionId: positionId || "",
    });

    if (action === "cancel") {
      setConfirmConfig({
        titleTranslationId: "confirm.positioncancel.title",
        messageTranslationId: "confirm.positioncancel.message",
        visible: true,
      });
    }

    if (action === "exit") {
      setConfirmConfig({
        titleTranslationId: "confirm.positionexit.title",
        messageTranslationId: "confirm.positionexit.message",
        visible: true,
      });
    }
  };

  /**
   * Handle confirm dialog post confirmation, action execution.
   *
   * @returns {Void} None.
   */
  const executeAction = () => {
    const { positionId, action } = actionData;
    if (action === "cancel") {
      tradeApi
        .positionClose({
          positionId: positionId,
          token: storeSession.tradeApi.accessToken,
        })
        .then((position) => {
          alert(`Position ${position.positionId} was cancelled.`);
        })
        .catch((e) => {
          alert(`Cancel position failed: ${e.message}`);
        });
    }

    if (action === "exit") {
      tradeApi
        .positionExit({
          positionId: positionId,
          token: storeSession.tradeApi.accessToken,
        })
        .then((position) => {
          alert(`Position ${position.positionId} was exited.`);
        })
        .catch((e) => {
          alert(`Exit position failed: ${e.message}`);
        });
    }
  };

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

  /**
   * Compose trailing stop icon for a given position.
   *
   * @param {PositionEntity} position Position entity to compose icon for.
   * @returns {JSX.Element|null} Provider icon JSX element.
   */
  const composeTrailingStopIcon = (position) => {
    const trailingStopColor = position.trailingStopTriggered ? colors.green : colors.darkGrey;
    if (position.trailingStopTriggerPercentage) {
      return <TrendingUp color={trailingStopColor} />;
    }

    return null;
  };

  return (
    <>
      <ConfirmDialog
        confirmConfig={confirmConfig}
        executeActionCallback={executeAction}
        setConfirmConfig={setConfirmConfig}
      />
      <TableBody className="tableBody">
        {positions.map((position) => (
          <TableRow className="row" key={position.positionId}>
            <TableCell align="left" className="cell">
              {position.paperTrading && <File color={colors.darkGrey} />}
            </TableCell>
            <TableCell align="left" className="cell">
              {position.openDateReadable}
            </TableCell>
            {type === "closed" && (
              <TableCell align="left" className="cell">
                {position.closeDateReadable}
              </TableCell>
            )}
            <TableCell align="left" className="cell">
              {composeProviderIcon(position)}
            </TableCell>
            <TableCell align="left" className="cell">
              {position.providerName}
            </TableCell>
            {["closed", "log"].includes(type) && (
              <TableCell align="left" className="cell">
                {position.statusDesc}
              </TableCell>
            )}
            <TableCell align="left" className="cell">
              {position.signalId}
            </TableCell>
            <TableCell align="left" className="cell">
              {position.pair}
            </TableCell>
            <TableCell align="left" className="cell">
              {position.buyPrice}
            </TableCell>
            {type === "open" && (
              <TableCell align="left" className="cell">
                {position.leverage}
              </TableCell>
            )}
            {["closed", "open"].includes(type) && (
              <>
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
              </>
            )}
            <TableCell align="left" className="cell">
              {position.side}
            </TableCell>
            {["closed", "open"].includes(type) && (
              <TableCell align="left" className="cell">
                <span className={position.stopLossStyle}>{position.stopLossPrice}</span>
              </TableCell>
            )}
            <TableCell align="left" className="cell">
              {position.amount}
            </TableCell>
            {["open", "log"].includes(type) && (
              <TableCell align="left" className="cell">
                {position.remainAmount}
              </TableCell>
            )}
            <TableCell align="left" className="cell">
              {position.positionSizeQuote}
            </TableCell>
            {["closed", "open"].includes(type) && (
              <>
                <TableCell align="left" className="cell">
                  {composeTrailingStopIcon(position)}
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
              </>
            )}
            {type === "open" && (
              <TableCell align="left" className="cell">
                {position.age}
              </TableCell>
            )}
            {["closed", "open"].includes(type) && (
              <TableCell align="left" className="cell">
                {position.openTrigger}
              </TableCell>
            )}
            {type === "closed" && (
              <>
                <TableCell align="left" className="cell">
                  {formatNumber(position.fees)}
                </TableCell>
                <TableCell align="left" className="cell">
                  {formatNumber(position.netProfitPercentage, 2)}
                </TableCell>
                <TableCell align="left" className="cell">
                  {formatNumber(position.netProfit)}
                </TableCell>
              </>
            )}
            <TableCell align="right" className="cell actions">
              {["closed", "log"].includes(type) && (
                <button title="view" type="button">
                  <Eye color={colors.purpleLight} />
                </button>
              )}
              {type === "open" && (
                <>
                  {position.isCopyTrading ? (
                    <button title="view" type="button">
                      <Eye color={colors.purpleLight} />
                    </button>
                  ) : (
                    <button title="edit" type="button">
                      <Edit2 color={colors.purpleLight} />
                    </button>
                  )}
                  <button
                    data-action={"exit"}
                    data-position-id={position.positionId}
                    onClick={confirmAction}
                    title="exit"
                    type="button"
                  >
                    <LogOut color={colors.purpleLight} />
                  </button>
                  <button
                    data-action={"cancel"}
                    data-position-id={position.positionId}
                    onClick={confirmAction}
                    title="cancel"
                    type="button"
                  >
                    <XCircle color={colors.purpleLight} />
                  </button>
                </>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </>
  );
};

export default PositionsTableBody;

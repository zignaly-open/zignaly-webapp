import React from "react";
import { findIndex, merge } from "lodash";
import { Link } from "gatsby";
import {
  Edit2,
  ExternalLink,
  Eye,
  LogOut,
  TrendingUp,
  Delete,
  AlertTriangle,
  RotateCw,
} from "react-feather";
import { formatNumber, formatPrice } from "./formatters";
import { colors } from "../services/theme";
import { FormattedMessage } from "react-intl";
import { IconButton } from "@material-ui/core";
import { Tooltip } from "@material-ui/core";
import { Box } from "@material-ui/core";
import { store } from "../store/store.js";

/**
 * @typedef {import("../services/tradeApiClient.types").UserPositionsCollection} UserPositionsCollection
 * @typedef {import("../services/tradeApiClient.types").PositionEntity} PositionEntity
 * @typedef {import("../services/tradeApiClient.types").ExchangeOpenOrdersObject} ExchangeOpenOrdersObject
 * @typedef {import("../services/tradeApiClient.types").ExchangeContractsObject} ExchangeContractsObject
 *
 */

/**
 * @typedef {Object} DataTableDataColumns
 * @property {string} name
 * @property {string} label
 * @property {Object} options
 */

/**
 * @typedef {Array<JSX.Element|string|number>} DataTableDataRow
 */

/**
 * @typedef {Object} DataTableContent
 * @property {Array<DataTableDataColumns>} columns Columns configuration.
 * @property {Array<DataTableDataRow>} data Rows data (JSX elements).
 */

/**
 * Compose provider name element for a given position.
 *
 * @param {PositionEntity} position Position entity to compose name for.
 * @returns {JSX.Element} Composed JSX element.
 */
function composeProviderName(position) {
  // Wrap with link to provider profile when available.
  if (position.providerLink) {
    return (
      <Link className="name" to={position.providerLink}>
        {position.providerName}
      </Link>
    );
  }

  return <>{position.providerName}</>;
}

/**
 * Compose translated status message from status ID.
 *
 * @param {number} statusCode Position status code.
 * @returns {JSX.Element} Formatted message element.
 */
function composeStatusMessage(statusCode) {
  const statusTranslationId = `status.${statusCode}`;
  const statusLink = `https://docs.zignaly.com/configuration/positions-statuses#${statusCode}`;

  return (
    <Box alignItems="center" display="flex">
      <FormattedMessage id={statusTranslationId} />
      <a className="externalLink" href={statusLink} rel="noreferrer" target="_blank">
        <ExternalLink color={colors.purpleLight} />
      </a>
    </Box>
  );
}

/**
 * Compose trailing stop icon element for a given position.
 *
 * @param {PositionEntity} position Position entity to compose icon for.
 * @returns {JSX.Element|null} Composed JSX element or null.
 */
function composeTrailingStopIcon(position) {
  const trailingStopColor = position.trailingStopTriggered ? colors.green : colors.darkGrey;
  if (position.trailingStopTriggerPercentage) {
    return <TrendingUp color={trailingStopColor} />;
  }

  return null;
}

/**
 * Compose amount element for a given position.
 *
 * @param {PositionEntity} position Position entity to compose amount for.
 * @returns {JSX.Element} Composed JSX element.
 */
function composeAmount(position) {
  return (
    <>
      <span className="symbol">{position.base}</span>
      {formatPrice(position.amount)}
    </>
  );
}

/**
 * Compose leverage element for a given position.
 *
 * @param {PositionEntity} position Position entity to compose leverage for.
 * @returns {JSX.Element} Composed JSX element.
 */
function composeLeverage(position) {
  return (
    <>
      {position.leverage}
      <span className="symbol">X</span>
    </>
  );
}

/**
 * Compose position quote size for a given position.
 *
 * @param {PositionEntity} position Position entity to compose quote size for.
 * @returns {JSX.Element} Composed JSX element.
 */
function composeQuoteSize(position) {
  return (
    <>
      <span className="symbol">{position.quote}</span> {formatPrice(position.positionSizeQuote)}
    </>
  );
}

/**
 * Compose entry price element for a given position.
 *
 * @param {PositionEntity} position Position entity to compose entry price for.
 * @returns {JSX.Element} Composed JSX element.
 */
function composeEntryPrice(position) {
  return (
    <>
      <span className="symbol">{position.quote}</span> {formatPrice(position.buyPrice)}
    </>
  );
}

/**
 * Compose exit price element for a given position.
 *
 * @param {PositionEntity} position Position entity to compose exit price for.
 * @returns {JSX.Element} Composed JSX element.
 */
function composeExitPrice(position) {
  return (
    <>
      <span className="symbol">{position.quote}</span>
      <span className={position.exitPriceStyle}>{formatPrice(position.sellPrice)}</span>
    </>
  );
}

/**
 * Compose profit amount element for a given position.
 *
 * @param {PositionEntity} position Position entity to compose profit for.
 * @returns {JSX.Element} Composed JSX element.
 */
function composeProfit(position) {
  return (
    <>
      {position.status === 1 ? (
        <span>Still entering...</span>
      ) : (
        <>
          <span className="symbol">{position.quote}</span>
          <span className={position.profitStyle}>{formatPrice(position.profit)}</span>
        </>
      )}
    </>
  );
}

/**
 * Compose profit percentage element for a given position.
 *
 * @param {PositionEntity} position Position entity to compose profit for.
 * @returns {JSX.Element} Composed JSX element.
 */
function composeProfitPercentage(position) {
  return (
    <>
      {position.status === 1 ? (
        <span>Still entering...</span>
      ) : (
        <span className={position.profitStyle}>{formatNumber(position.profitPercentage, 2)} %</span>
      )}
    </>
  );
}

/**
 * Compose stop loss price element for a given position.
 *
 * @param {PositionEntity} position Position entity to compose stop loss price for.
 * @returns {JSX.Element} Composed JSX element.
 */
function composeStopLossPrice(position) {
  return (
    <>
      {!isNaN(position.stopLossPrice) && <span className="symbol">{position.quote}</span>}
      <span className={position.stopLossStyle}>{formatPrice(position.stopLossPrice)}</span>
    </>
  );
}

/**
 * Compose risk percentage element for a given position.
 *
 * @param {PositionEntity} position Position entity to compose risk for.
 * @returns {JSX.Element} Composed JSX element.
 */
function composeRisk(position) {
  return (
    <>
      <span className={position.riskStyle}>{formatNumber(position.risk, 2)} %</span>
    </>
  );
}

/**
 * Compose formatted price with currency symbol element.
 *
 * @param {string} symbol Currency symbol.
 * @param {number} price Price.
 * @returns {JSX.Element} Composed JSX element.
 */
function composeSymbolWithPrice(symbol, price) {
  return (
    <>
      <span className="symbol">{symbol}</span> {formatPrice(price)}
    </>
  );
}

/**
 * Compose take profit targets element for a given position.
 *
 * @param {PositionEntity} position Position entity to compose profit targets for.
 * @returns {JSX.Element} Composed JSX element.
 */
function composeTakeProfitTargets(position) {
  return (
    <>
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
    </>
  );
}

/**
 * Compose reBuy targets element for a given position.
 *
 * @param {PositionEntity} position Position entity to compose icon for.
 * @returns {JSX.Element} Composed JSX element.
 */
function composeRebuyTargets(position) {
  return (
    <>
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
    </>
  );
}

/**
 * Compose React fragment element for a given value.
 *
 * @param {string|number} value Value to wrap in fragment.
 * @returns {string|number} Composed JSX element.
 */
function composeRawValue(value) {
  return value ? value : "-";
}

/**
 * Checks if viewed page is a position edit view.
 *
 * @param {PositionEntity} position Position entity to check.
 * @returns {boolean} true if is edit view, false otherwise.
 */
function isEditView(position) {
  // When URL path contains positionID, indicates that is the edit view page.
  const currentPath = typeof window !== "undefined" ? window.location.pathname : "";
  return currentPath.includes(position.positionId);
}

/**
 * Compose all action buttons element for a given position.
 *
 * @param {PositionEntity} position Position entity to compose buttons for.
 * @param {React.MouseEventHandler} confirmActionHandler Confirm action event handler.
 * @returns {JSX.Element} Composed JSX element.
 */
export function composeAllActionButtons(position, confirmActionHandler) {
  const { isCopyTrading, isCopyTrader, closed, providerOwnerUserId, status, updating } = position;

  /**
   * @typedef {import("../store/initialState").DefaultState} DefaultStateType
   * @type {DefaultStateType}
   */
  // @ts-ignore
  const storeState = store.getState();
  const currentUserId = storeState.user ? storeState.user.userData.userId : "";
  const isProviderOwner = providerOwnerUserId === currentUserId;
  let updatingMessageId = "terminal.warning.updating";
  if (status > 9) {
    updatingMessageId = "terminal.warning.exiting";
  }

  let exitIconTitle = <FormattedMessage id="dashboard.positions.icon.exit" />;
  if (status > 9) {
    exitIconTitle = <FormattedMessage id="dashboard.positions.icon.exiting" />;
  }

  return (
    <div className="actions">
      {isCopyTrading && !isEditView(position) && !isCopyTrader && (
        <Tooltip
          arrow
          enterTouchDelay={50}
          placement="left-end"
          title={<FormattedMessage id="dashboard.positions.icon.view" />}
        >
          <Link to={`/position/${position.positionId}`}>
            <Eye />
          </Link>
        </Tooltip>
      )}
      {(!isCopyTrading || isCopyTrader) && !isEditView(position) && (
        <Tooltip
          arrow
          enterTouchDelay={50}
          placement="left-end"
          title={<FormattedMessage id="dashboard.positions.icon.edit" />}
        >
          <Link to={`/position/${position.positionId}`}>
            <Edit2 />
          </Link>
        </Tooltip>
      )}
      {(!isCopyTrading || isCopyTrader || isProviderOwner) && !closed && !updating && status !== 1 && (
        <Tooltip arrow enterTouchDelay={50} placement="left-end" title={exitIconTitle}>
          <div>
            <IconButton
              className="iconPurple"
              data-action={"exit"}
              data-position-id={position.positionId}
              disabled={status > 9}
              onClick={confirmActionHandler}
            >
              <LogOut />
            </IconButton>
          </div>
        </Tooltip>
      )}
      {(!isCopyTrading || isProviderOwner) && !updating && status === 1 && (
        <Tooltip
          arrow
          enterTouchDelay={50}
          placement="left-end"
          title={<FormattedMessage id="dashboard.positions.icon.abort" />}
        >
          <IconButton
            className="iconPurple"
            data-action={"abort"}
            data-position-id={position.positionId}
            onClick={confirmActionHandler}
          >
            <Delete />
          </IconButton>
        </Tooltip>
      )}
      {status === 0 && (
        <Tooltip
          arrow
          enterTouchDelay={50}
          placement="left-end"
          title={<FormattedMessage id="terminal.warning.error" />}
        >
          <AlertTriangle className="iconPurple" />
        </Tooltip>
      )}
      {updating && (
        <Tooltip
          arrow
          enterTouchDelay={50}
          placement="left-end"
          title={<FormattedMessage id={updatingMessageId} />}
        >
          <RotateCw className="iconPurple" />
        </Tooltip>
      )}
    </div>
  );
}

/**
 * Compose all action buttons element for a given position.
 *
 * @param {ExchangeOpenOrdersObject} order Position entity to compose buttons for.
 * @param {React.MouseEventHandler} confirmActionHandler Confirm action event handler.
 * @returns {JSX.Element} Composed JSX element.
 */
export function composeOrdersCancelActionButton(order, confirmActionHandler) {
  return (
    <div className="actions">
      {order.status === "open" && (
        <IconButton
          className="iconPurple"
          data-order-id={order.orderId}
          onClick={confirmActionHandler}
        >
          <Delete />
        </IconButton>
      )}
    </div>
  );
}

/**
 * Compose MUI Data Table default options for a column translation ID.
 *
 * @param {string} columnId Column ID.
 * @param {string} [columnName] Column name.
 * @returns {DataTableDataColumns} Column options.
 */
function composeColumnOptions(columnId, columnName = null) {
  const permanentColumnIds = ["col.paper", "col.stat", "col.type", "col.actions"];
  const defaultSortColumnId = "col.date.open";

  const columnOptions = {
    name: columnName ? columnName : columnId,
    label: columnId,
    options: {
      viewColumns: !permanentColumnIds.includes(columnId),
    },
  };

  // Override defaults on default sort column.
  if (columnId === defaultSortColumnId) {
    return merge(columnOptions, {
      options: { sort: true },
    });
  }

  return columnOptions;
}

/**
 * Exclude data table column display.
 *
 * @export
 * @param {DataTableContent} dataTable Data table structure.
 * @param {string} columnId ID of the column to remove.
 *
 * @returns {DataTableContent} Data table without removed column.
 */
export function excludeDataTableColumn(dataTable, columnId) {
  const columnIndex = findIndex(dataTable.columns, { name: columnId });
  const { columns, data } = dataTable;

  // Remove column when exists.
  if (columnIndex > -1) {
    columns[columnIndex].options = {
      viewColumns: false,
      display: "excluded",
    };

    return {
      columns: columns,
      data: data,
    };
  }

  return dataTable;
}

/**
 * Compose MUI Data Table row for open position entity.
 *
 * @param {PositionEntity} position Position entity to compose data table row for.
 * @param {React.MouseEventHandler} confirmActionHandler Confirm action event handler.
 * @returns {DataTableDataRow} Row data array.
 */
function composeManagementPositionRow(position, confirmActionHandler) {
  return [
    composeRawValue(position.subPositions),
    composeRawValue(position.openDateReadable),
    composeRawValue(position.providerName),
    composeRawValue(position.copyTradingTotals.totalPositions),
    composeRawValue(position.copyTradingTotals.soldPositions),
    composeStatusMessage(position.status),
    composeRawValue(position.signalId),
    composeRawValue(position.userId),
    composeRawValue(position.pair),
    composeEntryPrice(position),
    composeLeverage(position),
    composeExitPrice(position),
    composeProfit(position),
    composeProfitPercentage(position),
    composeRawValue(position.side),
    composeStopLossPrice(position),
    composeAmount(position),
    composeSymbolWithPrice(position.base, position.remainAmount),
    composeQuoteSize(position),
    composeTrailingStopIcon(position),
    composeTakeProfitTargets(position),
    composeRebuyTargets(position),
    composeRisk(position),
    composeRawValue(position.age),
    composeAllActionButtons(position, confirmActionHandler),
  ];
}

/**
 * Compose MUI Data Table data structure from positions entities collection.
 *
 * @export
 * @param {Array<PositionEntity>} positions Positions collection.
 * @param {React.MouseEventHandler} confirmActionHandler Confirm action event handler.
 *
 * @returns {DataTableContent} Open positions data table structure.
 */
export function composeManagementPositionsDataTable(positions, confirmActionHandler) {
  const configColumns = [
    ["col.provider.subpositions", "subPositions"],
    ["col.date.open", "openDateReadable"],
    ["col.provider.name", "providerName"],
    ["col.provider.totalpositions", "copyTradingTotals.totalPositions"],
    ["col.provider.soldpositions", "copyTradingTogals.soldPositions"],
    ["col.status", "status"],
    ["col.signalid", "signalId"],
    ["col.users.userid", "userId"],
    ["col.pair", "pair"],
    ["col.price.entry", "buyPrice"],
    ["col.leverage", "leverage"],
    ["col.price.current", "sellPrice"],
    ["col.plnumber", "profit"],
    ["col.plpercentage", "profitPercentage"],
    ["col.side", "side"],
    ["col.stoplossprice", "stopLossPrice"],
    ["col.initialamount", "amount"],
    ["col.remainingamount", "remainAmount"],
    ["col.invested", "positionSizeQuote"],
    ["col.tsl", "trailingStopTriggered"],
    ["col.tp", "takeProfitTargetsCountPending"],
    ["col.dca", "reBuyTargetsCountPending"],
    ["col.risk", "risk"],
    ["col.age", "ageSeconds"],
    ["col.actions", "updating"],
  ];

  return {
    columns: configColumns.map((configColumn) =>
      composeColumnOptions(configColumn[0], configColumn[1]),
    ),
    data: positions.map((position) => composeManagementPositionRow(position, confirmActionHandler)),
  };
}

/**
 * Compose all action buttons element for a given position.
 *
 * @param {String} positionId Position entity to compose buttons for.
 * @returns {JSX.Element} Composed JSX element.
 */
function composePositionLinkButton(positionId) {
  return <Link to={`/position/${positionId}`}>{positionId}</Link>;
}

/**
 * Compose MUI Data Table row for profile open position entity.
 *
 * @param {ExchangeOpenOrdersObject} order Position entity to compose data table row for.
 * @param {React.MouseEventHandler} confirmActionHandler Confirm action event handler.
 * @returns {DataTableDataRow} Row data array.
 */
function composeOpenOrdersRow(order, confirmActionHandler) {
  return [
    composeRawValue(order.orderId),
    composePositionLinkButton(order.positionId),
    composeRawValue(order.symbol),
    composeRawValue(order.amount),
    composeRawValue(order.price),
    composeRawValue(order.side),
    composeRawValue(order.type),
    composeRawValue(order.datetimeReadable),
    composeOrdersCancelActionButton(order, confirmActionHandler),
  ];
}

/**
 * Compose MUI Data Table data structure from positions entities collection.
 *
 * @export
 * @param {Array<ExchangeOpenOrdersObject>} positions Positions collection.
 * @param {React.MouseEventHandler} confirmActionHandler Confirm action event handler.
 * @returns {DataTableContent} Open positions data table structure.
 */
export function composeOrdersDataTable(positions, confirmActionHandler) {
  const columnsIds = [
    ["col.orders.orderid"],
    ["col.positionid"],
    ["col.orders.symbol"],
    ["col.amount"],
    ["col.orders.price"],
    ["col.side"],
    ["col.orders.type"],
    ["col.orders.datetime"],
    ["col.cancel"],
  ];

  return {
    columns: columnsIds.map((column) => composeColumnOptions(column[0])),
    data: positions.map((order) => composeOpenOrdersRow(order, confirmActionHandler)),
  };
}

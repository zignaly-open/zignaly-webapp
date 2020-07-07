import React from "react";
import { findIndex, merge } from "lodash";
import { Link, navigate } from "gatsby";
import { Edit2, ExternalLink, Eye, Layers, LogOut, TrendingUp, XCircle } from "react-feather";
import { formatNumber, formatPrice } from "./formatters";
import { colors } from "../services/theme";
import { FormattedMessage } from "react-intl";
import defaultProviderLogo from "../images/defaultProviderLogo.png";
import { formatFloat } from "./format";
import { Box } from "@material-ui/core";

/**
 * @typedef {import("../services/tradeApiClient.types").UserPositionsCollection} UserPositionsCollection
 * @typedef {import("../services/tradeApiClient.types").PositionEntity} PositionEntity
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
 * Compose provider icon element for a given position.
 *
 * @param {PositionEntity} position Position entity to compose icon for.
 * @returns {JSX.Element} Composed JSX element.
 */
function composeProviderIcon(position) {
  // Wrap with link to provider profile when available.
  if (position.providerLink) {
    return (
      <Link to={position.providerLink}>
        <img src={position.providerLogo} title={position.providerName} width="30px" />
      </Link>
    );
  }

  return (
    <>
      <img src={defaultProviderLogo} title={position.providerName} width="30px" />
    </>
  );
}

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
 * Compose paper trading icon element for a given position.
 *
 * @param {PositionEntity} position Position entity to compose icon for.
 * @returns {JSX.Element|null} Composed JSX element or null.
 */
function composePaperTradingIcon(position) {
  if (position.paperTrading) {
    return <Layers color={colors.darkGrey} />;
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
 * Compose amount element for a given position.
 *
 * @param {string|number} value Position entity to compose amount for.
 * @returns {JSX.Element} Composed JSX element.
 */
function composeValue(value) {
  return <>{formatFloat(value)}</>;
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
 * Compose position quote size for a given position.
 *
 * @param {PositionEntity} position Position entity to compose quote size for.
 * @returns {JSX.Element} Composed JSX element.
 */
function composeRealInvestment(position) {
  return (
    <>
      <span className="symbol">{position.quote}</span> {formatPrice(position.realInvestment)}
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
 * Compose price difference element for a given position.
 *
 * @param {PositionEntity} position Position entity to compose price difference for.
 * @returns {JSX.Element} Composed JSX element.
 */
function composePriceDifference(position) {
  return (
    <>
      <span className={position.priceDifferenceStyle}>{formatPrice(position.priceDifference)}</span>
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
 * Compose net profit percentage element for a given position.
 *
 * @param {PositionEntity} position Position entity to compose net profit percentage for.
 * @returns {JSX.Element} Composed JSX element.
 */
function composeNetProfitPercentage(position) {
  return (
    <span className={position.netProfitStyle}>{formatNumber(position.netProfitPercentage, 2)}</span>
  );
}

/**
 * Compose net profit element for a given position.
 *
 * @param {PositionEntity} position Position entity to compose net profit for.
 * @returns {JSX.Element} Composed JSX element.
 */
function composeNetProfit(position) {
  return (
    <>
      <span className="symbol">{position.quote}</span>
      <span className={position.netProfitStyle}>{formatNumber(position.netProfit)}</span>
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
        <span className={position.profitStyle}>{formatNumber(position.profitPercentage, 2)}</span>
      )}
    </>
  );
}

/**
 * Compose profit amount element for a given position.
 *
 * @param {PositionEntity} position Position entity to compose profit for.
 * @returns {JSX.Element} Composed JSX element.
 */
function composeUnrealizedNetProfit(position) {
  return (
    <>
      {position.status === 1 ? (
        <span>Still entering...</span>
      ) : (
        <>
          <span className="symbol">{position.quote}</span>
          <span className={position.unrealizedProfitStyle}>
            {formatPrice(position.unrealizedProfitLosses)}
          </span>
        </>
      )}
    </>
  );
}

/**
 * Compose profit amount element for a given position.
 *
 * @param {PositionEntity} position Position entity to compose profit for.
 * @returns {JSX.Element} Composed JSX element.
 */
function composeUnrealizedProfitPercentage(position) {
  return (
    <>
      {position.status === 1 ? (
        <span>Still entering...</span>
      ) : (
        <>
          <span className="symbol">{position.quote}</span>
          <span className={position.unrealizedProfitStyle}>
            {formatPrice(position.unrealizedProfitLossesPercentage)}
          </span>
        </>
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
      <span className={position.riskStyle}>{position.risk.toFixed(2)} %</span>{" "}
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
 * Navigate to position detail page.
 *
 * @param {React.MouseEvent<HTMLButtonElement>} event Action element click.
 * @returns {Void} None.
 */
function gotoPositionDetail(event) {
  const targetElement = event.currentTarget;
  const positionId = targetElement.getAttribute("data-position-id");
  navigate(`position/${positionId}`);
}

/**
 * Compose all action buttons element for a given position.
 *
 * @param {PositionEntity} position Position entity to compose buttons for.
 * @param {React.MouseEventHandler} confirmActionHandler Confirm action event handler.
 * @returns {JSX.Element} Composed JSX element.
 */
function composeAllActionButtons(position, confirmActionHandler) {
  return (
    <div className="actions">
      {position.isCopyTrading ? (
        <button
          data-position-id={position.positionId}
          onClick={gotoPositionDetail}
          title="View Position"
          type="button"
        >
          <Eye color={colors.purpleLight} />
        </button>
      ) : (
        <button
          data-position-id={position.positionId}
          onClick={gotoPositionDetail}
          title="Edit Position"
          type="button"
        >
          <Edit2 color={colors.purpleLight} />
        </button>
      )}
      {!position.isCopyTrading && (
        <button
          data-action={"exit"}
          data-position-id={position.positionId}
          onClick={confirmActionHandler}
          title="Exit Position"
          type="button"
        >
          <LogOut color={colors.purpleLight} />
        </button>
      )}
    </div>
  );
}

/**
 * Compose delete action button element for a given position.
 *
 * @param {PositionEntity} position Position entity to compose buttons for.
 * @param {React.MouseEventHandler} confirmActionHandler Confirm action event handler.
 * @returns {JSX.Element} Composed JSX element.
 */
function composeCancelActionButton(position, confirmActionHandler) {
  return (
    <div className="actions">
      {position.updating && (
        <button
          data-action={"cancel"}
          data-position-id={position.positionId}
          onClick={confirmActionHandler}
          title="cancel"
          type="button"
        >
          <XCircle color={colors.purpleLight} />
        </button>
      )}
    </div>
  );
}

/**
 * Compose view action button element for a given position.
 *
 * @param {PositionEntity} position Position entity to compose buttons for.
 * @returns {JSX.Element} Composed JSX element.
 */
function composeViewActionButton(position) {
  return (
    <div className="actions">
      <button
        data-action={"view"}
        data-position-id={position.positionId}
        onClick={gotoPositionDetail}
        title="View Position"
        type="button"
      >
        <Eye color={colors.purpleLight} />
      </button>
    </div>
  );
}

/**
 * Compose MUI Data Table default options for a column translation ID.
 *
 * @param {string} columnId Column ID.
 * @returns {DataTableDataColumns} Column options.
 */
function composeColumnOptions(columnId) {
  const permanentColumnIds = ["col.paper", "col.stat", "col.type", "col.actions"];
  const defaultSortColumnId = "col.date.open";

  const columnOptions = {
    name: columnId,
    label: columnId,
    options: {
      viewColumns: !permanentColumnIds.includes(columnId),
    },
  };

  // Override defaults on default sort column.
  if (columnId === defaultSortColumnId) {
    return merge(columnOptions, {
      options: { sort: true, sortDirection: "desc" },
    });
  }

  return columnOptions;
}

/**
 * Compose MUI Data Table row for open position entity.
 *
 * @param {PositionEntity} position Position entity to compose data table row for.
 * @param {React.MouseEventHandler} confirmActionHandler Confirm action event handler.
 * @returns {DataTableDataRow} Row data array.
 */
function composeOpenPositionRow(position, confirmActionHandler) {
  return [
    composePaperTradingIcon(position),
    composeRawValue(position.openDateReadable),
    composeProviderIcon(position),
    composeProviderName(position),
    composeRawValue(position.signalId),
    composeRawValue(position.pair),
    composeEntryPrice(position),
    composeExitPrice(position),
    composeProfit(position),
    composeProfitPercentage(position),
    composePriceDifference(position),
    composeRawValue(position.side),
    composeStopLossPrice(position),
    composeAmount(position),
    composeSymbolWithPrice(position.base, position.remainAmount),
    composeQuoteSize(position),
    composeRealInvestment(position),
    composeRawValue(position.leverage),
    composeTrailingStopIcon(position),
    composeTakeProfitTargets(position),
    composeRebuyTargets(position),
    composeRisk(position),
    composeRawValue(position.age),
    composeRawValue(position.openTrigger),
    composeAllActionButtons(position, confirmActionHandler),
    composeCancelActionButton(position, confirmActionHandler),
  ];
}

/**
 * Compose MUI Data Table row for closed position entity.
 *
 * @param {PositionEntity} position Position entity to compose data table row for.
 * @returns {DataTableDataRow} Row data array.
 */
function composeClosePositionRow(position) {
  return [
    composePaperTradingIcon(position),
    composeRawValue(position.openDateReadable),
    composeRawValue(position.closeDateReadable),
    composeProviderIcon(position),
    composeProviderName(position),
    composeStatusMessage(position.status),
    composeRawValue(position.signalId),
    composeRawValue(position.pair),
    composeEntryPrice(position),
    composeExitPrice(position),
    composeProfit(position),
    composeProfitPercentage(position),
    composeRawValue(position.side),
    composeStopLossPrice(position),
    composeAmount(position),
    composeQuoteSize(position),
    composeRealInvestment(position),
    composeRawValue(position.leverage),
    composeTrailingStopIcon(position),
    composeTakeProfitTargets(position),
    composeRebuyTargets(position),
    composeSymbolWithPrice(position.quote, position.fees),
    composeNetProfitPercentage(position),
    composeNetProfit(position),
    composeViewActionButton(position),
  ];
}

/**
 * Compose MUI Data Table row for log position entity.
 *
 * @param {PositionEntity} position Position entity to compose data table row for.
 * @returns {DataTableDataRow} Row data array.
 */
function composeLogPositionRow(position) {
  return [
    composePaperTradingIcon(position),
    composeRawValue(position.openDateReadable),
    composeRawValue(position.type),
    composeProviderIcon(position),
    composeProviderName(position),
    composeStatusMessage(position.status),
    composeRawValue(position.signalId),
    composeRawValue(position.pair),
    composeEntryPrice(position),
    composeRawValue(position.side),
    composeAmount(position),
    composeSymbolWithPrice(position.base, position.remainAmount),
    composeQuoteSize(position),
    composeViewActionButton(position),
  ];
}

/**
 * Compose MUI Data Table row for closed position entity.
 *
 * @param {PositionEntity} position Position entity to compose data table row for.
 * @returns {DataTableDataRow} Row data array.
 */
function composeClosedPositionRowForProvider(position) {
  return [
    composeValue(position.amount),
    composeRawValue(position.pair),
    composeValue(position.buyPrice),
    composeRawValue(position.closeDateReadable),
    composeRawValue(position.exchange),
    composeRawValue(position.leverage),
    composeRawValue(position.openDateReadable),
    composeValue(position.positionSize),
    composeValue(position.returnFromAllocated),
    composeValue(position.returnFromInvestment),
    composeValue(position.sellPrice),
    composeRawValue(position.side),
    composeStatusMessage(position.status),
  ];
}

/**
 * Compose MUI Data Table data structure from positions entities collection.
 *
 * @export
 * @param {UserPositionsCollection} positions Positions collection.
 * @param {React.MouseEventHandler} confirmActionHandler Confirm action event handler.
 *
 * @returns {DataTableContent} Open positions data table structure.
 */
export function composeOpenPositionsDataTable(positions, confirmActionHandler) {
  const columnsIds = [
    "col.paper",
    "col.date.open",
    "col.provider.logo",
    "col.provider.name",
    "col.signalid",
    "col.pair",
    "col.price.entry",
    "col.price.current",
    "col.plnumber",
    "col.plpercentage",
    "col.pricedifference",
    "col.side",
    "col.stoplossprice",
    "col.initialamount",
    "col.remainingamount",
    "col.invested",
    "col.realinvestment",
    "col.leverage",
    "col.tsl",
    "col.tp",
    "col.dca",
    "col.risk",
    "col.age",
    "col.opentrigger",
    "col.actions",
    "col.cancel",
  ];

  return {
    columns: columnsIds.map(composeColumnOptions),
    data: positions.map((position) => composeOpenPositionRow(position, confirmActionHandler)),
  };
}

/**
 * Compose MUI Data Table data structure from positions entities collection.
 *
 * @export
 * @param {UserPositionsCollection} positions Positions collection.
 *
 * @returns {DataTableContent} Closed positions data table structure.
 */
export function composeClosePositionsDataTable(positions) {
  const columnsIds = [
    "col.paper",
    "col.date.open",
    "col.date.close",
    "col.provider.logo",
    "col.provider.name",
    "col.stat",
    "col.signalid",
    "col.pair",
    "col.price.entry",
    "col.price.exit",
    "col.plnumber",
    "col.plpercentage",
    "col.side",
    "col.stoplossprice",
    "col.amount",
    "col.invested",
    "col.realinvestment",
    "col.leverage",
    "col.tsl",
    "col.tp",
    "col.dca",
    "col.fees",
    "col.netprofit.percentage",
    "col.netprofit.amount",
    "col.actions",
  ];

  return {
    columns: columnsIds.map(composeColumnOptions),
    data: positions.map(composeClosePositionRow),
  };
}

/**
 * Compose MUI Data Table data structure from positions entities collection.
 *
 * @export
 * @param {UserPositionsCollection} positions Positions collection.
 *
 * @returns {DataTableContent} Log positions data table structure.
 */
export function composeLogPositionsDataTable(positions) {
  const columnsIds = [
    "col.paper",
    "col.date.open",
    "col.type",
    "col.provider.logo",
    "col.provider.name",
    "col.stat",
    "col.signalid",
    "col.pair",
    "col.price.entry",
    "col.side",
    "col.amount",
    "col.remainingamount",
    "col.invested",
    "col.actions",
  ];

  return {
    columns: columnsIds.map(composeColumnOptions),
    data: positions.map(composeLogPositionRow),
  };
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
    composeRawValue(position.providerName),
    composeRawValue(position.copyTradingTotals.totalPositions),
    composeRawValue(position.copyTradingTotals.soldPositions),
    composeRawValue(position.signalId),
    composeRawValue(position.userId),
    composeRawValue(position.pair),
    composeEntryPrice(position),
    composeRawValue(position.leverage),
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
    composeRawValue(position.openTrigger),
    composeAllActionButtons(position, confirmActionHandler),
    composeCancelActionButton(position, confirmActionHandler),
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
  const columnsIds = [
    "col.provider.subpositions",
    "col.provider.name",
    "col.provider.totalpositions",
    "col.provider.soldpositions",
    "col.signalid",
    "col.users.userid",
    "col.pair",
    "col.price.entry",
    "col.leverage",
    "col.price.current",
    "col.plnumber",
    "col.plpercentage",
    "col.side",
    "col.stoplossprice",
    "col.initialamount",
    "col.remainingamount",
    "col.invested",
    "col.tsl",
    "col.tp",
    "col.dca",
    "col.risk",
    "col.age",
    "col.opentrigger",
    "col.actions",
    "col.cancel",
  ];

  return {
    columns: columnsIds.map(composeColumnOptions),
    data: positions.map((position) => composeManagementPositionRow(position, confirmActionHandler)),
  };
}

/**
 * Compose MUI Data Table data structure from positions entities collection.
 *
 * @export
 * @param {UserPositionsCollection} positions Positions collection.
 *
 * @returns {DataTableContent} Closed positions data table structure.
 */
export function composeClosedPositionsForProvider(positions) {
  const columnsIds = [
    "col.amount",
    "col.pair",
    "col.buyprice",
    "col.date.close",
    "col.exchange",
    "col.leverage",
    "col.date.open",
    "col.positionsize",
    "col.returnfromallocated",
    "col.returnfrominvestment",
    "col.sellprice",
    "col.side",
    "col.status",
  ];

  return {
    columns: columnsIds.map(composeColumnOptions),
    data: positions.map(composeClosedPositionRowForProvider),
  };
}

/**
 * Compose MUI Data Table row for profile open position entity.
 *
 * @param {PositionEntity} position Position entity to compose data table row for.
 * @param {React.MouseEventHandler} confirmActionHandler Confirm action event handler.
 * @returns {DataTableDataRow} Row data array.
 */
function composeOpenPositionRowForProvider(position, confirmActionHandler) {
  return [
    composeRawValue(position.openDateReadable),
    composeRawValue(position.positionId),
    composeRawValue(position.signalId),
    composeStatusMessage(position.status),
    composeRawValue(position.pair),
    composeEntryPrice(position),
    composeRawValue(position.leverage),
    composeExitPrice(position),
    composeUnrealizedNetProfit(position),
    composeUnrealizedProfitPercentage(position),
    composeRawValue(position.priceDifference),
    composeRawValue(position.side),
    composeStopLossPrice(position),
    composeAmount(position),
    composeSymbolWithPrice(position.base, position.remainAmount),
    composeQuoteSize(position),
    composeRealInvestment(position),
    composeTrailingStopIcon(position),
    composeTakeProfitTargets(position),
    composeRebuyTargets(position),
    composeRisk(position),
    composeAllActionButtons(position, confirmActionHandler),
    composeCancelActionButton(position, confirmActionHandler),
  ];
}

/**
 * Compose MUI Data Table data structure from positions entities collection.
 *
 * @export
 * @param {UserPositionsCollection} positions Positions collection.
 * @param {React.MouseEventHandler} confirmActionHandler Confirm action event handler.
 *
 * @returns {DataTableContent} Open positions data table structure.
 */
export function composeOpenPositionsForProvider(positions, confirmActionHandler) {
  const columnsIds = [
    "col.date.open",
    "col.positionid",
    "col.signalid",
    "col.status",
    "col.pair",
    "col.price.entry",
    "col.leverage",
    "col.price.current",
    "col.unrealizedplnumber",
    "col.unrealizedplpercentage",
    "col.pricedifference",
    "col.side",
    "col.stoplossprice",
    "col.initialamount",
    "col.remainingamount",
    "col.invested",
    "col.realinvestment",
    "col.tsl",
    "col.tp",
    "col.dca",
    "col.risk",
    "col.actions",
    "col.cancel",
  ];

  return {
    columns: columnsIds.map(composeColumnOptions),
    data: positions.map((position) =>
      composeOpenPositionRowForProvider(position, confirmActionHandler),
    ),
  };
}

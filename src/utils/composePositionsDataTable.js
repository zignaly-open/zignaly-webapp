import React from "react";
import { Link } from "gatsby";
import { Edit2, Eye, Layers, LogOut, TrendingUp, XCircle } from "react-feather";
import { formatNumber, formatPrice } from "./formatters";
import { colors } from "../services/theme";
import { camelCase } from "lodash";

/**
 * @typedef {import("../services/tradeApiClient.types").UserPositionsCollection} UserPositionsCollection
 * @typedef {import("../services/tradeApiClient.types").PositionEntity} PositionEntity
 */

/**
 * Compose provider icon element for a given position.
 *
 * @param {PositionEntity} position Position entity to compose icon for.
 * @returns {JSX.Element} Composed JSX element.
 */
function composeProviderIcon(position) {
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
  return <>{formatPrice(position.amount)}</>;
}

/**
 * Compose position quote size for a given position.
 *
 * @param {PositionEntity} position Position entity to compose quote size for.
 * @returns {JSX.Element} Composed JSX element.
 */
function composeQuoteSize(position) {
  return <>{formatPrice(position.positionSizeQuote)}</>;
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
      <span className="symbol">{position.quote}</span> {formatPrice(position.sellPrice)}
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
  return <span className={position.netProfitStyle}>{formatNumber(position.netProfit)}</span>;
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
function composeProfitTargets(position) {
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
 * @returns {JSX.Element} Composed JSX element.
 */
function composeFragmentValue(value) {
  return <>{value}</>;
}

/**
 * Compose all action buttons element for a given position.
 *
 * @param {PositionEntity} position Position entity to compose buttons for.
 * @returns {JSX.Element} Composed JSX element.
 */
function composeAllActionButtons(position) {
  return (
    <>
      {position.isCopyTrading ? (
        <button data-position-id={position.positionId} title="view" type="button">
          <Eye color={colors.purpleLight} />
        </button>
      ) : (
        <button data-position-id={position.positionId} title="edit" type="button">
          <Edit2 color={colors.purpleLight} />
        </button>
      )}
      <button
        data-action={"exit"}
        data-position-id={position.positionId}
        title="exit"
        type="button"
      >
        <LogOut color={colors.purpleLight} />
      </button>
      <button
        data-action={"cancel"}
        data-position-id={position.positionId}
        title="cancel"
        type="button"
      >
        <XCircle color={colors.purpleLight} />
      </button>
    </>
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
    <button data-action={"view"} data-position-id={position.positionId} title="view" type="button">
      <Eye color={colors.purpleLight} />
    </button>
  );
}

/**
 * Compose MUI Data Table default options for a column translation ID.
 *
 * @param {string} columnId Column ID.
 * @returns {Object} Column options.
 */
function composeColumnDefaultOptions(columnId) {
  return {
    name: camelCase(columnId),
    label: columnId,
    options: {
      display: true,
      viewColumns: true,
    },
  };
}

/**
 * Compose MUI Data Table row for open position entity.
 *
 * @param {PositionEntity} position Position entity to compose data table row for.
 * @returns {Array<JSX.Element>} Row data array.
 */
function composeOpenPositionRow(position) {
  return [
    composePaperTradingIcon(position),
    composeFragmentValue(position.openDateReadable),
    composeProviderIcon(position),
    composeFragmentValue(position.providerName),
    composeFragmentValue(position.signalId),
    composeFragmentValue(position.pair),
    composeSymbolWithPrice(position.quote, position.buyPrice),
    composeFragmentValue(position.leverage),
    composeExitPrice(position),
    composeProfit(position),
    composeProfitPercentage(position),
    composeFragmentValue(position.side),
    composeStopLossPrice(position),
    composeSymbolWithPrice(position.base, position.amount),
    composeSymbolWithPrice(position.base, position.remainAmount),
    composeSymbolWithPrice(position.quote, position.positionSizeQuote),
    composeTrailingStopIcon(position),
    composeProfitTargets(position),
    composeRebuyTargets(position),
    composeRisk(position),
    composeFragmentValue(position.age),
    composeFragmentValue(position.openTrigger),
    composeAllActionButtons(position),
  ];
}

/**
 * Compose MUI Data Table row for closed position entity.
 *
 * @param {PositionEntity} position Position entity to compose data table row for.
 * @returns {Array<JSX.Element>} Row data array.
 */
function composeClosePositionRow(position) {
  return [
    composePaperTradingIcon(position),
    composeFragmentValue(position.closeDateReadable),
    composeProviderIcon(position),
    composeFragmentValue(position.providerName),
    composeFragmentValue(position.signalId),
    composeFragmentValue(position.pair),
    composeSymbolWithPrice(position.quote, position.buyPrice),
    composeSymbolWithPrice(position.quote, position.sellPrice),
    composeProfit(position),
    composeProfitPercentage(position),
    composeFragmentValue(position.side),
    composeStopLossPrice(position),
    composeAmount(position),
    composeQuoteSize(position),
    composeTrailingStopIcon(position),
    composeProfitTargets(position),
    composeRebuyTargets(position),
    composeRisk(position),
    composeFragmentValue(position.openTrigger),
    composeSymbolWithPrice(position.quote, position.fees),
    composeNetProfitPercentage(position),
    composeNetProfit(position),
    composeViewActionButton(position),
  ];
}

/**
 * Compose MUI Data Table data structure from positions entities collection.
 *
 * @export
 * @param {UserPositionsCollection} positions Positions collection.
 *
 * @returns {Object} Open positions data table structure.
 */
export function composeOpenPositionsDataTable(positions) {
  const columnsIds = [
    "col.paper",
    "col.date.open",
    "col.provider.logo",
    "col.provider.name",
    "col.signalid",
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
  ];

  return {
    columns: columnsIds.map(composeColumnDefaultOptions),
    data: positions.map(composeOpenPositionRow),
  };
}

/**
 * Compose MUI Data Table data structure from positions entities collection.
 *
 * @export
 * @param {UserPositionsCollection} positions Positions collection.
 *
 * @returns {Object} Closed positions data table structure.
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
    "col.tsl",
    "col.tp",
    "col.dca",
    "col.risk",
    "col.opentrigger",
    "col.fees",
    "col.netprofit.percentage",
    "col.netprofit.amount",
    "col.actions",
  ];

  return {
    columns: columnsIds.map(composeColumnDefaultOptions),
    data: positions.map(composeClosePositionRow),
  };
}

/**
 * Compose MUI Data Table data structure from positions entities collection.
 *
 * @export
 * @param {UserPositionsCollection} positions Positions collection.
 *
 * @returns {Object} Log positions data table structure.
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
    columns: columnsIds.map(composeColumnDefaultOptions),
    data: [],
  };
}

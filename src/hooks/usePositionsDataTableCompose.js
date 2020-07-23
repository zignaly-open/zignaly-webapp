import React from "react";
import { findIndex, isFunction, merge, partial } from "lodash";
import { Link, navigate } from "gatsby";
import {
  AlertTriangle,
  Delete,
  Edit2,
  ExternalLink,
  Eye,
  LogOut,
  TrendingUp,
  XCircle,
} from "react-feather";
import { formatNumber, formatPrice } from "../utils/formatters";
import { colors } from "../services/theme";
import { FormattedMessage } from "react-intl";
import defaultProviderLogo from "../images/defaultProviderLogo.png";
import { formatFloat } from "../utils/format";
import { CircularProgress } from "@material-ui/core";
import { Tooltip } from "@material-ui/core";
import { Box } from "@material-ui/core";

/**
 * @typedef {import("../services/tradeApiClient.types").UserPositionsCollection} UserPositionsCollection
 * @typedef {import("../services/tradeApiClient.types").PositionEntity} PositionEntity
 * @typedef {import("../services/tradeApiClient.types").ExchangeOpenOrdersObject} ExchangeOpenOrdersObject
 * @typedef {keyof PositionEntity} PositionEntityKeys
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
 * @property {UserPositionsCollection} data Positions entities collection.
 */

/**
 * @typedef {Object} PositionDataTableComposeHook
 * @property {function} composeClosePositionsDataTable
 * @property {function} composeClosedPositionsForProvider
 * @property {function} composeLogPositionsDataTable
 * @property {function} composeManagementPositionsDataTable
 * @property {function} composeOpenPositionsDataTable
 * @property {function} composeOpenPositionsForProvider
 * @property {function} excludeDataTableColumn
 */

/**
 * Compose positions MUI data table object.
 *
 * @param {UserPositionsCollection} positions Positions collection.
 * @param {React.MouseEventHandler} confirmActionHandler Confirm action event handler.
 * @returns {PositionDataTableComposeHook} Position data table compose hook.
 */
export function usePositionDataTableCompose(positions, confirmActionHandler) {
  /**
   * Compose provider icon element for a given position.
   *
   * @param {number} dataIndex Data entity index.
   * @returns {JSX.Element} Composed JSX element.
   */
  function renderProviderIcon(dataIndex) {
    const position = positions[dataIndex];
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
   * @param {number} dataIndex Data entity index.
   * @returns {JSX.Element} Composed JSX element.
   */
  function renderProviderName(dataIndex) {
    const position = positions[dataIndex];
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
   * @param {number} dataIndex Data entity index.
   * @returns {JSX.Element} Formatted message element.
   */
  function renderStatusMessage(dataIndex) {
    const position = positions[dataIndex];
    const statusCode = position.status;
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
   * @param {number} dataIndex Data entity index.
   * @returns {JSX.Element|null} Composed JSX element or null.
   */
  function renderTrailingStopIcon(dataIndex) {
    const position = positions[dataIndex];
    const trailingStopColor = position.trailingStopTriggered ? colors.green : colors.darkGrey;
    if (position.trailingStopTriggerPercentage) {
      return <TrendingUp color={trailingStopColor} />;
    }

    return null;
  }

  /**
   * Compose amount element for a given position.
   *
   * @param {number} dataIndex Data entity index.
   * @returns {JSX.Element} Composed JSX element.
   */
  function renderAmount(dataIndex) {
    const position = positions[dataIndex];
    return (
      <>
        <span className="symbol">{position.base}</span>
        {formatPrice(position.amount)}
      </>
    );
  }

  /**
   * Compose age element for a given position.
   *
   * @param {number} dataIndex Data entity index.
   * @returns {JSX.Element} Composed JSX element.
   */
  function renderAge(dataIndex) {
    const position = positions[dataIndex];
    return <>{position.age}</>;
  }

  /**
   * Compose leverage element for a given position.
   *
   * @param {number} dataIndex Data entity index.
   * @returns {JSX.Element} Composed JSX element.
   */
  function renderLeverage(dataIndex) {
    const position = positions[dataIndex];
    return (
      <>
        {position.leverage}
        <span className="symbol">X</span>
      </>
    );
  }

  /**
   * Compose amount element for a given position.
   *
   * @param {string|number} value Position entity to compose amount for.
   * @returns {JSX.Element} Composed JSX element.
   */
  function renderValue(value) {
    return <>{formatFloat(value)}</>;
  }

  /**
   * Compose position quote size for a given position.
   *
   * @param {number} dataIndex Data entity index.
   * @returns {JSX.Element} Composed JSX element.
   */
  function renderQuoteSize(dataIndex) {
    const position = positions[dataIndex];
    return (
      <>
        <span className="symbol">{position.quote}</span> {formatPrice(position.positionSizeQuote)}
      </>
    );
  }

  /**
   * Compose position size for a given position.
   *
   * @param {number} dataIndex Data entity index.
   * @returns {JSX.Element} Composed JSX element.
   */
  function renderPositionSize(dataIndex) {
    const position = positions[dataIndex];
    return (
      <>
        <span className="symbol">{position.quote}</span>{" "}
        {formatPrice(parseFloat(position.positionSize))}
      </>
    );
  }

  /**
   * Compose position quote size for a given position.
   *
   * @param {number} dataIndex Data entity index.
   * @returns {JSX.Element} Composed JSX element.
   */
  function renderRealInvestment(dataIndex) {
    const position = positions[dataIndex];
    return (
      <>
        <span className="symbol">{position.quote}</span> {formatPrice(position.realInvestment)}
      </>
    );
  }

  /**
   * Compose entry price element for a given position.
   *
   * @param {number} dataIndex Data entity index.
   * @returns {JSX.Element} Composed JSX element.
   */
  function renderEntryPrice(dataIndex) {
    const position = positions[dataIndex];
    return (
      <>
        <span className="symbol">{position.quote}</span> {formatPrice(position.buyPrice)}
      </>
    );
  }

  /**
   * Compose exit price element for a given position.
   *
   * @param {number} dataIndex Data entity index.
   * @returns {JSX.Element} Composed JSX element.
   */
  function renderExitPrice(dataIndex) {
    const position = positions[dataIndex];
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
   * @param {number} dataIndex Data entity index.
   * @returns {JSX.Element} Composed JSX element.
   */
  function renderPriceDifference(dataIndex) {
    const position = positions[dataIndex];
    return (
      <>
        <span className={position.priceDifferenceStyle}>
          {formatPrice(position.priceDifference)} %
        </span>
      </>
    );
  }

  /**
   * Compose returns from allocated element for a given position.
   *
   * @param {number} dataIndex Data entity index.
   * @returns {JSX.Element} Composed JSX element.
   */
  function renderReturnsFromAllocated(dataIndex) {
    const position = positions[dataIndex];
    return <>{formatPrice(position.returnFromAllocated)} %</>;
  }

  /**
   * Compose returns from investment element for a given position.
   *
   * @param {number} dataIndex Data entity index.
   * @returns {JSX.Element} Composed JSX element.
   */
  function renderReturnsFromInvestment(dataIndex) {
    const position = positions[dataIndex];
    return <>{formatPrice(position.returnFromInvestment)} %</>;
  }

  /**
   * Compose profit amount element for a given position.
   *
   * @param {number} dataIndex Data entity index.
   * @returns {JSX.Element} Composed JSX element.
   */
  function renderProfit(dataIndex) {
    const position = positions[dataIndex];
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
   * @param {number} dataIndex Data entity index.
   * @returns {JSX.Element} Composed JSX element.
   */
  function renderNetProfitPercentage(dataIndex) {
    const position = positions[dataIndex];
    return (
      <span className={position.netProfitStyle}>
        {formatNumber(position.netProfitPercentage, 2)} %
      </span>
    );
  }

  /**
   * Compose net profit element for a given position.
   *
   * @param {number} dataIndex Data entity index.
   * @returns {JSX.Element} Composed JSX element.
   */
  function renderNetProfit(dataIndex) {
    const position = positions[dataIndex];
    return (
      <>
        <span className="symbol">{position.quote}</span>
        <span className={position.netProfitStyle}>{formatPrice(position.netProfit)}</span>
      </>
    );
  }

  /**
   * Compose profit percentage element for a given position.
   *
   * @param {number} dataIndex Data entity index.
   * @returns {JSX.Element} Composed JSX element.
   */
  function renderProfitPercentage(dataIndex) {
    const position = positions[dataIndex];
    return (
      <>
        {position.status === 1 ? (
          <span>Still entering...</span>
        ) : (
          <span className={position.profitStyle}>
            {formatNumber(position.profitPercentage, 2)} %
          </span>
        )}
      </>
    );
  }

  /**
   * Compose profit amount element for a given position.
   *
   * @param {number} dataIndex Data entity index.
   * @returns {JSX.Element} Composed JSX element.
   */
  function renderUnrealizedNetProfit(dataIndex) {
    const position = positions[dataIndex];
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
   * @param {number} dataIndex Data entity index.
   * @returns {JSX.Element} Composed JSX element.
   */
  function renderUnrealizedProfitPercentage(dataIndex) {
    const position = positions[dataIndex];
    return (
      <>
        {position.status === 1 ? (
          <span>Still entering...</span>
        ) : (
          <>
            <span className="symbol">{position.quote}</span>
            <span className={position.unrealizedProfitStyle}>
              {formatPrice(position.unrealizedProfitLossesPercentage)} %
            </span>
          </>
        )}
      </>
    );
  }

  /**
   * Compose stop loss price element for a given position.
   *
   * @param {number} dataIndex Data entity index.
   * @returns {JSX.Element} Composed JSX element.
   */
  function renderStopLossPrice(dataIndex) {
    const position = positions[dataIndex];
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
   * @param {number} dataIndex Data entity index.
   * @returns {JSX.Element} Composed JSX element.
   */
  function renderRisk(dataIndex) {
    const position = positions[dataIndex];
    return (
      <>
        <span className={position.riskStyle}>{position.risk.toFixed(2)} %</span>{" "}
      </>
    );
  }

  /**
   * Compose formatted price with currency symbol element.
   *
   * @param {PositionEntityKeys} propertyName Position entity property to retrieve the price to display.
   * @param {number} dataIndex Data entity index.
   * @returns {JSX.Element} Composed JSX element.
   */
  function renderBaseSymbolWithPrice(propertyName, dataIndex) {
    const position = positions[dataIndex];
    const price = /** @type {number} */ (position[propertyName] || 0);

    return (
      <>
        <span className="symbol">{position.base}</span> {formatPrice(price)}
      </>
    );
  }

  /**
   * Compose take profit targets element for a given position.
   *
   * @param {number} dataIndex Data entity index.
   * @returns {JSX.Element} Composed JSX element.
   */
  function renderTakeProfitTargets(dataIndex) {
    const position = positions[dataIndex];
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
   * @param {number} dataIndex Data entity index.
   * @returns {JSX.Element} Composed JSX element.
   */
  function renderRebuyTargets(dataIndex) {
    const position = positions[dataIndex];
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
  function renderRawValue(value) {
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
   * @param {number} dataIndex Data entity index.
   * @returns {JSX.Element} Composed JSX element.
   */
  function renderAllActionButtons(dataIndex) {
    const position = positions[dataIndex];
    const { isCopyTrading, isCopyTrader, closed, status, updating } = position;

    return (
      <div className="actions">
        {isCopyTrading && !isEditView(position) && !isCopyTrader && (
          <button
            data-position-id={position.positionId}
            onClick={gotoPositionDetail}
            title="View Position"
            type="button"
          >
            <Eye color={colors.purpleLight} />
          </button>
        )}
        {(!isCopyTrading || isCopyTrader) && !isEditView(position) && (
          <button
            data-position-id={position.positionId}
            onClick={gotoPositionDetail}
            title="Edit Position"
            type="button"
          >
            <Edit2 color={colors.purpleLight} />
          </button>
        )}
        {(!isCopyTrading || isCopyTrader) && !closed && !updating && (
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
        {status === 1 && (
          <button
            data-action={"abort"}
            data-position-id={position.positionId}
            onClick={confirmActionHandler}
            title="cancel entry"
            type="button"
          >
            <Delete color={colors.purpleLight} />
          </button>
        )}
        {status === 0 && (
          <Tooltip
            arrow
            enterTouchDelay={50}
            placement="left-end"
            title={<FormattedMessage id="terminal.warning.error" />}
          >
            <AlertTriangle color={colors.purpleLight} />
          </Tooltip>
        )}
        {status > 9 && (
          <Tooltip
            arrow
            enterTouchDelay={50}
            placement="left-end"
            title={<FormattedMessage id="terminal.warning.exiting" />}
          >
            <AlertTriangle color={colors.purpleLight} />
          </Tooltip>
        )}
        {updating && (
          <Tooltip
            arrow
            enterTouchDelay={50}
            placement="left-end"
            title={<FormattedMessage id="terminal.warning.updating" />}
          >
            <CircularProgress color="primary" size={22} />
          </Tooltip>
        )}
      </div>
    );
  }

  /**
   * Compose all action buttons element for a given position.
   *
   * @param {number} dataIndex Data entity index.
   * @returns {JSX.Element} Composed JSX element.
   */
  function renderManagementActionButtons(dataIndex) {
    const position = positions[dataIndex];
    const { isCopyTrading, isCopyTrader, closed } = position;

    return (
      <div className="actions">
        {!position.closed ? (
          <button
            data-position-id={position.positionId}
            onClick={gotoPositionDetail}
            title="Edit Position"
            type="button"
          >
            <Edit2 color={colors.purpleLight} />
          </button>
        ) : (
          <button
            data-position-id={position.positionId}
            onClick={gotoPositionDetail}
            title="View Position"
            type="button"
          >
            <Eye color={colors.purpleLight} />
          </button>
        )}
        {(!isCopyTrading || isCopyTrader) && !closed && (
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
   * @param {number} dataIndex Data entity index.
   * @returns {JSX.Element} Composed JSX element.
   */
  function renderCancelActionButton(dataIndex) {
    const position = positions[dataIndex];
    const { exchange, positionId, updating } = position;
    const isZignaly = exchange.toLowerCase() === "zignaly";

    return (
      <div className="actions">
        {updating && !isZignaly && (
          <button
            data-action={"cancel"}
            data-position-id={positionId}
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
   * @param {number} dataIndex Data entity index.
   * @returns {JSX.Element} Composed JSX element.
   */
  function renderViewActionButton(dataIndex) {
    const position = positions[dataIndex];
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
   * @typedef {Object} RawColumnOptions
   * @property {string} columnId Column ID.
   * @property {string} propertyName Property name from data entity to user as column value.
   * @property {function} [renderFunction] Column rich markup render function.
   */

  /**
   * Compose MUI Data Table default options for a column translation ID.
   *
   * @param {RawColumnOptions} columnOptions Single column options.
   * @returns {DataTableDataColumns} Composed data table column options.
   */
  function composeColumnOptions(columnOptions) {
    const { columnId, propertyName, renderFunction = null } = columnOptions;
    const permanentColumnIds = ["col.paper", "col.stat", "col.type", "col.actions"];
    const defaultSortColumnId = "col.date.open";
    let allOptions = {
      name: propertyName,
      label: columnId,
      options: {
        viewColumns: !permanentColumnIds.includes(columnId),
      },
    };

    if (isFunction(renderFunction)) {
      allOptions = merge(allOptions, {
        options: {
          customBodyRenderLite: renderFunction,
        },
      });
    }

    // Override defaults on default sort column.
    if (columnId === defaultSortColumnId) {
      allOptions = merge(allOptions, {
        options: { sort: true, sortDirection: "desc" },
      });
    }

    return allOptions;
  }

  /**
   * Compose MUI Data Table data structure from positions entities collection.
   *
   * @returns {DataTableContent} Open positions data table structure.
   */
  function composeOpenPositionsDataTable() {
    const configColumns = [
      {
        columnId: "col.date.open",
        propertyName: "openDateReadable",
        renderFunction: null,
      },
      {
        columnId: "col.provider.logo",
        propertyName: "providerLogo",
        renderFunction: renderProviderIcon,
      },
      {
        columnId: "col.provider.name",
        propertyName: "providerName",
        renderFunction: renderProviderName,
      },
      { columnId: "col.signalid", propertyName: "signalId", renderFunction: null },
      { columnId: "col.pair", propertyName: "pair", renderFunction: null },
      { columnId: "col.price.entry", propertyName: "buyPrice", renderFunction: renderEntryPrice },
      {
        columnId: "col.price.current",
        propertyName: "sellPrice",
        renderFunction: renderExitPrice,
      },
      { columnId: "col.plnumber", propertyName: "profit", renderFunction: renderProfit },
      {
        columnId: "col.plpercentage",
        propertyName: "profitPercentage",
        renderFunction: renderProfitPercentage,
      },
      {
        columnId: "col.pricedifference",
        propertyName: "priceDifference",
        renderFunction: renderPriceDifference,
      },
      { columnId: "col.side", propertyName: "side", renderFunction: null },
      {
        columnId: "col.stoplossprice",
        propertyName: "stopLossPrice",
        renderFunction: renderStopLossPrice,
      },
      { columnId: "col.initialamount", propertyName: "amount", renderFunction: renderAmount },
      {
        columnId: "col.remainingamount",
        propertyName: "remainAmount",
        renderFunction: partial(renderBaseSymbolWithPrice, "remainAmount"),
      },
      {
        columnId: "col.invested",
        propertyName: "positionSizeQuote",
        renderFunction: renderQuoteSize,
      },
      {
        columnId: "col.realinvestment",
        propertyName: "realInvestment",
        renderFunction: renderRealInvestment,
      },
      { columnId: "col.leverage", propertyName: "leverage", renderFunction: renderLeverage },
      {
        columnId: "col.tsl",
        propertyName: "trailingStopTriggered",
        renderFunction: renderTrailingStopIcon,
      },
      {
        columnId: "col.tp",
        propertyName: "takeProfitTargetsCountPending",
        renderFunction: renderTakeProfitTargets,
      },
      {
        columnId: "col.dca",
        propertyName: "reBuyTargetsCountPending",
        renderFunction: renderRebuyTargets,
      },
      { columnId: "col.risk", propertyName: "risk", renderFunction: renderRisk },
      { columnId: "col.age", propertyName: "ageSeconds", renderFunction: renderAge },
      {
        columnId: "col.actions",
        propertyName: "updating",
        renderFunction: renderAllActionButtons,
      },
      { columnId: "col.cancel", propertyName: "status", renderFunction: renderCancelActionButton },
    ];

    const dataTable = {
      columns: configColumns.map(composeColumnOptions),
      data: positions,
    };

    return dataTable;
  }

  /**
   * Compose MUI Data Table data structure from positions entities collection.
   *
   * @returns {DataTableContent} Closed positions data table structure.
   */
  function composeClosePositionsDataTable() {
    const columnsIds = [
      { columnId: "col.date.open", propertyName: "openDateReadable", renderFunction: null },
      { columnId: "col.date.close", propertyName: "closeDateReadable", renderFunction: null },
      {
        columnId: "col.provider.logo",
        propertyName: "providerLogo",
        renderFunction: renderProviderIcon,
      },
      {
        columnId: "col.provider.name",
        propertyName: "providerName",
        renderFunction: renderProviderName,
      },
      { columnId: "col.stat", propertyName: "status", renderFunction: renderStatusMessage },
      { columnId: "col.signalid", propertyName: "signalId", renderFunction: null },
      { columnId: "col.pair", propertyName: "pair", renderFunction: null },
      { columnId: "col.price.entry", propertyName: "buyPrice", renderFunction: renderEntryPrice },
      { columnId: "col.price.exit", propertyName: "sellPrice", renderFunction: renderExitPrice },
      { columnId: "col.plnumber", propertyName: "profit", renderFunction: renderProfit },
      {
        columnId: "col.plpercentage",
        propertyName: "profitPercentage",
        renderFunction: renderProfitPercentage,
      },
      { columnId: "col.side", propertyName: "side", renderFunction: null },
      {
        columnId: "col.stoplossprice",
        propertyName: "stopLossPrice",
        renderFunction: renderStopLossPrice,
      },
      { columnId: "col.amount", propertyName: "remainAmount", renderFunction: renderAmount },
      {
        columnId: "col.invested",
        propertyName: "positionSizeQuote",
        renderFunction: renderQuoteSize,
      },
      {
        columnId: "col.realinvestment",
        propertyName: "realInvestment",
        renderFunction: renderRealInvestment,
      },
      { columnId: "col.leverage", propertyName: "leverage", renderFunction: renderLeverage },
      {
        columnId: "col.tsl",
        propertyName: "trailingStopTriggered",
        renderFunction: renderTrailingStopIcon,
      },
      {
        columnId: "col.tp",
        propertyName: "takeProfitTargetsCountPending",
        renderFunction: renderTakeProfitTargets,
      },
      {
        columnId: "col.dca",
        propertyName: "reBuyTargetsCountPending",
        renderFunction: renderRebuyTargets,
      },
      { columnId: "col.fees", propertyName: "fees", renderFunction: null },
      {
        columnId: "col.netprofit.percentage",
        propertyName: "netProfitPercentage",
        renderFunction: renderNetProfitPercentage,
      },
      {
        columnId: "col.netprofit.amount",
        propertyName: "netProfit",
        renderFunction: renderNetProfit,
      },
      {
        columnId: "col.actions",
        propertyName: "updating",
        renderFunction: renderViewActionButton,
      },
    ];

    return {
      columns: columnsIds.map(composeColumnOptions),
      data: positions,
    };
  }

  /**
   * Compose MUI Data Table data structure from positions entities collection.
   *
   * @returns {DataTableContent} Log positions data table structure.
   */
  function composeLogPositionsDataTable() {
    const columnsIds = [
      { columnId: "col.date.open", propertyName: "openDateReadable", renderFunction: null },
      { columnId: "col.type", propertyName: "type", renderFunction: null },
      {
        columnId: "col.provider.logo",
        propertyName: "providerLogo",
        renderFunction: renderProviderIcon,
      },
      {
        columnId: "col.provider.name",
        propertyName: "providerName",
        renderFunction: renderProviderName,
      },
      { columnId: "col.stat", propertyName: "status", renderFunction: renderStatusMessage },
      { columnId: "col.signalid", propertyName: "signalId", renderFunction: null },
      { columnId: "col.pair", propertyName: "pair", renderFunction: null },
      { columnId: "col.price.entry", propertyName: "buyPrice", renderFunction: renderEntryPrice },
      { columnId: "col.side", propertyName: "side", renderFunction: null },
      { columnId: "col.amount", propertyName: "amount", renderFunction: renderAmount },
      {
        columnId: "col.remainingamount",
        propertyName: "remainAmount",
        renderFunction: partial(renderBaseSymbolWithPrice, "remainAmount"),
      },
      {
        columnId: "col.invested",
        propertyName: "positionSizeQuote",
        renderFunction: renderQuoteSize,
      },
      {
        columnId: "col.actions",
        propertyName: "updating",
        renderFunction: renderViewActionButton,
      },
    ];

    return {
      columns: columnsIds.map(composeColumnOptions),
      data: positions,
    };
  }

  /**
   * Exclude data table column display.
   *
   * @param {DataTableContent} dataTable Data table structure.
   * @param {string} columnId ID of the column to remove.
   *
   * @returns {DataTableContent} Data table without removed column.
   */

  function excludeDataTableColumn(dataTable, columnId) {
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
      composeBaseSymbolWithPrice(position.base, position.remainAmount),
      composeQuoteSize(position),
      composeTrailingStopIcon(position),
      composeTakeProfitTargets(position),
      composeRebuyTargets(position),
      composeRisk(position),
      composeRawValue(position.age),
      composeManagementActionButtons(position, confirmActionHandler),
    ];
  }

  /**
   * Compose MUI Data Table data structure from positions entities collection.
   *
   * @returns {DataTableContent} Open positions data table structure.
   */
  function composeManagementPositionsDataTable() {
    const columnsIds = [
      "col.provider.subpositions",
      "col.date.open",
      "col.provider.name",
      "col.provider.totalpositions",
      "col.provider.soldpositions",
      "col.status",
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
      "col.actions",
    ];

    return {
      columns: columnsIds.map(composeColumnOptions),
      data: positions.map((position) =>
        composeManagementPositionRow(position, confirmActionHandler),
      ),
    };
  }

  /**
   * Compose MUI Data Table data structure from positions entities collection.
   *
   * @returns {DataTableContent} Closed positions data table structure.
   */
  function composeClosedPositionsForProvider() {
    const columnsIds = [
      { columnId: "col.date.open", propertyName: "openDateReadable", renderFunction: null },
      { columnId: "col.date.close", propertyName: "closeDateReadable", renderFunction: null },
      { columnId: "col.pair", propertyName: "pair", renderFunction: null },
      { columnId: "col.entryprice", propertyName: "buyPrice", renderFunction: renderEntryPrice },
      { columnId: "col.exitprice", propertyName: "sellPrice", renderFunction: renderExitPrice },
      {
        columnId: "col.returnfrominvestment",
        propertyName: "returnFromInvestment",
        renderFunction: renderReturnsFromInvestment,
      },
      {
        columnId: "col.returnfromallocated",
        propertyName: "returnFromAllocated",
        renderFunction: renderReturnsFromAllocated,
      },
      { columnId: "col.side", propertyName: "side", renderFunction: null },
      { columnId: "col.amount", propertyName: "amount", renderFunction: renderAmount },
      {
        columnId: "col.invested",
        propertyName: "positionSize",
        renderFunction: renderPositionSize,
      },
      { columnId: "col.leverage", propertyName: "leverage", renderFunction: renderLeverage },
      { columnId: "col.exchange", propertyName: "exchange", renderFunction: null },
      { columnId: "col.status", propertyName: "status", renderFunction: renderStatusMessage },
    ];

    return {
      columns: columnsIds.map(composeColumnOptions),
      data: positions,
    };
  }

  /**
   * Compose MUI Data Table data structure from positions entities collection.
   *
   * @returns {DataTableContent} Open positions data table structure.
   */
  function composeOpenPositionsForProvider() {
    const columnsIds = [
      { columnId: "col.date.open", propertyName: "openDateReadable", renderFunction: null },
      { columnId: "col.status", propertyName: "status", renderFunction: renderStatusMessage },
      { columnId: "col.pair", propertyName: "pair", renderFunction: null },
      { columnId: "col.price.entry", propertyName: "buyPrice", renderFunction: renderEntryPrice },
      { columnId: "col.leverage", propertyName: "leverage", renderFunction: renderLeverage },
      {
        columnId: "col.price.current",
        propertyName: "sellPrice",
        renderFunction: renderExitPrice,
      },
      {
        columnId: "col.unrealizedplnumber",
        propertyName: "unrealizedProfitLosses",
        renderFunction: renderUnrealizedNetProfit,
      },
      {
        columnId: "col.unrealizedplpercentage",
        propertyName: "unrealizedProfitLossesPercentage",
        renderFunction: renderUnrealizedProfitPercentage,
      },
      {
        columnId: "col.pricedifference",
        propertyName: "priceDifference",
        renderFunction: renderPriceDifference,
      },
      { columnId: "col.side", propertyName: "side", renderFunction: null },
      {
        columnId: "col.stoplossprice",
        propertyName: "stopLossPrice",
        renderFunction: renderStopLossPrice,
      },
      { columnId: "col.initialamount", propertyName: "amount", renderFunction: renderAmount },
      {
        columnId: "col.remainingamount",
        propertyName: "remainAmount",
        renderFunction: partial(renderBaseSymbolWithPrice, "remainAmount"),
      },
      {
        columnId: "col.invested",
        propertyName: "positionSizeQuote",
        renderFunction: renderQuoteSize,
      },
      {
        columnId: "col.realinvestment",
        propertyName: "realInvestment",
        renderFunction: renderRealInvestment,
      },
      {
        columnId: "col.tsl",
        propertyName: "trailingStopTriggered",
        renderFunction: renderTrailingStopIcon,
      },
      {
        columnId: "col.tp",
        propertyName: "takeProfitTargetsCountPending",
        renderFunction: renderTakeProfitTargets,
      },
      {
        columnId: "col.dca",
        propertyName: "reBuyTargetsCountPending",
        renderFunction: renderRebuyTargets,
      },
      { columnId: "col.risk", propertyName: "risk", renderFunction: renderRisk },
      {
        columnId: "col.actions",
        propertyName: "updating",
        renderFunction: renderAllActionButtons,
      },
    ];

    return {
      columns: columnsIds.map(composeColumnOptions),
      data: positions,
    };
  }

  return {
    composeClosePositionsDataTable,
    composeLogPositionsDataTable,
    composeManagementPositionsDataTable,
    composeOpenPositionsDataTable,
    composeOpenPositionsForProvider,
    composeClosedPositionsForProvider,
    excludeDataTableColumn,
  };
}

import React, { useEffect, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { navigate } from "gatsby";
import { Box } from "@material-ui/core";
import { useFormContext } from "react-hook-form";
import { assign, concat, isEmpty, isFunction, isObject, range, forIn, noop } from "lodash";
import { useDispatch } from "react-redux";
import { colors } from "../../../services/theme";
import { formatPrice } from "../../../utils/formatters";
import tradeApi from "../../../services/tradeApiClient";
import { mapEntryTypeToEnum, mapSideToEnum } from "../../../services/tradeApiClient.types";
import useStoreSettingsSelector from "../../../hooks/useStoreSettingsSelector";
import useStoreSessionSelector from "../../../hooks/useStoreSessionSelector";
import { showErrorAlert, showSuccessAlert } from "../../../store/actions/ui";
import { calculateDcaPrice } from "../../../utils/calculations";
import { minToSeconds, hourToSeconds } from "../../../utils/timeConvert";
import CustomButton from "../../CustomButton";
import SidebarEditPanels from "./SidebarEditPanels";
import SidebarCreatePanels from "./SidebarCreatePanels";
import { matchCurrentSymbol } from "../../../utils/lookup";
import "./StrategyForm.scss";

/**
 * @typedef {import("../../../services/coinRayDataFeed").CoinRayCandle} CoinRayCandle
 * @typedef {any} TVWidget
 * @typedef {any} TVChartLine
 * @typedef {import("../../../services/tradeApiClient.types").CreatePositionPayload} CreatePositionPayload
 * @typedef {import("../../../services/tradeApiClient.types").UpdatePositionPayload} UpdatePositionPayload
 * @typedef {import("../../../services/tradeApiClient.types").PositionEntity} PositionEntity
 * @typedef {import("../../../services/tradeApiClient.types").MarketSymbolsCollection} MarketSymbolsCollection
 * @typedef {CreatePositionPayload["takeProfitTargets"]} PositionProfitTargets
 * @typedef {CreatePositionPayload["reBuyTargets"]} PositionDCATargets
 */

/**
 * @typedef {Object} StrategyFormProps
 * @property {MarketSymbolsCollection} symbolsData
 * @property {number} lastPrice
 * @property {TVWidget} tradingViewWidget
 * @property {string} selectedSymbol
 * @property {PositionEntity} [positionEntity] Position entity (optional) for position edit trading view.
 * @property {function} [notifyPositionUpdate] Callback to notify position update.
 */

/**
 * Manual trading strategy form component.
 *
 * @param {StrategyFormProps} props Component props.
 * @returns {JSX.Element} Strategy form element.
 */
const StrategyForm = (props) => {
  const {
    lastPrice,
    notifyPositionUpdate = noop,
    selectedSymbol,
    tradingViewWidget,
    positionEntity = null,
    symbolsData = [],
  } = props;

  const currentSymbolData = symbolsData.find((item) => matchCurrentSymbol(item, selectedSymbol));
  const isPositionView = isObject(positionEntity);

  const { errors, handleSubmit, setValue, reset, trigger, watch } = useFormContext();
  const storeSettings = useStoreSettingsSelector();
  const storeSession = useStoreSessionSelector();
  const dispatch = useDispatch();
  const [processing, setProcessing] = useState(false);
  const { formatMessage } = useIntl();
  const { selectedExchange } = storeSettings;

  /**
   * @type {Object<String, TVChartLine|null>}
   */
  const defaultLinesTracking = {
    price: null,
    stopLossPrice: null,
    trailingStopPrice: null,
    dcaTargetPrice1: null,
    profitTargetPrice1: null,
  };
  const [linesTracking, setLinesTracking] = useState(defaultLinesTracking);

  /**
   * @typedef {Object} ChartLineParams
   * @property {string} id Line ID for tracking purposes for remove / redraw.
   * @property {number} price Line price.
   * @property {string} label Line label.
   * @property {string} color Line color.
   */

  /**
   * Remove chart line with a given ID.
   *
   * @param {string} id Line ID.
   * @return {Void} None.
   */
  function removeLine(id) {
    const existingChartLine = linesTracking[id] || null;

    if (existingChartLine) {
      existingChartLine.remove();
      linesTracking[id] = null;

      // Remove tracked line.
      setLinesTracking({
        ...linesTracking,
      });
    }
  }

  /**
   * Draw price line at Trading View Chart.
   *
   * @param {ChartLineParams} chartLineParams Chart line parameters object.
   * @returns {TVChartLine|null} TV chart line object.
   */
  function drawLine(chartLineParams) {
    const { id, price, label, color } = chartLineParams;
    const existingChartLine = linesTracking[id] || null;

    // Avoid draw lines when widget don't expose chart API, this is the case
    // when TV library is loaded as widget from vendor servers.
    if (!isFunction(tradingViewWidget.chart)) {
      return null;
    }

    // Skip draw when price is empty.
    if (price === 0) {
      return null;
    }

    // When line already exists, remove prior to draw to prevent duplication.
    if (existingChartLine) {
      const currentLinePrice = existingChartLine.getPrice();
      // Update existing line only if price changed.
      if (price !== currentLinePrice) {
        existingChartLine.setPrice(price);
        existingChartLine.setQuantity(price);
      }

      return existingChartLine;
    }

    const chart = tradingViewWidget.chart();

    const chartLine = chart
      .createPositionLine({})
      .setPrice(price)
      .setQuantity(`${price}`)
      .setText(label)
      // horizontal line
      .setLineColor(color)
      // content text
      .setBodyTextColor(color)
      // content text border
      .setBodyBorderColor(color)
      // accompanying number
      .setQuantityBackgroundColor(color)
      // accompanying number border
      .setQuantityBorderColor(color);

    // Track the chart line object.
    setLinesTracking({
      ...linesTracking,
      [id]: chartLine,
    });

    return chartLine;
  }

  /**
   * Compose position profit targets.
   *
   * @param {Object<string, any>} draftPosition React hook form submission values.
   * @returns {PositionProfitTargets|boolean} Create position payload.
   */
  const composePositionTakeProfitTargets = (draftPosition) => {
    const targetRange = range(1, 10, 1);
    /**
     * @type {PositionProfitTargets} takeProfitTargets
     */
    const takeProfitTargets = [];

    targetRange.forEach((targetId) => {
      const targetPricePercentage = draftPosition[`takeProfitTargetPricePercentage${targetId}`];
      const targetPrice = draftPosition[`takeProfitTargetPrice${targetId}`];
      const targetExitUnitsPercetage = draftPosition[`takeProfitExitUnitsPercentage${targetId}`];
      const targetExitUnits = draftPosition[`takeProfitExitUnits${targetId}`];

      if (targetPricePercentage) {
        takeProfitTargets.push({
          targetId,
          priceTargetPercentage: parseFloat(targetPricePercentage),
          quoteTarget: parseFloat(targetPrice),
          amountPercentage: parseFloat(targetExitUnitsPercetage),
          value: parseFloat(targetExitUnits),
        });
      }
    });

    return isEmpty(takeProfitTargets) ? false : takeProfitTargets;
  };

  /**
   * Compose position DCA targets payload chunk.
   *
   * @param {Object<string, any>} draftPosition React hook form submission values.
   * @returns {PositionDCATargets|boolean} Create position payload.
   */
  const composePositionDcaTargets = (draftPosition) => {
    /**
     * @type {PositionDCATargets}
     */
    const dcaTargets = [];

    /**
     * Compose a DCA target item for a given index.
     *
     * @param {Number} targetId Target index.
     * @return {Void} None.
     */
    const composeTargetItem = (targetId) => {
      const targetPricePercentage = draftPosition[`dcaTargetPricePercentage${targetId}`];
      const targetRebuyPercentage = draftPosition[`dcaRebuyPercentage${targetId}`];

      if (targetPricePercentage) {
        dcaTargets.push({
          targetId,
          priceTargetPercentage: parseFloat(targetPricePercentage),
          amountPercentage: parseFloat(targetRebuyPercentage),
        });
      }
    };

    range(1, 20, 1).forEach(composeTargetItem);
    range(1000, 1020, 1).forEach(composeTargetItem);

    return isEmpty(dcaTargets) ? false : dcaTargets;
  };

  /**
   * @typedef {Object} PositionStrategyParams
   * @property {CreatePositionPayload['type']} type
   * @property {CreatePositionPayload['positionSize']} positionSize
   * @property {CreatePositionPayload['realInvestment']} realInvestment
   * @property {CreatePositionPayload['limitPrice']} limitPrice
   * @property {string} [providerId]
   * @property {string} [providerName]
   */

  /**
   * Compose position strategy payload chunk.
   *
   * @param {Object<string, any>} draftPosition React hook form submission values.
   * @returns {PositionStrategyParams} Create position payload.
   */
  const composePositionStrategy = (draftPosition) => {
    const positionSize = parseFloat(draftPosition.positionSize) || 0;
    const strategy = {
      buyType: mapEntryTypeToEnum(draftPosition.entryStrategy),
      type: mapEntryTypeToEnum(draftPosition.entryStrategy),
      positionSize,
      positionSizeQuote: currentSymbolData.quote,
      realInvestment: parseFloat(draftPosition.realInvestment) || positionSize,
      limitPrice: draftPosition.price || lastPrice,
    };

    if (draftPosition.positionSizePercentage) {
      return assign(strategy, {
        positionSizePercentage: parseFloat(draftPosition.positionSizePercentage) || 0,
        providerId: draftPosition.providerService || "",
        providerName: draftPosition.providerName || "",
      });
    }

    return strategy;
  };

  /**
   * Compose create position payload.
   *
   * @param {Object<string, any>} draftPosition React hook form submission values.
   * @returns {any} Create position payload.
   */
  const composePositionPayload = (draftPosition) => {
    const { quote, base } = currentSymbolData;
    const exchangeName = selectedExchange.exchangeName || selectedExchange.name || "";
    const buyTTL = parseFloat(draftPosition.entryExpiration);
    const sellTTL = parseFloat(draftPosition.autoclose);

    return {
      token: storeSession.tradeApi.accessToken,
      pair: `${base}  ${quote}`,
      positionSizeQuote: quote,
      side: mapSideToEnum(draftPosition.entryType),
      stopLossPercentage: parseFloat(draftPosition.stopLossPercentage) || false,
      buyTTL: minToSeconds(buyTTL) || false,
      buyStopPrice: parseFloat(draftPosition.stopPrice) || 0,
      sellByTTL: hourToSeconds(sellTTL) || 0,
      takeProfitTargets: composePositionTakeProfitTargets(draftPosition),
      reBuyTargets: composePositionDcaTargets(draftPosition),
      trailingStopTriggerPercentage: parseFloat(draftPosition.trailingStopPercentage) || false,
      trailingStopPercentage: parseFloat(draftPosition.trailingStopDistance) || false,
      providerId: 1,
      providerName: "Manual Trading",
      exchangeName: exchangeName,
      internalExchangeId: selectedExchange.internalId,
    };
  };

  /**
   * Compose create position payload.
   *
   * @param {Object<string, any>} draftPosition React hook form submission values.
   * @returns {CreatePositionPayload} Create position payload.
   */
  const composeCreatePositionPayload = (draftPosition) => {
    return assign(composePositionPayload(draftPosition), composePositionStrategy(draftPosition), {
      leverage: parseInt(draftPosition.leverage) || 1,
    });
  };

  /**
   * Compose update position payload.
   *
   * @param {Object<string, any>} draftPosition React hook form submission values.
   * @returns {UpdatePositionPayload} Update position payload.
   */
  const composeUpdatePositionPayload = (draftPosition) => {
    const { quote } = currentSymbolData;
    const isIncreaseUpdate = draftPosition.positionSize || draftPosition.positionSizePercentage;
    const positionStrategy = isIncreaseUpdate ? composePositionStrategy(draftPosition) : {};

    return assign(
      {
        token: storeSession.tradeApi.accessToken,
        positionSizeQuote: quote,
        side: mapSideToEnum(draftPosition.entryType),
        stopLossPercentage: parseFloat(draftPosition.stopLossPercentage) || false,
        buyStopPrice: parseFloat(draftPosition.stopPrice) || 0,
        takeProfitTargets: composePositionTakeProfitTargets(draftPosition),
        reBuyTargets: composePositionDcaTargets(draftPosition),
        trailingStopTriggerPercentage: parseFloat(draftPosition.trailingStopPercentage) || false,
        trailingStopPercentage: parseFloat(draftPosition.trailingStopDistance) || false,
        providerId: 1,
        providerName: "Manual Trading",
        internalExchangeId: selectedExchange.internalId,
        positionId: positionEntity.positionId,
      },
      positionStrategy,
    );
  };

  /**
   * Submit manual position create request to Trade API.
   *
   * @param {CreatePositionPayload} payload Create position payload.
   * @return {Void} None.
   */
  const createPosition = (payload) => {
    setProcessing(true);
    tradeApi
      .manualPositionCreate(payload)
      .then((positionId) => {
        reset();
        dispatch(showSuccessAlert("", formatMessage({ id: "terminal.open.success" })));
        navigate(`/position/${positionId}`);
      })
      .catch((e) => {
        dispatch(showErrorAlert(e));
      })
      .finally(() => {
        setProcessing(false);
      });
  };

  /**
   * Submit manual position update request to Trade API.
   *
   * @param {UpdatePositionPayload} payload Update position payload.
   * @return {Void} None.
   */
  const updatePosition = (payload) => {
    setProcessing(true);

    tradeApi
      .manualPositionUpdate(payload)
      .then(() => {
        dispatch(
          showSuccessAlert(
            "terminal.updated.title",
            formatMessage(
              { id: "terminal.updated.body" },
              { positionId: positionEntity.positionId },
            ),
          ),
        );
        notifyPositionUpdate();
      })
      .catch((e) => {
        dispatch(showErrorAlert(e));
      })
      .finally(() => {
        setProcessing(false);
      });
  };

  /**
   * Handle create position form submission.
   *
   * @param {Object<string, any>} draftPosition React hook form submission values.
   * @returns {Void} None.
   */
  const onSubmit = (draftPosition) => {
    if (positionEntity) {
      const payload = composeUpdatePositionPayload(draftPosition);
      updatePosition(payload);
    } else {
      const payload = composeCreatePositionPayload(draftPosition);
      createPosition(payload);
    }
  };

  // @ts-ignore
  const updatePriceField = () => {
    setValue("price", lastPrice);
    // Hidden price input used when strategy panels is collapsed due to the fact
    // that unmounted input value is removed from form state.
    setValue("lastPrice", lastPrice);
  };
  useEffect(updatePriceField, [lastPrice]);

  // Use position buyPrice for edit or strategy price for create position.
  const strategyPrice = watch("price");
  const entryPrice = positionEntity ? positionEntity.buyPrice : parseFloat(strategyPrice);
  const drawEntryPriceLine = () => {
    drawLine({
      id: "price",
      price: entryPrice || 0,
      label: formatMessage({ id: "terminal.line.price.label" }),
      color: colors.purple,
    });
  };
  useEffect(drawEntryPriceLine, [strategyPrice]);

  const stopLossPrice = watch("stopLossPrice");
  const drawStopLossPriceLine = () => {
    const price = parseFloat(stopLossPrice);
    if (price) {
      drawLine({
        id: "stopLossPrice",
        price: price || 0,
        label: formatMessage({ id: "terminal.line.stoploss.label" }),
        color: colors.yellow,
      });
    } else {
      removeLine("stopLossPrice");
    }
  };
  useEffect(drawStopLossPriceLine, [stopLossPrice]);

  const trailingStopPrice = watch("trailingStopPrice");
  const drawTrailingStopPriceLine = () => {
    const price = parseFloat(trailingStopPrice);
    if (price) {
      drawLine({
        id: "trailingStopPrice",
        price: price || 0,
        label: formatMessage({ id: "terminal.line.trailingstop.label" }),
        color: colors.blue,
      });
    } else {
      removeLine("trailingStopPrice");
    }
  };
  useEffect(drawTrailingStopPriceLine, [trailingStopPrice]);

  const targetGroupIndexes = concat(range(1, 10, 1), range(1000, 1020, 1));
  const takeProfitFields = targetGroupIndexes.map((id) => `takeProfitTargetPrice${id}`);
  const takeProfitTargetPrices = watch(takeProfitFields);
  const drawTakeProfitTargetPriceLines = () => {
    forIn(takeProfitTargetPrices, (/** @type {string} */ targetPrice, targetFieldName) => {
      const index = targetFieldName.substr(targetFieldName.length - 1);
      const price = parseFloat(targetPrice);
      if (price) {
        drawLine({
          id: targetFieldName,
          price: price || 0,
          label: formatMessage({ id: "terminal.line.takeprofit.label" }, { index: index }),
          color: colors.green,
        });
      } else {
        removeLine(targetFieldName);
      }
    });
  };
  useEffect(drawTakeProfitTargetPriceLines, [takeProfitTargetPrices]);

  const dcaTargetPercentage1 = watch("dcaTargetPricePercentage1");
  const drawDCATargetPriceLines = () => {
    const percentage = parseFloat(dcaTargetPercentage1);
    if (dcaTargetPercentage1) {
      const dcaTargetPrice1 = calculateDcaPrice(entryPrice, percentage);
      drawLine({
        id: "dcaTargetPricePercentage1",
        price: Number(formatPrice(dcaTargetPrice1, "", "")) || 0,
        label: formatMessage({ id: "terminal.line.dca.label" }, { index: 1 }),
        color: colors.black,
      });
    } else {
      removeLine("dcaTargetPricePercentage1");
    }
  };
  useEffect(drawDCATargetPriceLines, [dcaTargetPercentage1]);

  const isClosed = positionEntity ? positionEntity.closed : false;
  const isCopy = positionEntity ? positionEntity.isCopyTrading : false;
  const isCopyTrader = positionEntity ? positionEntity.isCopyTrader : false;
  const isUpdating = positionEntity ? positionEntity.updating : false;
  const isOpening = positionEntity ? positionEntity.status === 1 : false;
  const isReadOnly = (isCopy && !isCopyTrader) || isClosed || isUpdating || isOpening;

  return (
    <Box bgcolor="grid.content" className="strategyForm" textAlign="center">
      <form onSubmit={handleSubmit(onSubmit)}>
        {isPositionView ? (
          <SidebarEditPanels
            currentSymbolData={currentSymbolData}
            positionEntity={positionEntity}
          />
        ) : (
          <SidebarCreatePanels currentSymbolData={currentSymbolData} />
        )}
        {!isReadOnly && (
          <CustomButton
            className={"full submitButton"}
            disabled={!isEmpty(errors) || processing}
            loading={processing}
            onClick={() => {
              trigger();
            }}
            type="submit"
          >
            {isPositionView ? (
              <FormattedMessage id="terminal.update" />
            ) : (
              <FormattedMessage id="terminal.open" />
            )}
          </CustomButton>
        )}
      </form>
    </Box>
  );
};

export default React.memo(StrategyForm);

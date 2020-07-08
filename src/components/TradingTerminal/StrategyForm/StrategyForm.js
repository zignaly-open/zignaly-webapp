import React, { useEffect, useState } from "react";
import { navigate } from "gatsby";
import { Box } from "@material-ui/core";
import { useFormContext } from "react-hook-form";
import { assign, isEmpty, isFunction, isObject, range, forIn, noop } from "lodash";
import { useDispatch } from "react-redux";
import StrategyPanel from "../StrategyPanel/StrategyPanel";
import TakeProfitPanel from "../TakeProfitPanel/TakeProfitPanel";
import DCAPanel from "../DCAPanel/DCAPanel";
import StopLossPanel from "../StopLossPanel/StopLossPanel";
import TrailingStopPanel from "../TrailingStopPanel/TrailingStopPanel";
import EntryExpirationPanel from "../EntryExpirationPanel/EntryExpirationPanel";
import AutoclosePanel from "../AutoclosePanel/AutoclosePanel";
import IncreaseStrategyPanel from "../IncreaseStrategyPanel/IncreaseStrategyPanel";
import CustomButton from "../../CustomButton/CustomButton";
import { colors } from "../../../services/theme";
import { formatPrice } from "../../../utils/formatters";
import tradeApi from "../../../services/tradeApiClient";
import {
  POSITION_TYPE_ENTRY,
  mapEntryTypeToEnum,
  mapSideToEnum,
} from "../../../services/tradeApiClient.types";
import useStoreSettingsSelector from "../../../hooks/useStoreSettingsSelector";
import useStoreSessionSelector from "../../../hooks/useStoreSessionSelector";
import { showErrorAlert } from "../../../store/actions/ui";
import { FormattedMessage } from "react-intl";
import { calculateDcaPrice } from "../../../utils/calculations";
import { minToSeconds, hourToSeconds } from "../../../utils/timeConvert";
import "./StrategyForm.scss";

/**
 * @typedef {import("../../../services/coinRayDataFeed").MarketSymbol} MarketSymbol
 * @typedef {import("../../../services/coinRayDataFeed").CoinRayCandle} CoinRayCandle
 * @typedef {import("../../../tradingView/charting_library.min").IChartingLibraryWidget} TVWidget
 * @typedef {import("../../../tradingView/charting_library.min").IPositionLineAdapter} TVChartLine
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

  const isPositionView = isObject(positionEntity);
  const isClosed = positionEntity ? positionEntity.closed : false;
  const isCopyTrading = positionEntity ? positionEntity.isCopyTrading : false;

  const { errors, handleSubmit, setValue, reset, triggerValidation, watch } = useFormContext();
  const storeSettings = useStoreSettingsSelector();
  const storeSession = useStoreSessionSelector();
  const dispatch = useDispatch();
  const [processing, setProcessing] = useState(false);

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

    return takeProfitTargets;
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
   * @property {CreatePositionPayload['buyType']} buyType
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
      positionSize,
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
    const { selectedExchange } = storeSettings;
    const exchangeName = selectedExchange.exchangeName || selectedExchange.name || "";
    const buyTTL = parseFloat(draftPosition.entryExpiration);
    const sellTTL = parseFloat(draftPosition.autoclose);

    return {
      token: storeSession.tradeApi.accessToken,
      pair: `${base}  ${quote}`,
      positionSizeQuote: quote,
      side: mapSideToEnum(draftPosition.entryType),
      type: POSITION_TYPE_ENTRY,
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
      exchangeInternalId: selectedExchange.internalId,
    };
  };

  /**
   * Compose create position payload.
   *
   * @param {Object<string, any>} draftPosition React hook form submission values.
   * @returns {CreatePositionPayload} Create position payload.
   */
  const composeCreatePositionPayload = (draftPosition) => {
    return assign(composePositionPayload(draftPosition), composePositionStrategy(draftPosition));
  };

  /**
   * Compose update position payload.
   *
   * @param {Object<string, any>} draftPosition React hook form submission values.
   * @returns {UpdatePositionPayload} Update position payload.
   */
  const composeUpdatePositionPayload = (draftPosition) => {
    const positionStrategy = draftPosition.positionSize
      ? composePositionStrategy(draftPosition)
      : {};

    return assign(composePositionPayload(draftPosition), positionStrategy, {
      positionId: positionEntity.positionId,
    });
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
        setProcessing(false);
        reset();
        alert(`Position was created succesfully with ID ${positionId}`);
        navigate(`/position/${positionId}`);
      })
      .catch((e) => {
        setProcessing(false);
        dispatch(showErrorAlert(e));
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
        setProcessing(false);
        alert(`Position ${positionEntity.positionId} was updated succesfully.`);
        notifyPositionUpdate();
      })
      .catch((e) => {
        setProcessing(false);
        dispatch(showErrorAlert(e));
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
      label: "Price",
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
        label: "Stop loss",
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
        label: "Trailing stop price",
        color: colors.blue,
      });
    } else {
      removeLine("trailingStopPrice");
    }
  };
  useEffect(drawTrailingStopPriceLine, [trailingStopPrice]);

  const targetGroupIndexes = range(1, 10, 1);
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
          label: `Take profit target ${index}`,
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
        price: Number(formatPrice(dcaTargetPrice1)) || 0,
        label: "DCA target 1",
        color: colors.black,
      });
    } else {
      removeLine("dcaTargetPricePercentage1");
    }
  };
  useEffect(drawDCATargetPriceLines, [dcaTargetPercentage1]);

  /**
   * Match current symbol against market symbols collection item.
   *
   * @param {MarketSymbol} item Market symbol item.
   * @returns {boolean} TRUE when ID matches, FALSE otherwise.
   */
  const matchCurrentSymbol = (item) => {
    return item.id === selectedSymbol.replace("/", "");
  };
  const currentSymbolData = symbolsData.find(matchCurrentSymbol);

  return (
    <Box className="strategyForm" textAlign="center">
      <form onSubmit={handleSubmit(onSubmit)}>
        {!isPositionView && <StrategyPanel symbolData={currentSymbolData} />}
        <TakeProfitPanel positionEntity={positionEntity} symbolData={currentSymbolData} />
        <DCAPanel positionEntity={positionEntity} symbolData={currentSymbolData} />
        <StopLossPanel positionEntity={positionEntity} symbolData={currentSymbolData} />
        <TrailingStopPanel positionEntity={positionEntity} symbolData={currentSymbolData} />
        {isPositionView && !isClosed && !isCopyTrading && (
          <IncreaseStrategyPanel positionEntity={positionEntity} symbolData={currentSymbolData} />
        )}
        {!isPositionView && <EntryExpirationPanel />}
        {!isPositionView && <AutoclosePanel />}
        {!isClosed && (
          <CustomButton
            className={"full submitButton"}
            disabled={!isEmpty(errors)}
            loading={processing}
            onClick={() => {
              triggerValidation();
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

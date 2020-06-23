import React, { useEffect, useState } from "react";
import { Box } from "@material-ui/core";
import { useForm, FormContext } from "react-hook-form";
import { isEmpty, range, forIn } from "lodash";
import { useDispatch } from "react-redux";
import StrategyPanel from "../StrategyPanel/StrategyPanel";
import TakeProfitPanel from "../TakeProfitPanel/TakeProfitPanel";
import DCAPanel from "../DCAPanel/DCAPanel";
import StopLossPanel from "../StopLossPanel/StopLossPanel";
import TrailingStopPanel from "../TrailingStopPanel/TrailingStopPanel";
import EntryExpirationPanel from "../EntryExpirationPanel/EntryExpirationPanel";
import AutoclosePanel from "../AutoclosePanel/AutoclosePanel";
import CustomButton from "../../CustomButton/CustomButton";
import { colors } from "../../../services/theme";
import { formatPrice } from "../../../utils/formatters";
import tradeApi from "../../../services/tradeApiClient";
import {
  POSITION_SIDE_LONG,
  POSITION_TYPE_ENTRY,
  POSITION_SIDE_SHORT,
  POSITION_ENTRY_TYPE_MARKET,
} from "../../../services/tradeApiClient.types";
import useStoreSettingsSelector from "../../../hooks/useStoreSettingsSelector";
import useStoreSessionSelector from "../../../hooks/useStoreSessionSelector";
import { showErrorAlert } from "../../../store/actions/ui";
import "./StrategyForm.scss";
import { FormattedMessage } from "react-intl";
import "../../CustomButton/CustomButton.scss";

/**
 * @typedef {import("../../../services/coinRayDataFeed").MarketSymbol} MarketSymbol
 * @typedef {import("../../../services/coinRayDataFeed").CoinRayCandle} CoinRayCandle
 * @typedef {import("../../../services/tradeApiClient.types").CreatePositionPayload} CreatePositionPayload
 * @typedef {CreatePositionPayload["takeProfitTargets"]} PositionProfitTargets
 * @typedef {CreatePositionPayload["reBuyTargets"]} PositionDCATargets
 * @typedef {import("../../../tradingView/charting_library.min").IChartingLibraryWidget} TVWidget
 * @typedef {import("../../../tradingView/charting_library.min").IPositionLineAdapter} TVChartLine
 */

/**
 * @typedef {Object} StrategyFormProps
 * @property {Object} dataFeed
 * @property {CoinRayCandle} lastPriceCandle
 * @property {TVWidget} tradingViewWidget
 * @property {number} leverage
 * @property {string} selectedSymbol
 */

/**
 * Manual trading strategy form component.
 *
 * @param {StrategyFormProps} props Component props.
 * @returns {JSX.Element} Strategy form element.
 */
const StrategyForm = (props) => {
  const { dataFeed, lastPriceCandle, leverage, selectedSymbol, tradingViewWidget } = props;
  const currentPrice = parseFloat(lastPriceCandle[1]).toFixed(8);
  const methods = useForm({
    mode: "onChange",
    defaultValues: {
      entryType: "LONG",
      positionSize: "",
      price: currentPrice,
      realInvestment: "",
      stopLossPrice: "",
      trailingStopPrice: "",
      units: "",
      dcaTargetPricePercentage1: "",
    },
  });
  const { errors, handleSubmit, setValue, reset, triggerValidation, watch } = methods;
  const storeSettings = useStoreSettingsSelector();
  const storeSession = useStoreSessionSelector();
  const dispatch = useDispatch();

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
   * Draw price line at Trading View Chart.
   *
   * @param {ChartLineParams} chartLineParams Chart line parameters object.
   * @returns {TVChartLine|null} TV chart line object.
   */
  function drawLine(chartLineParams) {
    const { id, price, label, color } = chartLineParams;
    const existingChartLine = linesTracking[id] || null;

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
   * Map position side to typed side value.
   *
   * @param {string} side Side value.
   * @returns {('SHORT' | 'LONG')} Typed side.
   */
  const mapSideToEnum = (side) => {
    switch (side) {
      case "SHORT":
        return POSITION_SIDE_SHORT;

      case "LONG":
        return POSITION_SIDE_LONG;

      default:
        return POSITION_SIDE_LONG;
    }
  };

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
   * Compose position DCA targets.
   *
   * @param {Object<string, any>} draftPosition React hook form submission values.
   * @returns {PositionDCATargets|boolean} Create position payload.
   */
  const composePositionDcaTargets = (draftPosition) => {
    const targetRange = range(1, 10, 1);
    /**
     * @type {PositionDCATargets}
     */
    const dcaTargets = [];

    targetRange.forEach((targetId) => {
      const targetPricePercentage = draftPosition[`dcaTargetPricePercentage${targetId}`];
      const targetRebuyPercentage = draftPosition[`dcaRebuyPercentage${targetId}`];

      if (targetPricePercentage) {
        dcaTargets.push({
          targetId,
          priceTargetPercentage: parseFloat(targetPricePercentage),
          amountPercentage: parseFloat(targetRebuyPercentage),
        });
      }
    });

    return isEmpty(dcaTargets) ? false : dcaTargets;
  };

  /**
   * Compose create position payload.
   *
   * @param {Object<string, any>} draftPosition React hook form submission values.
   * @returns {CreatePositionPayload} Create position payload.
   */
  const composePositionPayload = (draftPosition) => {
    const { quote, base } = currentSymbolData;
    const { selectedExchange } = storeSettings;
    const exchangeName = selectedExchange.exchangeName || selectedExchange.name || "";
    const payload = {
      token: storeSession.tradeApi.accessToken,
      pair: `${base}  ${quote}`,
      limitPrice: draftPosition.price || currentPrice,
      positionSizeQuote: quote,
      positionSize: parseFloat(draftPosition.positionSize) || 0,
      side: mapSideToEnum(draftPosition.entryType),
      type: POSITION_TYPE_ENTRY,
      stopLossPercentage: parseFloat(draftPosition.stopLossPercentage) || false,
      buyTTL: parseFloat(draftPosition.entryExpiration) || false,
      buyType: POSITION_ENTRY_TYPE_MARKET,
      buyStopPrice: parseFloat(draftPosition.stopPrice) || 0,
      sellByTTL: parseFloat(draftPosition.autoclose) || 0,
      takeProfitTargets: composePositionTakeProfitTargets(draftPosition),
      reBuyTargets: composePositionDcaTargets(draftPosition),
      trailingStopTriggerPercentage: parseFloat(draftPosition.trailingStopPercentage) || false,
      trailingStopPercentage: parseFloat(draftPosition.trailingStopDistance) || false,
      providerId: 1,
      providerName: "Manual Trading",
      exchangeName: exchangeName,
      exchangeInternalId: selectedExchange.internalId,
    };

    return payload;
  };

  /**
   * Handle create position form submission.
   *
   * @param {Object<string, any>} draftPosition React hook form submission values.
   * @returns {Void} None.
   */
  const onSubmit = (draftPosition) => {
    const payload = composePositionPayload(draftPosition);
    tradeApi
      .manualPositionCreate(payload)
      .then((positionId) => {
        // TODO: Navigate to position detail page.
        alert(`Position was created succesfully with ID ${positionId}`);
        reset();
      })
      .catch((e) => {
        dispatch(showErrorAlert(e));
      });
  };

  // @ts-ignore
  const symbolsData = dataFeed.getSymbolsData();
  const updatePriceField = () => {
    setValue("price", currentPrice);
  };
  useEffect(updatePriceField, [currentPrice]);

  const strategyPrice = watch("price");
  const drawStrategyPriceLine = () => {
    drawLine({
      id: "price",
      price: parseFloat(strategyPrice) || 0,
      label: "Price",
      color: colors.purple,
    });
  };
  useEffect(drawStrategyPriceLine, [strategyPrice]);

  const stopLossPrice = watch("stopLossPrice");
  const drawStopLossPriceLine = () => {
    drawLine({
      id: "stopLossPrice",
      price: parseFloat(stopLossPrice) || 0,
      label: "Stop loss",
      color: colors.yellow,
    });
  };
  useEffect(drawStopLossPriceLine, [stopLossPrice]);

  const trailingStopPrice = watch("trailingStopPrice");
  const drawTrailingStopPriceLine = () => {
    drawLine({
      id: "trailingStopPrice",
      price: parseFloat(trailingStopPrice) || 0,
      label: "Trailing stop price",
      color: colors.blue,
    });
  };
  useEffect(drawTrailingStopPriceLine, [trailingStopPrice]);

  const targetGroupIndexes = range(1, 10, 1);
  const takeProfitFields = targetGroupIndexes.map((id) => `takeProfitTargetPrice${id}`);
  const takeProfitTargetPrices = watch(takeProfitFields);
  const drawTakeProfitTargetPriceLines = () => {
    forIn(takeProfitTargetPrices, (targetPrice, targetFieldName) => {
      if (targetPrice) {
        const index = targetFieldName.substr(targetFieldName.length - 1);
        drawLine({
          id: targetFieldName,
          price: parseFloat(targetPrice) || 0,
          label: `Take profit target ${index}`,
          color: colors.green,
        });
      }
    });
  };
  useEffect(drawTakeProfitTargetPriceLines, [takeProfitTargetPrices]);

  const dcaTargetPercentage1 = watch("dcaTargetPricePercentage1");
  const drawDCATargetPriceLines = () => {
    if (dcaTargetPercentage1) {
      const price = parseFloat(strategyPrice);
      const dcaTargetPrice1 = price - (price * parseFloat(dcaTargetPercentage1)) / 100;
      drawLine({
        id: "dcaTargetPricePercentage1",
        price: Number(formatPrice(dcaTargetPrice1)) || 0,
        label: "DCA target 1",
        color: colors.black,
      });
    }
  };
  useEffect(drawDCATargetPriceLines, [strategyPrice, dcaTargetPercentage1]);

  /**
   * Match current symbol against market symbols collection item.
   *
   * @param {MarketSymbol} item Market symbol item.
   * @returns {boolean} TRUE when ID matches, FALSE otherwise.
   */
  const matchCurrentSymbol = (item) => item.id === selectedSymbol;
  const currentSymbolData = symbolsData.find(matchCurrentSymbol);

  return (
    <FormContext {...methods}>
      <Box className="strategyForm" textAlign="center">
        <form onSubmit={handleSubmit(onSubmit)}>
          <StrategyPanel
            disableExpand={true}
            lastPriceCandle={lastPriceCandle}
            leverage={leverage}
            symbolData={currentSymbolData}
          />
          <TakeProfitPanel lastPriceCandle={lastPriceCandle} symbolData={currentSymbolData} />
          <DCAPanel symbolData={currentSymbolData} />
          <StopLossPanel symbolData={currentSymbolData} />
          <TrailingStopPanel symbolData={currentSymbolData} />
          <EntryExpirationPanel />
          <AutoclosePanel />
          <CustomButton
            className={"full submitButton"}
            disabled={!isEmpty(errors)}
            onClick={() => {
              triggerValidation();
            }}
            type="submit"
          >
            <FormattedMessage id="terminal.open" />
          </CustomButton>
        </form>
      </Box>
    </FormContext>
  );
};

export default React.memo(StrategyForm);

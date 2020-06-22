import React, { useEffect, useState } from "react";
import { Box, Button } from "@material-ui/core";
import { useForm, FormContext } from "react-hook-form";
import StrategyPanel from "../StrategyPanel/StrategyPanel";
import TakeProfitPanel from "../TakeProfitPanel/TakeProfitPanel";
import DCAPanel from "../DCAPanel/DCAPanel";
import StopLossPanel from "../StopLossPanel/StopLossPanel";
import TrailingStopPanel from "../TrailingStopPanel/TrailingStopPanel";
import EntryExpirationPanel from "../EntryExpirationPanel/EntryExpirationPanel";
import AutoclosePanel from "../AutoclosePanel/AutoclosePanel";
import { colors } from "../../../services/theme";
import { range, forIn } from "lodash";
import "./StrategyForm.scss";
import { formatPrice } from "../../../../types/utils/formatters";

/**
 * @typedef {import("../../../services/coinRayDataFeed").MarketSymbol} MarketSymbol
 * @typedef {import("../../../services/coinRayDataFeed").CoinRayCandle} CoinRayCandle
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
  const { setValue, watch } = methods;

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

  // Receives submitted data.
  const onSubmit = () => {};
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
  useEffect(drawDCATargetPriceLines, [dcaTargetPercentage1]);

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
        <form onSubmit={methods.handleSubmit(onSubmit)}>
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
          <Button type="submit">Open Position</Button>
        </form>
      </Box>
    </FormContext>
  );
};

export default StrategyForm;

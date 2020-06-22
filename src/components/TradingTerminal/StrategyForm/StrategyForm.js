import React, { useEffect, useState } from "react";
import { Box, Button } from "@material-ui/core";
import { useForm, FormContext } from "react-hook-form";
import "./StrategyForm.scss";
import StrategyPanel from "../StrategyPanel/StrategyPanel";
import TakeProfitPanel from "../TakeProfitPanel/TakeProfitPanel";
import DCAPanel from "../DCAPanel/DCAPanel";
import StopLossPanel from "../StopLossPanel/StopLossPanel";
import TrailingStopPanel from "../TrailingStopPanel/TrailingStopPanel";
import EntryExpirationPanel from "../EntryExpirationPanel/EntryExpirationPanel";
import AutoclosePanel from "../AutoclosePanel/AutoclosePanel";

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
      price: currentPrice,
      realInvestment: "",
      positionSize: "",
      units: "",
      entryType: "LONG",
    },
  });
  const { getValues, setValue, watch } = methods;

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
   * @returns {TVChartLine} TV chart line object.
   */
  function drawLine(chartLineParams) {
    const { id, price, label, color } = chartLineParams;
    const existingChartLine = linesTracking[id] || null;
    // When line already exists, remove prior to draw to prevent duplication.
    if (existingChartLine) {
      existingChartLine.remove();
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
    linesTracking[id] = chartLine;

    return chartLine;
  }

  // Receives submitted data.
  const onSubmit = () => {};
  // @ts-ignore
  const symbolsData = dataFeed.getSymbolsData();
  const updatePriceField = () => {
    setValue("price", currentPrice);
  };

  const strategyPrice = watch("price");
  const drawPriceLines = () => {
    const linePriceColor = "rgb(117, 16, 197)";
    drawLine({
      id: "price",
      price: parseFloat(strategyPrice),
      label: "Price",
      color: linePriceColor,
    });
  };

  useEffect(updatePriceField, [currentPrice]);

  console.log("Values: ", getValues());
  useEffect(drawPriceLines, [strategyPrice]);

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

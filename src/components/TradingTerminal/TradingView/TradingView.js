import React, { useEffect } from "react";
import { widget as TradingViewWidget } from "../../../tradingView/charting_library.min";
import "./TradingView.scss";
import { createWidgetOptions } from "../../../tradingView/dataFeedOptions";
import useCoinRayDataFeedFactory from "../../../hooks/useCoinRayDataFeedFactory";

const TradingView = () => {
  const selectedSymbol = "BTCUSDT";
  const dataFeed = useCoinRayDataFeedFactory(selectedSymbol);

  /**
   * @typedef {import("../../../tradingView/charting_library.min.js").IChartingLibraryWidget} Widget
   * @type {Widget|null} tvInstacne
   */
  let tvInstance = null;

  const drawLine = () => {
    const orderPrice = 9600;
    const chart = tvInstance.chart();
    const coloring3 = "rgb(117, 16, 197)";
    chart
      .createPositionLine({})
      .setPrice(orderPrice)
      .setQuantity(`${orderPrice}`)
      .setText("Price")
      // horizontal line
      .setLineColor(coloring3)
      // content text
      .setBodyTextColor(coloring3)
      // content text border
      .setBodyBorderColor(coloring3)
      // accompanying number
      .setQuantityBackgroundColor(coloring3)
      // accompanying number border
      .setQuantityBorderColor(coloring3);
  };

  const customizeChart = () => {
    console.log("Chart is ready.");
    if (tvInstance) {
      drawLine();
    }
  };

  const bootstrapWidget = () => {
    if (dataFeed) {
      const widgetOptions = createWidgetOptions(dataFeed, selectedSymbol);
      tvInstance = new TradingViewWidget(widgetOptions);
      tvInstance.onChartReady(customizeChart);
    }

    return () => {
      if (tvInstance) {
        tvInstance.remove();
      }
    };
  };

  // Create Trading View widget when data feed token is ready.
  useEffect(bootstrapWidget, [dataFeed]);

  return <div className="tradingView" id="trading_view_chart" />;
};

export default TradingView;

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

  const bootstrapWidget = () => {
    if (dataFeed) {
      const widgetOptions = createWidgetOptions(dataFeed, selectedSymbol);
      tvInstance = new TradingViewWidget(widgetOptions);
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

import React, { useEffect } from "react";
import { widget } from "../../../charting_library.min";

const TradingView = () => {
  const widgetOptions = {
    symbol: "BTC/USDT",
    interval: "30",
    containerId: "trading-view-chart",
    libraryPath: "/charting_library",
    locale: "en",
    disabledFeatures: ["use_localstorage_for_settings"],
    enabledFeatures: ["study_templates"],
    chartsStorageUrl: "https://saveload.tradingview.com",
    chartsStorageApiVersion: "1.1",
    clientId: "tradingview.com",
    userId: "public_user_id",
    fullscreen: false,
    autosize: true,
    studiesOverrides: {},
    userExchanges: [],
  };

  useEffect(() => {
    const tradingViewWidget = new widget(widgetOptions);

    return () => {
      tradingViewWidget.remove();
    };
  }, []);

  return <div className="tradingView" id="trading-view-chart" />;
};

export default TradingView;

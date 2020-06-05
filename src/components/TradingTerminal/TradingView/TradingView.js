import React, { useEffect } from "react";
import { widget } from "../../../tradingView/charting_library.min";

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

  const getDataFeedService = async () => {
    const accessToken = await getCoinrayToken();
    const symbol = "BTC/USDT";
    // const exchangeKey = resolveCoinRayExchangeKey(exchangeData);
    const exchangeKey = "BINA";
    const options = {
      debug: false,
      exchange: "Binance",
      exchangeKey,
      symbol,
      // TODO: Check this token.
      token: token,
      // TODO: What's symbols data?
      symbolsData: "",
      accessToken: accessToken,
      regenerateAccessToken: getCoinrayToken,
    };

    return new datafeed(options);
  };

  const getCoinrayToken = async () => {
    const url = GET_COINRAY_TOKEN + "&token=".concat(this.props.user);
    const milliSecsThreshold = 20000;
    // Limit to one request within a time threshold to avoid stampede requests to API.
    const throttledTokenFetch = throttle(async () => {
      try {
        const res = await fetch(url);
        if (res.status === 200) {
          const data = await res.json();
          setCoinRayToken({ accessToken: data.jwt });
          return data.jwt;
        }
      } catch (error) {
        alert(`ERROR: Get coinray token error: ${error.message}`);
      }
    }, milliSecsThreshold);

    return (await throttledTokenFetch()) || "";
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

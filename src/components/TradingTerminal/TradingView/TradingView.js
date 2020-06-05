import React, { useEffect, useState } from "react";
import { widget as TradingViewWidget } from "../../../tradingView/charting_library.min";
import useStoreSessionSelector from "../../../hooks/useStoreSessionSelector";
import CoinRayDataFeed from "../../../services/coinRayDataFeed";
import tradeApi from "../../../services/tradeApiClient";
import { throttle } from "lodash";

const TradingView = () => {
  const [tradingViewWidget, setTradingViewWidget] = useState({ remove: () => {} });
  const storeSession = useStoreSessionSelector();
  const getDataFeedService = async () => {
    const coinRayToken = await getCoinrayToken();
    const symbol = "BTC/USDT";
    // const exchangeKey = resolveCoinRayExchangeKey(exchangeData);
    const exchangeKey = "BINA";
    const options = {
      exchange: "Binance",
      exchangeKey,
      symbol,
      symbolsData: "",
      tradeApiToken: storeSession.tradeApi.accessToken,
      coinRayToken: coinRayToken,
      regenerateAccessToken: getCoinrayToken,
    };

    return new CoinRayDataFeed(options);
  };

  const getCoinrayToken = async () => {
    const milliSecsThreshold = 20000;
    // Limit to one request within a time threshold to avoid stampede requests to API.
    const throttledTokenFetch = throttle(async () => {
      try {
        const coinRayToken = await tradeApi.coinRayTokenGet({
          token: storeSession.tradeApi.accessToken,
        });

        return coinRayToken.jwt;
      } catch (error) {
        alert(`ERROR: Get coinray token error: ${error.message}`);
      }

      return "";
    }, milliSecsThreshold);

    return (await throttledTokenFetch()) || "";
  };
  const bootstrapTradigViewWidget = async () => {
    const dataFeed = await getDataFeedService();
    console.log("Data Feed: ", dataFeed);
    const widgetOptions = {
      symbol: "BTC/USDT",
      interval: "30",
      containerId: "trading-view-chart",
      // libraryPath: "/charting_library",
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

    const newWidget = new TradingViewWidget(widgetOptions);
    setTradingViewWidget(newWidget);
  };

  useEffect(() => {
    return () => {
      tradingViewWidget.remove();
    };
  });

  return <div className="tradingView" id="trading-view-chart" />;
};

export default TradingView;

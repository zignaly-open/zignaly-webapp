import React, { useEffect, useState } from "react";
import { widget as TradingViewWidget } from "../../../tradingView/charting_library.min";
import useStoreSessionSelector from "../../../hooks/useStoreSessionSelector";
import CoinRayDataFeed from "../../../services/coinRayDataFeed";
import tradeApi from "../../../services/tradeApiClient";
import { throttle } from "lodash";
import "./TradingView.scss";

const TradingView = () => {
  const storeSession = useStoreSessionSelector();
  const [coinRayToken, setCoinRayToken] = useState("");

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

  const getDataFeedService = () => {
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

  const createTradigViewWidget = () => {
    const dataFeed = getDataFeedService();
    console.log("Data Feed: ", dataFeed);

    /**
     * @typedef {import("../../../tradingView/charting_library.min").TradingTerminalWidgetOptions} TTWOptions
     * @type {TTWOptions} widgetOptions
     */
    const widgetOptions = {
      datafeed: dataFeed,
      symbol: "BTC/USDT",
      interval: "30",
      // eslint-disable-next-line camelcase
      container_id: "trading_view_chart",
      library_path: "/trading-view/",
      locale: "en",
      disabled_features: ["use_localstorage_for_settings"],
      enabled_features: ["study_templates"],
      charts_storage_url: "https://saveload.tradingview.com",
      charts_storage_api_version: "1.1",
      client_id: "tradingview.com",
      user_id: "public_user_id",
      fullscreen: false,
      autosize: true,
      studies_overrides: {},
      user_exchanges: [],
    };

    return new TradingViewWidget(widgetOptions);
  };

  // Get a CoinRay token.
  useEffect(() => {
    getCoinrayToken().then((token) => {
      setCoinRayToken(token);
    });
  }, []);

  // Create Trading View widget when data feed token is ready.
  useEffect(() => {
    if (coinRayToken !== "") {
      const tvInstance = createTradigViewWidget();

      return () => {
        tvInstance.remove();
      };
    }
  }, [coinRayToken]);

  return <div className="tradingView" id="trading_view_chart" />;
};

export default TradingView;

import React, { useEffect, useState } from "react";
import { widget as TradingViewWidget } from "../../../tradingView/charting_library.min";
import useStoreSessionSelector from "../../../hooks/useStoreSessionSelector";
import CoinRayDataFeed from "../../../services/coinRayDataFeed";
import tradeApi from "../../../services/tradeApiClient";
import { isEmpty, throttle } from "lodash";
import "./TradingView.scss";
import useStoreSettingsSelector from "../../../hooks/useStoreSettingsSelector";
import { createWidgetOptions } from "../../../tradingView/dataFeedOptions";

const TradingView = () => {
  const storeSession = useStoreSessionSelector();
  const storeSettings = useStoreSettingsSelector();
  const [coinRayToken, setCoinRayToken] = useState("");
  const [marketSymbolsData, setMarketSymbolsData] = useState([]);

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
      symbolsData: marketSymbolsData,
      tradeApiToken: storeSession.tradeApi.accessToken,
      coinRayToken: coinRayToken,
      regenerateAccessToken: getCoinrayToken,
    };

    return new CoinRayDataFeed(options);
  };

  const createTradigViewWidget = () => {
    const dataFeed = getDataFeedService();
    const widgetOptions = createWidgetOptions(dataFeed, "BTCUSDT");

    return new TradingViewWidget(widgetOptions);
  };

  // Get a CoinRay token.
  useEffect(() => {
    getCoinrayToken().then((token) => {
      setCoinRayToken(token);
    });

    const marketDataPayload = {
      token: storeSession.tradeApi.accessToken,
      exchangeInternalId: storeSettings.selectedExchange.internalId,
    };

    tradeApi
      .exchangeConnectionMarketDataGet(marketDataPayload)
      .then((data) => {
        setMarketSymbolsData(data);
      })
      .catch((e) => {
        alert(`ERROR: ${e.message}`);
      });
  }, []);

  // Create Trading View widget when data feed token is ready.
  useEffect(() => {
    if (coinRayToken !== "" && !isEmpty(marketSymbolsData)) {
      const tvInstance = createTradigViewWidget();

      return () => {
        tvInstance.remove();
      };
    }
  }, [coinRayToken]);

  return <div className="tradingView" id="trading_view_chart" />;
};

export default TradingView;

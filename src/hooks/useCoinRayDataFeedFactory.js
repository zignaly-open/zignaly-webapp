import { useEffect, useState } from "react";
import CoinRayDataFeed from "../services/coinRayDataFeed";
import { throttle } from "lodash";
import tradeApi from "../services/tradeApiClient";
import useStoreSettingsSelector from "./useStoreSettingsSelector";
import useStoreSessionSelector from "./useStoreSessionSelector";
import { mapExchangeConnectionToCoinRayId } from "../../types/utils/exchangeMapping";

/**
 * @typedef {import("../tradingView/charting_library.min").IBasicDataFeed} IBasicDataFeed
 */

/**
 * Hook to create CoinRay Data Feed instance.
 *
 * @returns {IBasicDataFeed|null} Data feed instance or null
 */
const useCoinRayDataFeedFactory = () => {
  const storeSession = useStoreSessionSelector();
  const storeSettings = useStoreSettingsSelector();
  const [coinRayToken, setCoinRayToken] = useState("");
  const [marketSymbolsData, setMarketSymbolsData] = useState([]);
  const symbol = "BTC/USDT";
  const exchangeKey = mapExchangeConnectionToCoinRayId(storeSettings.selectedExchange);

  const getCoinrayToken = async () => {
    const milliSecsThreshold = 20000;
    // Limit to one request within a time threshold to avoid stampede requests to API.
    const throttledTokenFetch = throttle(async () => {
      try {
        const data = await tradeApi.coinRayTokenGet({
          token: storeSession.tradeApi.accessToken,
        });

        return data.jwt;
      } catch (error) {
        alert(`ERROR: Get coinray token error: ${error.message}`);
      }

      return "";
    }, milliSecsThreshold);

    return (await throttledTokenFetch()) || "";
  };

  const getMarketData = async () => {
    const marketDataPayload = {
      token: storeSession.tradeApi.accessToken,
      exchangeInternalId: storeSettings.selectedExchange.internalId,
    };

    try {
      const data = await tradeApi.exchangeConnectionMarketDataGet(marketDataPayload);

      return data;
    } catch (error) {
      alert(`ERROR: ${error.message}`);
    }

    return [];
  };

  // Get a CoinRay token.
  const resolveDataDependencies = () => {
    const tokenPromise = getCoinrayToken();
    const marketDataPromise = getMarketData();

    Promise.all([tokenPromise, marketDataPromise]).then((data) => {
      setCoinRayToken(data[0]);
      setMarketSymbolsData(data[1]);
    });
  };

  useEffect(resolveDataDependencies, []);

  const options = {
    exchange: "Binance",
    exchangeKey,
    symbol,
    symbolsData: marketSymbolsData,
    tradeApiToken: storeSession.tradeApi.accessToken,
    coinRayToken: coinRayToken,
    regenerateAccessToken: getCoinrayToken,
  };

  if (coinRayToken && marketSymbolsData) {
    return new CoinRayDataFeed(options);
  }

  return null;
};

export default useCoinRayDataFeedFactory;

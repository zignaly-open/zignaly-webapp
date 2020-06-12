import { useEffect, useState } from "react";
import CoinRayDataFeed from "../services/coinRayDataFeed";
import { throttle } from "lodash";
import tradeApi from "../services/tradeApiClient";
import useStoreSettingsSelector from "./useStoreSettingsSelector";
import useStoreSessionSelector from "./useStoreSessionSelector";
import { mapExchangeConnectionToCoinRayId } from "../tradingView/dataFeedOptions";

/**
 * @typedef {import("../tradingView/charting_library.min").IBasicDataFeed} IBasicDataFeed
 */

/**
 * Hook to create CoinRay Data Feed instance.
 *
 * @param {string} symbol Market symbol to load data form.
 * @returns {IBasicDataFeed|null} Data feed instance or null
 */
const useCoinRayDataFeedFactory = (symbol) => {
  const storeSession = useStoreSessionSelector();
  const storeSettings = useStoreSettingsSelector();
  const [dataFeed, setDataFeed] = useState(null);

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
    const exchangeKey = mapExchangeConnectionToCoinRayId(storeSettings.selectedExchange);

    Promise.all([tokenPromise, marketDataPromise])
      .then((data) => {
        const coinRayToken = data[0];
        const marketSymbolsData = data[1];

        const options = {
          exchange: storeSettings.selectedExchange.exchangeName,
          exchangeKey,
          symbol,
          symbolsData: marketSymbolsData,
          tradeApiToken: storeSession.tradeApi.accessToken,
          coinRayToken: coinRayToken,
          regenerateAccessToken: getCoinrayToken,
        };

        setDataFeed(new CoinRayDataFeed(options));
      })
      .catch((e) => {
        alert(`ERROR: ${e.message}`);
      });
  };

  useEffect(resolveDataDependencies, [storeSettings.selectedExchange]);

  return dataFeed;
};

export default useCoinRayDataFeedFactory;

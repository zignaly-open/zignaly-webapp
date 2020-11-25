import { useEffect, useState } from "react";
import CoinRayDataFeed from "../services/coinRayDataFeed";
import { throttle } from "lodash";
import tradeApi from "../services/tradeApiClient";
import useStoreSettingsSelector from "./useStoreSettingsSelector";
import useStoreSessionSelector from "./useStoreSessionSelector";
import { mapExchangeConnectionToCoinRayId } from "../tradingView/tradingViewOptions";
import { useDispatch } from "react-redux";
import { showErrorAlert } from "../store/actions/ui";

/**
 * @typedef {any} IBasicDataFeed
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
  const dispatch = useDispatch();

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
        dispatch(showErrorAlert(error));
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
      dispatch(showErrorAlert(error));
    }

    return [];
  };

  // Get a CoinRay token.
  const resolveDataDependencies = () => {
    const tokenPromise = getCoinrayToken();
    const marketDataPromise = getMarketData();
    const exchangeKey = mapExchangeConnectionToCoinRayId(storeSettings.selectedExchange);
    const exchangeName =
      storeSettings.selectedExchange.exchangeName || storeSettings.selectedExchange.name;
    const exchangeInternalId = storeSettings.selectedExchange.internalId;

    if (symbol && (!dataFeed || exchangeInternalId !== dataFeed.internalExchangeId)) {
      Promise.all([tokenPromise, marketDataPromise])
        .then((data) => {
          const coinRayToken = data[0];
          const marketSymbolsData = data[1];

          const options = {
            exchange: exchangeName,
            exchangeKey,
            internalExchangeId: storeSettings.selectedExchange.internalId,
            symbol,
            symbolsData: marketSymbolsData,
            tradeApiToken: storeSession.tradeApi.accessToken,
            coinRayToken: coinRayToken,
            regenerateAccessToken: getCoinrayToken,
          };

          setDataFeed(new CoinRayDataFeed(options));
        })
        .catch((e) => {
          dispatch(showErrorAlert(e));
        });
    }
  };

  useEffect(resolveDataDependencies, [storeSettings.selectedExchange, symbol]);

  return dataFeed;
};

export default useCoinRayDataFeedFactory;

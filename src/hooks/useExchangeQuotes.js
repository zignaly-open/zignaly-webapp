import { useState, useEffect } from "react";
import useStoreSessionSelector from "./useStoreSessionSelector";
import tradeApi from "../services/tradeApiClient";
import { useDispatch } from "react-redux";
import { showErrorAlert } from "../store/actions/ui";

/**
 * @typedef {import("../services/tradeApiClient.types").QuoteAssetsDict} QuoteAssetsDict
 * @typedef {Object} ExchangeData
 * @property {string} exchangeId
 * @property {string} exchangeType
 */

/**
 * @typedef {Object} ExchangeQuotesHookData
 * @property {QuoteAssetsDict} quoteAssets
 * @property {Boolean} quotesLoading
 */

/**
 * Provides quotes assets.
 * @param {ExchangeData} exchangeData Exchange internal id.
 * @param {boolean} [shouldExecute] Flag to indicate if we should execute the request.
 * @returns {ExchangeQuotesHookData} Quote Assets.
 */
const useExchangeQuotes = (exchangeData, shouldExecute = true) => {
  const [quoteAssets, setQuotes] = useState({});
  const [quotesLoading, setLoading] = useState(false);

  const storeSession = useStoreSessionSelector();
  const dispatch = useDispatch();
  const loadData = () => {
    if (
      shouldExecute &&
      storeSession.tradeApi.accessToken &&
      exchangeData.exchangeId &&
      exchangeData.exchangeType
    ) {
      setLoading(true);
      let payload = {
        token: storeSession.tradeApi.accessToken,
        ro: true,
        version: 2,
        exchangeId: exchangeData.exchangeId,
        exchangeType: exchangeData.exchangeType,
      };

      tradeApi
        .quotesAssetsGet(payload)
        .then((data) => {
          setQuotes(data);
        })
        .catch((e) => {
          dispatch(showErrorAlert(e));
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  useEffect(loadData, [
    storeSession.tradeApi.accessToken,
    exchangeData.exchangeId,
    exchangeData.exchangeType,
    shouldExecute,
  ]);

  return {
    quoteAssets: quoteAssets,
    quotesLoading: quotesLoading,
  };
};

export default useExchangeQuotes;

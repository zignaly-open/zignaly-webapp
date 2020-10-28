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
 * Provides quotes assets.
 * @param {ExchangeData} exchangeData Exchange internal id.
 * @param {boolean} [shouldExecute] Flag to indicate if we should execute the request.
 * @returns {QuoteAssetsDict} Quote Assets.
 */
const useBaseExchangeQuotes = (exchangeData, shouldExecute = true) => {
  const [quotes, setQuotes] = useState({});

  const storeSession = useStoreSessionSelector();
  const dispatch = useDispatch();
  const loadData = () => {
    if (shouldExecute && exchangeData.exchangeId && exchangeData.exchangeType) {
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
        });
    }
  };

  useEffect(loadData, [
    storeSession.tradeApi.accessToken,
    exchangeData.exchangeId,
    exchangeData.exchangeType,
    shouldExecute,
  ]);

  return quotes;
};

export default useBaseExchangeQuotes;

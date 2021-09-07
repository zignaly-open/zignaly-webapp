import { useState, useEffect, useContext } from "react";
import tradeApi from "../services/tradeApiClient";
import { useDispatch } from "react-redux";
import { showErrorAlert } from "../store/actions/ui";
import PrivateAreaContext from "context/PrivateAreaContext";

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
  const { quotesMap, setQuotesMapData } = useContext(PrivateAreaContext);
  const mapKey = `${exchangeData.exchangeId}-${exchangeData.exchangeType}`;

  const dispatch = useDispatch();

  const loadData = () => {
    if (shouldExecute && exchangeData.exchangeId && exchangeData.exchangeType) {
      if (quotesMap[mapKey]) {
        setQuotes(quotesMap[mapKey]);
        return;
      }
      setLoading(true);
      let payload = {
        exchangeId: exchangeData.exchangeId,
        exchangeType: exchangeData.exchangeType,
      };

      tradeApi
        .quotesAssetsGet(payload)
        .then((data) => {
          setQuotes(data);
          const map = { ...quotesMap };
          map[mapKey] = data;
          setQuotesMapData(map);
        })
        .catch((e) => {
          dispatch(showErrorAlert(e));
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  useEffect(loadData, [exchangeData.exchangeId, exchangeData.exchangeType, shouldExecute]);

  return {
    quoteAssets: quoteAssets,
    quotesLoading: quotesLoading,
  };
};

export default useExchangeQuotes;

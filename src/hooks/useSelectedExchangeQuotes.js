import { useState, useEffect } from "react";
import tradeApi from "../services/tradeApiClient";
import { useDispatch } from "react-redux";
import { showErrorAlert } from "../store/actions/ui";

/**
 * @typedef {import("../services/tradeApiClient.types").QuoteAssetsDict} QuoteAssetsDict
 */

/**
 * Provides quotes assets.
 * @param {string} exchangeInternalId Exchange internal id.
 * @param {boolean} [shouldExecute] Flag to indicate if we should execute the request.
 * @returns {QuoteAssetsDict} Quote Assets.
 */
const useSelectedExchangeQuotes = (exchangeInternalId, shouldExecute = true) => {
  const [quotes, setQuotes] = useState({});

  const dispatch = useDispatch();
  const loadData = () => {
    if (shouldExecute && exchangeInternalId) {
      let payload = {
        exchangeInternalId: exchangeInternalId,
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

  useEffect(loadData, [exchangeInternalId, shouldExecute]);

  return quotes;
};

export default useSelectedExchangeQuotes;

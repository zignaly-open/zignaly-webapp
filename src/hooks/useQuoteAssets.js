import { useState, useEffect } from "react";
import useStoreSessionSelector from "./useStoreSessionSelector";
import tradeApi from "../services/tradeApiClient";

/**
 * @typedef {import("../services/tradeApiClient.types").QuoteAssetsDict} QuoteAssetsDict
 */

/**
 * Provides quotes assets.
 *
 * @returns {QuoteAssetsDict} Quote Assets.
 */
const useQuoteAssets = () => {
  const [quotes, setQuotes] = useState({});

  const storeSession = useStoreSessionSelector();

  const loadData = () => {
    const payload = {
      token: storeSession.tradeApi.accessToken,
      ro: true,
    };

    tradeApi
      .quotesAssetsGet(payload)
      .then((data) => {
        setQuotes(data);
      })
      .catch((e) => {
        alert(`ERROR: ${e.message}`);
      });
  };

  useEffect(loadData, [storeSession.tradeApi.accessToken]);

  return quotes;
};

export default useQuoteAssets;

import { useState, useEffect } from "react";
import useStoreSessionSelector from "./useStoreSessionSelector";
import tradeApi from "../services/tradeApiClient";
import useStoreSettingsSelector from "./useStoreSettingsSelector";

/**
 * @typedef {import("../services/tradeApiClient.types").QuoteAssetsDict} QuoteAssetsDict
 */

/**
 * Provides quotes assets.
 * @param {boolean} [shouldExecute] Flag to indicate if we should execute the request.
 * @returns {QuoteAssetsDict} Quote Assets.
 */
const useQuoteAssets = (shouldExecute = true) => {
  const [quotes, setQuotes] = useState({});

  const storeSession = useStoreSessionSelector();
  const storeSettings = useStoreSettingsSelector();

  useEffect(() => {
    const loadData = async () => {
      const payload = {
        token: storeSession.tradeApi.accessToken,
        exchangeInternalId: storeSettings.selectedExchange.internalId,
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
    if (shouldExecute) {
      loadData();
    }
  }, [storeSession.tradeApi.accessToken, shouldExecute]);

  return quotes;
};

export default useQuoteAssets;

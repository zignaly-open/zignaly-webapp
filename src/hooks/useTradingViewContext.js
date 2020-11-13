import { useState } from "react";

/**
 * @typedef {import("components/TradingTerminal/TradingView/TradingViewContext").TradingViewContext} TradingViewContext
 */

/**
 * Handle the state management for the trading view data that is shared via context.
 *
 * @returns {TradingViewContext} Modal path state object.
 */
const useTradingViewContext = () => {
  const [providerService, setProviderService] = useState(null);
  const [updatedAt, setUpdatedAt] = useState(null);
  const [lastPrice, setLastPrice] = useState(null);

  return {
    providerService,
    setProviderService,
    updatedAt,
    setUpdatedAt,
    lastPrice,
    setLastPrice,
  };
};

export default useTradingViewContext;

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

  return {
    providerService,
    setProviderService,
  };
};

export default useTradingViewContext;

import React from "react";

/**
 * @typedef {import("services/tradeApiClient.types").CopyTradersProvidersOption} CopyTradersProvidersOption
 */

/**
 * @typedef {Object} TradingViewContext
 * @property {CopyTradersProvidersOption} providerService
 * @property {function} setProviderService
 */

export default React.createContext(/** @type {TradingViewContext} **/ ({}));

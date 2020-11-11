import React from "react";

/**
 * @typedef {import("services/tradeApiClient.types").CopyTradersProvidersOption} CopyTradersProvidersOption
 */

/**
 * @typedef {Object} TradingViewContext
 * @property {CopyTradersProvidersOption} providerService
 * @property {function} setProviderService
 * @property {number} updatedAt
 * @property {function} setUpdatedAt
 * @property {number} lastPrice
 * @property {function} setLastPrice
 */

export default React.createContext(/** @type {TradingViewContext} **/ ({}));

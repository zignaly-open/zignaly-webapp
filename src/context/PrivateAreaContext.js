import React from "react";

/**
 * @typedef {import('../services/tradeApiClient.types').QuoteAssetsDict} QuoteAssetsDict
 * @typedef {Object<string, QuoteAssetsDict>} QuotesMapObject
 * @property {Object.<string, QuoteAssetsDict>} data
 */

/**
 * @typedef {Object} PrivateAreaContextObject
 * @property {Number} providerCount
 * @property {React.SetStateAction<*>} setProviderCount
 * @property {QuotesMapObject} quotesMap
 * @property {React.SetStateAction<*>} setQuotesMapData
 */

export default React.createContext(/** @type {Partial<PrivateAreaContextObject>} **/ ({}));

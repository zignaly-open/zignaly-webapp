import React from "react";

/**
 * @typedef {import('../services/tradeApiClient.types').QuoteAssetsDict} QuoteAssetsDict
 * @typedef {import('../services/tradeApiClient.types').ExchangeListEntity} ExchangeListEntity
 * @typedef {Object<string, QuoteAssetsDict>} QuotesMapObject
 * @property {Object.<string, QuoteAssetsDict>} data
 */

/**
 * @typedef {Object} PrivateAreaContextObject
 * @property {Number} providerCount
 * @property {React.SetStateAction<*>} setProviderCount
 * @property {QuotesMapObject} quotesMap
 * @property {React.SetStateAction<*>} setQuotesMapData
 * @property {Array<ExchangeListEntity>} exchangeList
 * @property {React.SetStateAction<*>} setExchangeList
 */

export default React.createContext(/** @type {Partial<PrivateAreaContextObject>} **/ ({}));

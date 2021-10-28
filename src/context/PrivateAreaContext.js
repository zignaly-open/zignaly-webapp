import React from "react";

/**
 * @typedef {import('../services/tradeApiClient.types').QuoteAssetsDict} QuoteAssetsDict
 * @typedef {import('../services/tradeApiClient.types').ExchangeListEntity} ExchangeListEntity
 * @typedef {import('../services/tradeApiClient.types').UserBalanceEntity} UserBalanceEntity
 * @typedef {import('../services/tradeApiClient.types').HasBeenUsedProviderEntity} HasBeenUsedProviderEntity
 * @typedef {Object<string, QuoteAssetsDict>} QuotesMapObject
 * @property {Object.<string, QuoteAssetsDict>} data
 */

/**
 * @typedef {Object} PrivateAreaContextObject
 * @property {UserBalanceEntity} balance
 * @property {React.SetStateAction<*>} setBalance
 * @property {WalletBalance} walletBalance
 * @property {React.SetStateAction<*>} setWalletBalance
 * @property {QuotesMapObject} quotesMap
 * @property {React.SetStateAction<*>} setQuotesMapData
 * @property {Array<ExchangeListEntity>} exchangeList
 * @property {React.SetStateAction<*>} setExchangeList
 * @property {React.SetStateAction<*>} setUserProviders
 * @property {Array<HasBeenUsedProviderEntity>} userProviders
 * @property {Array<HasBeenUsedProviderEntity>} connectedProviders
 */

export default React.createContext(/** @type {Partial<PrivateAreaContextObject>} **/ ({}));

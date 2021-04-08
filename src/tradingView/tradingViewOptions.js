/* eslint-disable camelcase */

import VcceDataFeed from "services/dataFeed/vcceDataFeed";
import AscendexDataFeed from "services/dataFeed/ascendexDataFeed";

/**
 * @typedef {import("../services/tradeApiClient.types").ExchangeConnectionEntity} ExchangeConnectionEntity
 * @typedef {import("tradingView/charting_library/charting_library").ChartingLibraryWidgetOptions} ChartingLibraryWidgetOptions
 * @typedef {import("tradingView/charting_library/charting_library").IBasicDataFeed} IBasicDataFeed
 * @typedef {import("services//tradeApiClient.types").MarketSymbolsCollection} MarketSymbolsCollection
 * @typedef {import("services/dataFeed/dataFeed").DataFeedOptions} DataFeedOptions
 */

/**
 * @typedef {ChartingLibraryWidgetOptions['datafeed']} DataFeed
 */

/**
 * @typedef {Object} WidgetOptions
 * @property {String} tradeApiToken Trade API access token.
 * @property {MarketSymbolsCollection} symbolsData Exchange market symbols data.
 * @property {string} symbol Crypto currency symbol.
 * @property {boolean} darkStyle Dark style flag.
 * @property {ExchangeConnectionEntity} exchange Exchange connection entity.
 */

/**
 * Map exchange connection to CoinRay exchange ID.
 *
 * @export
 * @param {ExchangeConnectionEntity} exchangeConnection Exchange connection entity.
 * @returns {string} Coinray exchange ID.
 */
export function mapExchangeConnectionToCoinRayId(exchangeConnection) {
  // When not valid exchange object fallback to Binance.
  if (!exchangeConnection || !exchangeConnection.exchangeName) {
    return "BINA";
  }

  // When not defined default to spot.
  if (!exchangeConnection.exchangeType) {
    exchangeConnection.exchangeType = "spot";
  }

  const exchangeName = exchangeConnection.exchangeName.toUpperCase();
  const exchangeType = exchangeConnection.exchangeType.toUpperCase();

  if (exchangeName === "BINANCE") {
    if (exchangeType === "FUTURES") {
      return "BIFU";
    }

    return "BINA";
  }

  if (exchangeName === "KUCOIN") {
    return "KUCN";
  }

  if (exchangeName === "ZIGNALY") {
    if (exchangeType === "FUTURES") {
      return "BIFU";
    }

    return "BINA";
  }

  // Fallback to Binance when none of above conditions are met.
  return "BINA";
}

/**
 * Map exchange connection to Trading View exchange ID.
 *
 * @export
 * @param {string} exchangeName Exchange name.
 * @returns {string} Coinray exchange ID.
 */
export function mapExchangeConnectionToTradingViewId(exchangeName) {
  // When not valid exchange object fallback to Binance.
  if (!exchangeName) {
    return "BINANCE";
  }

  const exchangeNameNormalized = exchangeName.toUpperCase();

  if (exchangeNameNormalized === "ZIGNALY") {
    return "BINANCE";
  }

  return exchangeNameNormalized;
}

/**
 * Generate trading view symbol with exchange id
 *
 * @export
 * @param {string} tradeViewSymbol Symbol
 * @param {ExchangeConnectionEntity} exchange Exchange connection entity.
 * @returns {string} TradingView Symbol with exchange id
 */
export function getTradingViewExchangeSymbol(tradeViewSymbol, exchange) {
  const symbolSuffix =
    exchange.exchangeName.toLowerCase() !== "bitmex" && exchange.exchangeType === "futures"
      ? "PERP"
      : "";
  const symbolCode = tradeViewSymbol + symbolSuffix;
  const exchangeId = mapExchangeConnectionToTradingViewId(exchange.exchangeName || exchange.name);
  return `${exchangeId}:${symbolCode}`;
}

/**
 * Creates an instance of VcceDataFeed.
 * @param {DataFeedOptions} options Construct options.
 * @returns {DataFeed} Exchange data feed
 */
const createDataFeed = (options) => {
  let dataFeed = null;
  if (options.exchange.exchangeName.toLowerCase() === "vccee") {
    dataFeed = new VcceDataFeed(options);
  } else if (options.exchange.exchangeName.toLowerCase() === "vcce") {
    dataFeed = new AscendexDataFeed(options);
  }

  // @ts-ignore
  return dataFeed;
};

/**
 * Create Trading View data feed configuration.
 *
 * @param {WidgetOptions} options Configuration to create Trading View widget options
 *
 * @returns {ChartingLibraryWidgetOptions} Data feed options.
 */
export function createWidgetOptions(options) {
  const { exchange, symbolsData, symbol, tradeApiToken, darkStyle } = options;
  const dataFeedOptions = {
    exchange,
    symbolsData,
    tradeApiToken,
  };
  const feed = createDataFeed(dataFeedOptions);

  return {
    ...(feed && {
      // Load market data to the self hosted charting library
      datafeed: feed,
      library_path: process.env.GATSBY_BASE_PATH + "/charting_library/charting_library/",
    }),
    autosize: true,
    charts_storage_api_version: "1.1",
    charts_storage_url: "https://saveload.tradingview.com",
    client_id: "tradingview.com",
    container_id: "trading_view_chart",
    disabled_features: ["header_symbol_search"],
    enabled_features: [
      "use_localstorage_for_settings",
      "save_chart_properties_to_local_storage",
      "countdown",
    ],
    fullscreen: false,
    hide_side_toolbar: false,
    // @ts-ignore
    interval: "30",
    locale: "en",
    studies_overrides: {},
    // For external hosted widget, we should prefix the symbol with the exchange using getTradingViewExchangeSymbol
    // However for some reason we won't receive the quoteUpdate events, so we have to update the symbol after init.
    symbol,
    // @ts-ignore
    theme: darkStyle ? "dark" : "light",
    user_id: "public_user_id",
    // @ts-ignore
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  };
}

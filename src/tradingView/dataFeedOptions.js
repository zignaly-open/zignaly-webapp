/* eslint-disable camelcase */

/**
 * @typedef {import("../services/tradeApiClient.types").ExchangeConnectionEntity} ExchangeConnectionEntity
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
 * @param {ExchangeConnectionEntity} exchangeConnection Exchange connection entity.
 * @returns {string} TradingView Symbol with exchange id
 */
export function getTradingViewExchangeSymbol(tradeViewSymbol, exchangeConnection) {
  const symbolSuffix =
    exchangeConnection.exchangeName.toLowerCase() !== "bitmex" &&
    exchangeConnection.exchangeType === "futures"
      ? "PERP"
      : "";
  const symbolCode = tradeViewSymbol + symbolSuffix;
  const exchangeId = mapExchangeConnectionToTradingViewId(exchangeConnection.exchangeName);
  return `${exchangeId}:${symbolCode}`;
}

/**
 * Create Trading View data feed configuration.
 *
 * @param {string} symbol Crypto currency symbol.
 * @param {boolean} darkStyle Dark style flag.
 *
 * @returns {Object<string, any>} Data feed options.
 */
export function createWidgetOptions(symbol, darkStyle) {
  return {
    // datafeed: dataFeed,
    // library_path: process.env.GATSBY_BASE_PATH + "/charting_library/",
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
    interval: "30",
    locale: "en",
    studies_overrides: {},
    symbol,
    theme: darkStyle ? "dark" : "light",
    user_id: "public_user_id",
  };
}

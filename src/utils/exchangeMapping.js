/**
 * @typedef {import("../services/tradeApiClient.types").ExchangeConnectionEntity} ExchangeConnectionEntity
 */

/**
 * Map exchange connection to CoinRay exchange ID.
 *
 * @export
 * @param {ExchangeConnectionEntity} exchange Exchange connection entity.
 * @returns {string} Coinray exchange ID.
 */
export function mapExchangeConnectionToCoinRayId(exchange) {
  // When not valid exchange object fallback to Binance.
  if (!exchange || !exchange.exchangeName) {
    return "BINA";
  }

  // When not defined default to spot.
  if (!exchange.exchangeType) {
    exchange.exchangeType = "spot";
  }

  const exchangeName = exchange.exchangeName.toUpperCase();
  const exchangeType = exchange.exchangeType.toUpperCase();

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

import dayjs from "dayjs";
import { resolutionToMilliseconds } from "utils/timeConvert";
import DataFeed from "./dataFeed";

/**
 * @typedef {Array<*>} Candle
 */

/**
 * @typedef {import("services/tradeApiClient.types").MarketSymbol} MarketSymbol
 * @typedef {import("services/tradeApiClient.types").ExchangeConnectionEntity} ExchangeConnectionEntity
 * @typedef {import("services/tradeApiClient.types").MarketSymbolsCollection} MarketSymbolsCollection
 * @typedef {import("tradingView/charting_library/charting_library").OnReadyCallback} OnReadyCallback
 * @typedef {import("tradingView/charting_library/charting_library").ServerTimeCallback} ServerTimeCallback
 * @typedef {import("tradingView/charting_library/charting_library").SearchSymbolsCallback} SearchSymbolsCallback
 * @typedef {import("tradingView/charting_library/charting_library").ResolveCallback} ResolveCallback
 * @typedef {import("tradingView/charting_library/charting_library").ErrorCallback} ErrorCallback
 * @typedef {import("tradingView/charting_library/charting_library").HistoryCallback} HistoryCallback
 * @typedef {import("tradingView/charting_library/charting_library").Bar} Bar
 * @typedef {import("tradingView/charting_library/charting_library").SubscribeBarsCallback} SubscribeBarsCallback
 * @typedef {import("tradingView/charting_library/charting_library").LibrarySymbolInfo} LibrarySymbolInfo
 * @typedef {import("tradingView/charting_library/charting_library").PeriodParams} PeriodParams
 */

/**
 * Prices data feed from CoinRay provider.
 *
 * @property {TradeApiClient} tradeApi API client.
 * @returns {IBasicDataFeed} Trading View Chart data feed.
 */
class VcceDataFeed extends DataFeed {
  /**
   * Get price candles for selected symbol.
   *
   * @param {string} base Symbol base currency.
   * @param {string} quote Symbol quote currency.
   * @param {string|number} resolution Data resolution.
   * @param {number} startTime Get data since.
   * @param {number} [endTime] Get data to.
   * @returns {Promise<Candle>} Promise that resolve candle data.
   * @memberof VcceDataFeed
   */
  // eslint-disable-next-line max-params
  async getCandlesData(base, quote, resolution, startTime, endTime) {
    let endpointPath = `/tradingview?lang=en&coin=${base}&currency=${quote}&resolution=${resolution}&from=${startTime}`;
    if (endTime) {
      endpointPath += `&to=${endTime}`;
    }
    const requestUrl = this.baseUrl + endpointPath;

    try {
      const response = await fetch(requestUrl);
      const candles = await response.json();

      return candles;
      // return JSON.parse(candles.contents);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(`Get candles data error: ${error.message}`);
    }

    return [];
  }

  /**
   * Parse api candle bars
   * @param {*} candle VCCE Candle
   * @returns {*} New candle
   */
  parseOHLCV(candle) {
    return {
      time: parseFloat(candle.time),
      open: parseFloat(candle.open),
      high: parseFloat(candle.high),
      low: parseFloat(candle.low),
      close: parseFloat(candle.close),
      volume: parseFloat(candle.volume),
    };
  }

  /**
   * Get price bar for a given symbol.
   *
   * @param {MarketSymbol} symbolData Market symbol data.
   * @param {string} resolution Data resolution.
   * @param {PeriodParams} periodParams Selected period.
   * @returns {Promise<Candle>} Promise.
   */
  getBarsRequest(symbolData, resolution, periodParams) {
    const { from: startDate, to: endDate, firstDataRequest } = periodParams;

    return this.getCandlesData(
      // @ts-ignore
      symbolData.base.toLowerCase(),
      // @ts-ignore
      symbolData.quote.toLowerCase(),
      resolutionToMilliseconds(resolution),
      startDate,
      firstDataRequest ? endDate : dayjs.unix(endDate).startOf("minute").unix(),
    ).then((newCandles) => {
      return newCandles.map(this.parseOHLCV);
    });
  }

  /**
   * Call request to get latest candle price data.
   *
   * @param {LibrarySymbolInfo} symbolData Market symbol data.
   * @param {string} resolution Prices data resolution.
   * @returns {Promise<Bar>} Promise.
   */
  refreshBarRequest(symbolData, resolution) {
    return this.getCandlesData(
      // @ts-ignore
      symbolData.base.toLowerCase(),
      // @ts-ignore
      symbolData.quote.toLowerCase(),
      resolutionToMilliseconds(resolution),
      this.startDate,
      dayjs().startOf("minute").unix(),
    ).then((candles) => {
      if (candles.length) {
        const lastCandle = candles[candles.length - 1];
        return this.parseOHLCV(lastCandle);
      }
    });
  }
}

export default VcceDataFeed;

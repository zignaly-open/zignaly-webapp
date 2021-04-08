import dayjs from "dayjs";
import DataFeed from "./dataFeed";

/**
 * @typedef {Object} CandleData
 * @property {Number} code
 * @property {Array<*>} data
 */

/**
 * @typedef {import("./dataFeed").Candle} Candle
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
 * @inheritdoc
 */
class AscendexDataFeed extends DataFeed {
  /**
   * Get price candles for selected symbol.
   *
   * @param {string} base Symbol base currency.
   * @param {string} quote Symbol quote currency.
   * @param {string|number} resolution Data resolution.
   * @param {number} startTime Get data since.
   * @param {number} [endTime] Get data to.
   * @returns {Promise<CandleData>} Promise that resolve candle data.
   * @memberof AscendexDataFeed
   */
  // eslint-disable-next-line max-params
  async getCandlesData(base, quote, resolution, startTime, endTime) {
    let endpointPath = `/tradingview/ascendex?symbol=${base}/${quote}&interval=${resolution}&from=${startTime}`;
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

    return null;
  }

  /**
   * Parse api candle bars
   * @param {*} candle VCCE Candle
   * @returns {*} New candle
   */
  parseOHLCV(candle) {
    return {
      time: parseFloat(candle.ts),
      open: parseFloat(candle.o),
      high: parseFloat(candle.h),
      low: parseFloat(candle.l),
      close: parseFloat(candle.c),
      volume: parseFloat(candle.v),
    };
  }

  /**
   * Get price bar for a given symbol.
   *
   * @param {MarketSymbol} symbolData Market symbol data.
   * @param {string} resolution Data resolution.
   * @param {PeriodParams} periodParams Selected period.
   * @returns {Promise<Candle>} None.
   */
  getBarsRequest(symbolData, resolution, periodParams) {
    const { from: startDate, to: endDate, firstDataRequest } = periodParams;

    return this.getCandlesData(
      // @ts-ignore
      symbolData.base.toUpperCase(),
      // @ts-ignore
      symbolData.quote.toUpperCase(),
      resolution,
      startDate * 1000,
      firstDataRequest ? endDate * 1000 : dayjs.unix(endDate).startOf("minute").valueOf(),
    ).then((newCandles) => {
      return newCandles ? newCandles.data.map((d) => this.parseOHLCV(d.data)) : [];
    });
  }

  /**
   * Call request to get latest candle price data.
   *
   * @param {LibrarySymbolInfo} symbolData Market symbol data.
   * @param {string} resolution Prices data resolution.
   * @returns {Promise<Bar>} Promise.
   * @abstract
   */
  refreshBarRequest(symbolData, resolution) {
    return this.getCandlesData(
      // @ts-ignore
      symbolData.base.toUpperCase(),
      // @ts-ignore
      symbolData.quote.toUpperCase(),
      resolution,
      this.startDate * 1000,
      dayjs().startOf("minute").valueOf(),
    ).then((candles) => {
      if (candles && candles.data.length) {
        const lastCandle = candles.data[candles.data.length - 1];
        return this.parseOHLCV(lastCandle.data);
      }
    });
  }
}

export default AscendexDataFeed;

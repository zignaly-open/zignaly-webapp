import { isEmpty, last } from "lodash";
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
   * @param {number} startDate Get data since.
   * @param {number} endDate Get data to.
   * @param {HistoryCallback} onResultCallback Notify data.
   * @param {ErrorCallback} onErrorCallback Notify error.
   * @param {boolean} firstDataRequest First request boolean.
   * @returns {Void} None.
   * @memberof VcceDataFeed
   */
  // eslint-disable-next-line max-params
  getBars(
    symbolData,
    resolution,
    startDate,
    endDate,
    onResultCallback,
    onErrorCallback,
    firstDataRequest,
  ) {
    this.allCandles = [];

    /**
     * Notify symbol prices in Trading View bars format so chart widget.
     *
     * @param {Bar[]} formattedCandles Candles in TV bar object format.
     * @returns {Void} None.
     */
    const notifyPricesData = (formattedCandles) => {
      if (this.allCandles.length === 0) {
        onResultCallback([], { noData: true });
      } else {
        onResultCallback(formattedCandles, {
          noData: false,
        });
      }
    };

    if (firstDataRequest) {
      // Store date, this will be used for the interval requests to get live candle.
      // We need it for performance reasons because the reply will be cached.
      this.startDate = startDate;
    }

    this.getCandlesData(
      // @ts-ignore
      symbolData.base.toLowerCase(),
      // @ts-ignore
      symbolData.quote.toLowerCase(),
      resolutionToMilliseconds(resolution),
      startDate,
      endDate,
    )
      .then((newCandles) => {
        // Accumulate candles.
        this.allCandles = this.allCandles.concat(newCandles);

        const formattedCandles = this.allCandles.map(this.parseOHLCV);
        notifyPricesData(formattedCandles);
      })
      .catch((e) => {
        onErrorCallback(`ERROR: ${e.message}`);
      });
  }

  /**
   * Interval requests to get live data
   *
   * @param {LibrarySymbolInfo} symbolData Market symbol data.
   * @param {string} resolution Prices data resolution.
   * @param {SubscribeBarsCallback} onRealtimeCallback Notify tick to chart.
   * @returns {Void} None.
   *
   * @memberof VcceDataFeed
   */
  // eslint-disable-next-line max-params
  subscribeBars(symbolData, resolution, onRealtimeCallback) {
    const refreshCandle = () => {
      this.getCandlesData(
        // @ts-ignore
        symbolData.base.toLowerCase(),
        // @ts-ignore
        symbolData.quote.toLowerCase(),
        resolutionToMilliseconds(resolution),
        this.startDate,
      )
        .then((candles) => {
          if (candles.length) {
            const lastCandle = candles[candles.length - 1];
            onRealtimeCallback(this.parseOHLCV(lastCandle));
          }
        })
        .catch((e) => {
          // eslint-disable-next-line no-console
          console.error(`ERROR: ${e.message}`);
        });
    };
    this.candleSubscription = setInterval(refreshCandle, 15000);
  }

  /**
   * Unsubscribe from interval request
   *
   * @returns {Void} None.
   * @memberof VcceDataFeed
   */
  unsubscribeBars() {
    clearInterval(this.candleSubscription);
  }

  /**
   * Get last price.
   *
   * @returns {number} Price.
   * @memberof VcceDataFeed
   */
  getLastPrice() {
    if (isEmpty(this.allCandles)) {
      return null;
    }

    // @ts-ignore
    return last(this.allCandles).close;
  }
}

export default VcceDataFeed;

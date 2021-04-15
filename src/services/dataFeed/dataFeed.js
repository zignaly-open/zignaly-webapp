/**
 * Tutorial: https://github.com/tradingview/charting-library-tutorial/blob/master/documentation/integration.md
 * Full implementation: https://github.com/tradingview/charting_library/wiki/JS-Api#how-to-start
 * Tutorial implementation: https://github.com/tradingview/charting-library-tutorial/blob/master/documentation/datafeed-implementation.md
 * Stream implementation: https://github.com/tradingview/charting-library-tutorial/blob/master/documentation/streaming-implementation.md
 * TradingView JS API Binance Example: https://github.com/marcius-studio/tradingview-jsapi-binance/blob/master/client/src/components/api/index.js
 */

/* eslint-disable camelcase */
import { isEmpty, last } from "lodash";

/**
 *
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
 * @typedef {Array<Bar>} Candle
 */

/**
 * @typedef {Object} DataFeedOptions
 * @property {ExchangeConnectionEntity} exchange
 * @property {MarketSymbolsCollection} symbolsData Exchange market symbols data.
 * @property {string} tradeApiToken
 */

/**
 * Prices data feed from CoinRay provider.
 *
 * @abstract
 * @property {TradeApiClient} tradeApi API client.
 * @returns {IBasicDataFeed} Trading View Chart data feed.
 */
class DataFeed {
  /**
   * Creates an instance of DataFeed.
   * @param {DataFeedOptions} options Construct options.
   * @memberof DataFeed
   */
  constructor(options) {
    this.symbolsData = options.symbolsData || null;
    this.tradeApiToken = options.tradeApiToken;
    this.exchange = options.exchange.exchangeName || "";
    this.baseUrl = process.env.GATSBY_TRADEAPI_URL.replace("/api", "");

    /**
     * @type Candle
     */
    this.allCandles = [];
  }

  /**
   * On ready callback.
   *
   * @param {OnReadyCallback} callback On ready callback.
   * @returns {Void} None.
   * @memberof DataFeed
   */
  onReady(callback) {
    const resolutions = ["1", "5", "15", "30", "60", "120", "240", "360", "720", "D", "W"];

    setTimeout(() => {
      // Notify to Trading View which options are supported.
      callback({
        supports_marks: false,
        supports_timescale_marks: false,
        // Countdown in the price scale, require current server time endpoint
        supports_time: false,
        // @ts-ignore
        supported_resolutions: resolutions,
      });
    }, 0);
  }

  // /**
  //  * Get server time used to align timeserie in time axes.
  //  *
  //  * @param {ServerTimeCallback} callback Server time callback.
  //  * @returns {Void} None.
  //  * @memberof DataFeed
  //  */
  // getServerTime(callback) {
  //   tradeApi
  //     .serverTimeGet({
  //       token: this.tradeApiToken,
  //     })
  //     .then((data) => {
  //       callback(Math.floor(data.serverTime / 1000));
  //     })
  //     .catch(() => {
  //       callback(Math.floor(+new Date() / 1000));
  //     });
  // }

  // /**
  //  * Search market symbol data by widget search input value.
  //  *
  //  * @param {String} userInput Input value typed by user.
  //  * @param {String} exchange Exchange name.
  //  * @param {String} symbolType Symbol type.
  //  * @param {SearchSymbolsCallback} onResultReadyCallback Callback to resolve symbol match.
  //  * @returns {Void} None.
  //  * @memberof DataFeed
  //  */
  // eslint-disable-next-line max-params
  // searchSymbols(userInput, exchange, symbolType, onResultReadyCallback) {
  //   userInput = userInput.toUpperCase();
  //   const symbolFound = this.symbolsData
  //     .filter((symbolData) => symbolData.symbol === userInput.toUpperCase())
  //     .map((symbol) => {
  //       const symbolBaseQuote = symbol.base + symbol.quote;

  //       // Exchange and type are not enabled.
  //       return {
  //         exchange: "",
  //         type: "",
  //         symbol: symbolBaseQuote,
  //         full_name: symbolBaseQuote,
  //         description: symbol.base + " / " + symbol.quote,
  //         ticker: symbolBaseQuote,
  //       };
  //     });

  //   onResultReadyCallback(symbolFound);
  // }

  /**
   * Resolve symbol data with structure required by Trading View chart.
   *
   * @param {string} symbol Symbol code.
   * @param {ResolveCallback} onSymbolResolvedCallback Notify symbol resolved.
   * @param {ErrorCallback} onResolveErrorCallback Notify symbol resolve error.
   * @returns {Void} None.
   * @memberof DataFeed
   */
  resolveSymbol(symbol, onSymbolResolvedCallback, onResolveErrorCallback) {
    for (let symbolData of this.symbolsData) {
      const symbolBaseQuote = symbolData.base + symbolData.quote;
      const pricescale = Math.round(1 / symbolData.limits.price.min);

      if (symbolData.tradeViewSymbol.toLowerCase() === symbol.toLowerCase()) {
        /**
         * @type LibrarySymbolInfo
         */
        const symbolFound = {
          base_name: [symbolData.base],
          // @ts-ignore
          base: symbolData.unitsAmount,
          // @ts-ignore
          quote: symbolData.unitsInvestment,
          description: symbolData.symbol,
          exchange: this.exchange,
          full_name: symbolData.symbol,
          has_daily: true,
          has_intraday: true,
          has_weekly_and_monthly: true,
          listed_exchange: this.exchange,
          minmov: 1,
          name: symbolData.symbol,
          pricescale: pricescale,
          session: "24x7",
          data_status: "streaming",
          ticker: symbolBaseQuote,
          // timezone: "Etc/UTC",
          type: "spot",
        };

        setTimeout(() => {
          onSymbolResolvedCallback(symbolFound);
        }, 0);
        return;
      }
    }

    setTimeout(() => {
      onResolveErrorCallback("not found");
    });
  }

  /**
   * Get price bar for a given symbol.
   *
   * @param {MarketSymbol} symbolData Market symbol data.
   * @param {string} resolution Data resolution.
   * @param {PeriodParams} periodParams Selected period.
   * @returns {Promise<Candle>} None.
   * @abstract
   */
  // eslint-disable-next-line no-unused-vars
  getBarsRequest(symbolData, resolution, periodParams) {
    throw new Error("must be implemented by subclass!");
  }

  /**
   * Get price bar for a given symbol.
   *
   * @param {MarketSymbol} symbolData Market symbol data.
   * @param {string} resolution Data resolution.
   * @param {PeriodParams} periodParams Selected period.
   * @param {HistoryCallback} onHistoryCallback Notify data.
   * @param {ErrorCallback} onErrorCallback Notify error.
   * @returns {Void} None.
   * @memberof DataFeed
   */
  // eslint-disable-next-line max-params
  getBars(symbolData, resolution, periodParams, onHistoryCallback, onErrorCallback) {
    const { from: startDate, firstDataRequest } = periodParams;
    this.allCandles = [];

    /**
     * Notify symbol prices in Trading View bars format so chart widget.
     *
     * @param {Bar[]} formattedCandles Candles in TV bar object format.
     * @returns {Void} None.
     */
    const notifyPricesData = (formattedCandles) => {
      if (this.allCandles.length === 0) {
        onHistoryCallback([], { noData: true });
      } else {
        onHistoryCallback(formattedCandles, {
          noData: false,
        });
      }
    };

    if (firstDataRequest) {
      // Store date, this will be used for the interval requests to get live candle.
      // We need it for performance reasons because the reply will be cached.
      this.startDate = startDate;
    }

    this.getBarsRequest(symbolData, resolution, periodParams)
      .then((formattedCandles) => {
        // Accumulate candles.
        this.allCandles = this.allCandles.concat(formattedCandles);
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
   * @returns {Void} Promise.
   *
   * @memberof DataFeed
   */
  // eslint-disable-next-line max-params
  subscribeBars(symbolData, resolution, onRealtimeCallback) {
    this.candleSubscription = setInterval(() => {
      this.refreshBarRequest(symbolData, resolution)
        .then((candle) => {
          if (candle) {
            onRealtimeCallback(candle);
          }
        })
        .catch((e) => {
          // eslint-disable-next-line no-console
          console.error(`ERROR: ${e.message}`);
        });
    }, 15000);
  }

  /**
   * Call request to get latest candle price data.
   *
   * @param {LibrarySymbolInfo} symbolData Market symbol data.
   * @param {string} resolution Prices data resolution.
   * @returns {Promise<Bar>} Promise.
   * @abstract
   */
  // eslint-disable-next-line no-unused-vars
  refreshBarRequest(symbolData, resolution) {
    throw new Error("must be implemented by subclass!");
  }

  /**
   * Unsubscribe from interval request
   *
   * @returns {Void} None.
   * @memberof DataFeed
   */
  unsubscribeBars() {
    clearInterval(this.candleSubscription);
  }

  /**
   * Get last price.
   *
   * @returns {number} Price.
   * @memberof DataFeed
   */
  getLastPrice() {
    if (isEmpty(this.allCandles)) {
      return null;
    }

    // @ts-ignore
    return last(this.allCandles).close;
  }
}

export default DataFeed;

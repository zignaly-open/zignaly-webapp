/**
 * Tutorial: https://github.com/tradingview/charting-library-tutorial/blob/master/documentation/integration.md
 * Full implementation: https://github.com/tradingview/charting_library/wiki/JS-Api#how-to-start
 * Tutorial implementation: https://github.com/tradingview/charting-library-tutorial/blob/master/documentation/datafeed-implementation.md
 * Stream implementation: https://github.com/tradingview/charting-library-tutorial/blob/master/documentation/streaming-implementation.md
 * TradingView JS API Binance Example: https://github.com/marcius-studio/tradingview-jsapi-binance/blob/master/client/src/components/api/index.js
 */

/* eslint-disable camelcase */
import dayjs from "dayjs";
import tradeApi from "./tradeApiClient";
import { isEmpty, last } from "lodash";
import { minToMillisec } from "utils/timeConvert";

/**
 * @typedef {Array<string>} Candle
 */

/**
 *
 * @typedef {import("./tradeApiClient.types").MarketSymbol} MarketSymbol
 * @typedef {import("./tradeApiClient.types").ExchangeConnectionEntity} ExchangeConnectionEntity
 * @typedef {import("./tradeApiClient.types").MarketSymbolsCollection} MarketSymbolsCollection
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
 * @typedef {Object} DataFeedOptions
 * @property {ExchangeConnectionEntity} exchange
 * @property {MarketSymbolsCollection} symbolsData Exchange market symbols data.
 * @property {string} tradeApiToken
 */

/**
 * Prices data feed from CoinRay provider.
 *
 * @property {TradeApiClient} tradeApi API client.
 * @returns {IBasicDataFeed} Trading View Chart data feed.
 */
class VcceDataFeed {
  /**
   * Creates an instance of VcceDataFeed.
   * @param {DataFeedOptions} options Construct options.
   * @memberof VcceDataFeed
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
   * @memberof VcceDataFeed
   */
  onReady(callback) {
    const resolutions = ["1", "5", "15", "30", "60", "120", "240", "360", "720", "D", "W"];

    setTimeout(() => {
      // Notify to Trading View which options are supported.
      callback({
        supports_marks: false,
        supports_timescale_marks: false,
        supports_time: true,
        // @ts-ignore
        supported_resolutions: resolutions,
      });
    }, 0);
  }

  /**
   * Get server time used to align timeserie in time axes.
   *
   * @param {ServerTimeCallback} callback Server time callback.
   * @returns {Void} None.
   * @memberof VcceDataFeed
   */
  getServerTime(callback) {
    tradeApi
      .serverTimeGet({
        token: this.tradeApiToken,
      })
      .then((data) => {
        callback(Math.floor(data.serverTime / 1000));
      })
      .catch(() => {
        callback(Math.floor(+new Date() / 1000));
      });
  }

  // /**
  //  * Search market symbol data by widget search input value.
  //  *
  //  * @param {String} userInput Input value typed by user.
  //  * @param {String} exchange Exchange name.
  //  * @param {String} symbolType Symbol type.
  //  * @param {SearchSymbolsCallback} onResultReadyCallback Callback to resolve symbol match.
  //  * @returns {Void} None.
  //  * @memberof VcceDataFeed
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
   * @memberof VcceDataFeed
   */
  resolveSymbol(symbol, onSymbolResolvedCallback, onResolveErrorCallback) {
    for (let symbolData of this.symbolsData) {
      const symbolBaseQuote = symbolData.base + symbolData.quote;
      const pricescale = Math.round(1 / symbolData.limits.price.min);

      if (symbolData.tradeViewSymbol === symbol) {
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
      minToMillisec(parseInt(resolution)),
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
        minToMillisec(parseInt(resolution)),
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

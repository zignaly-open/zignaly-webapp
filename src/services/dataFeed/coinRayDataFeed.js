/* eslint-disable camelcase */
import Coinray from "coinrayjs/dist/coinray";
import tradeApi from "./tradeApiClient";
import { isEmpty, last } from "lodash";

/**
 * @typedef {Array<string>} CoinRayCandle
 */

/**
 *
 * @typedef {import("../services/tradeApiClient.types").MarketSymbolsCollection} MarketSymbolsCollection
 * @typedef {import("../services/tradeApiClient.types").MarketSymbol} MarketSymbol
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
 * @property {String} symbol symbol key to get data for.
 * @property {String} tradeApiToken Trade API access token.
 * @property {String} coinRayToken Coinray access token.
 * @property {MarketSymbolsCollection} symbolsData Exchange market symbols data.
 * @property {function(): Promise<string>} regenerateAccessToken Callback to regenerate access token when expires.
 * @property {String} exchange Exchange name.
 * @property {String} exchangeKey CoinRay exchange ID.
 * @property {String} internalExchangeId Internal exchange connection ID.
 */

/**
 * Prices data feed from CoinRay provider.
 *
 * @property {TradeApiClient} tradeApi API client.
 * @returns {IBasicDataFeed} Trading View Chart data feed.
 */
class CoinRayDataFeed {
  /**
   * Creates an instance of CoinRayDataFeed.
   * @param {DataFeedOptions} options Construct options.
   * @memberof CoinRayDataFeed
   */
  constructor(options) {
    this.symbol = options.symbol || "";
    this.symbolsData = options.symbolsData || null;
    this.coinRayToken = options.coinRayToken;
    this.tradeApiToken = options.tradeApiToken;
    this.exchange = options.exchange || "";
    this.internalExchangeId = options.internalExchangeId || "";
    this.coinray = new Coinray(options.coinRayToken);
    this.coinray.onTokenExpired(options.regenerateAccessToken);
    this.exchangeKey = options.exchangeKey || "";
    this.baseUrl = "https://coinray.io/api/v1";

    /**
     * @type CoinRayCandle[]
     */
    this.allCandles = [];
  }

  /**
   * On ready callback.
   *
   * @param {OnReadyCallback} callback On ready callback.
   * @returns {Void} None.
   * @memberof CoinRayDataFeed
   */
  onReady(callback) {
    const resolutions = [
      "1",
      "3",
      "5",
      "10",
      "15",
      "30",
      "60",
      "120",
      "240",
      "360",
      "720",
      "D",
      "1D",
      "3D",
      "W",
      "1W",
      "2W",
    ];

    setTimeout(() => {
      // Notify to Trading View which options are supported.
      callback({
        // @ts-ignore
        supported_resolutions: resolutions,
        supports_marks: false,
        supports_time: true,
        supports_timescale_marks: false,
      });
    }, 0);
  }

  /**
   * Get server time used to align timeserie in time axes.
   *
   * @param {ServerTimeCallback} callback Server time callback.
   * @returns {Void} None.
   * @memberof CoinRayDataFeed
   */
  getServerTime(callback) {
    tradeApi
      .serverTimeGet({
        token: this.coinRayToken,
      })
      .then((data) => {
        callback(Math.floor(data.serverTime / 1000));
      })
      .catch(() => {
        callback(Math.floor(+new Date() / 1000));
      });
  }

  /**
   * Search market symbol data by widget search input value.
   *
   * @param {String} userInput Input value typed by user.
   * @param {String} exchange Exchange name.
   * @param {String} symbolType Symbol type.
   * @param {SearchSymbolsCallback} onResultReadyCallback Callback to resolve symbol match.
   * @returns {Void} None.
   * @memberof CoinRayDataFeed
   */
  // eslint-disable-next-line max-params
  searchSymbols(userInput, exchange, symbolType, onResultReadyCallback) {
    userInput = userInput.toUpperCase();
    const symbolFound = this.symbolsData
      .filter((symbolData) => symbolData.symbol === userInput.toUpperCase())
      .map((symbol) => {
        const symbolBaseQuote = symbol.base + symbol.quote;

        // Exchange and type are not enabled.
        return {
          exchange: "",
          type: "",
          symbol: symbolBaseQuote,
          full_name: symbolBaseQuote,
          description: symbol.base + " / " + symbol.quote,
          ticker: symbolBaseQuote,
        };
      });

    onResultReadyCallback(symbolFound);
  }

  /**
   * Resolve symbol data with structure required by Trading View chart.
   *
   * @param {string} symbol Symbol code.
   * @param {ResolveCallback} onSymbolResolvedCallback Notify symbol resolved.
   * @param {ErrorCallback} onResolveErrorCallback Notify symbol resolve error.
   * @returns {Void} None.
   * @memberof CoinRayDataFeed
   */
  resolveSymbol(symbol, onSymbolResolvedCallback, onResolveErrorCallback) {
    for (let symbolData of this.symbolsData) {
      const symbolBaseQuote = symbolData.base + symbolData.quote;
      const pricescale = Math.round(1 / symbolData.limits.price.min);

      if (symbolData.symbol === symbol) {
        /**
         * @type LibrarySymbolInfo
         */
        const symbolFound = {
          base_name: [symbolData.base],
          // @ts-ignore
          coinrayBase: symbolData.coinrayBase,
          // @ts-ignore
          coinrayQuote: symbolData.coinrayQuote,
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
          timezone: "Etc/UTC",
          type: "spot",
        };

        setTimeout(() => {
          onSymbolResolvedCallback(symbolFound);
        }, 0);
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
   * @param {string} resolution Data resolution.
   * @param {number} startTime Get data since.
   * @param {number} endTime Get data to.
   * @returns {Promise<CoinRayCandle>} Promise that resolve candle data.
   * @memberof CoinRayDataFeed
   */
  // eslint-disable-next-line max-params
  async getCandlesData(base, quote, resolution, startTime, endTime) {
    const exchangeCode = this.exchangeKey;
    const endpointPath = `/candles?symbol=${exchangeCode}_${quote}_${base}&start_time=${startTime}&end_time=${endTime}&resolution=${resolution}`;
    const requestUrl = this.baseUrl + endpointPath;
    const options = {
      headers: { Authorization: `Bearer ${this.coinRayToken}` },
    };

    try {
      const response = await fetch(requestUrl, options);
      const candles = await response.json();

      return candles;
    } catch (error) {
      alert(`Get candles data error: ${error.message}`);
    }

    return [];
  }

  /**
   * Get price bar for a given symbol.
   *
   * @param {LibrarySymbolInfo} symbolData Market symbol data.
   * @param {string} resolution Data resolution.
   * @param {number} startDate Get data since.
   * @param {number} endDate Get data to.
   * @param {HistoryCallback} onResultCallback Notify data.
   * @param {ErrorCallback} onErrorCallback Notify error.
   * @returns {Void} None.
   * @memberof CoinRayDataFeed
   */
  // eslint-disable-next-line max-params
  getBars(symbolData, resolution, startDate, endDate, onResultCallback, onErrorCallback) {
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

    this.getCandlesData(
      // @ts-ignore
      symbolData.coinrayBase,
      // @ts-ignore
      symbolData.coinrayQuote,
      resolution,
      startDate,
      endDate,
    )
      .then((newCandles) => {
        // Accumulate candles.
        this.allCandles = this.allCandles.concat(newCandles);

        const formattedCandles = this.allCandles.map((candle) => {
          return {
            time: parseInt(candle[0]) * 1000,
            open: parseFloat(candle[1]),
            high: parseFloat(candle[2]),
            low: parseFloat(candle[3]),
            close: parseFloat(candle[4]),
            volume: parseFloat(candle[5]),
          };
        });

        notifyPricesData(formattedCandles);
      })
      .catch((e) => {
        onErrorCallback(`ERROR: ${e.message}`);
      });
  }

  /**
   * Subscribe Trading View to real time data websocket.
   *
   * @param {LibrarySymbolInfo} symbolData Market symbol data.
   * @param {string} resolution Prices data resolution.
   * @param {SubscribeBarsCallback} onTick Notify tick to chart.
   * @returns {Void} None.
   *
   * @memberof CoinRayDataFeed
   */
  // eslint-disable-next-line max-params
  subscribeBars(symbolData, resolution, onTick) {
    const exchangeCode = this.exchangeKey;
    // @ts-ignore
    const symbolForCoinray = `${exchangeCode}_${symbolData.coinrayQuote}_${symbolData.coinrayBase}`;

    /**
     * Process CoinRay price tick, format and notify to Trading View chart.
     *
     * @param {any} data Price tick data.
     * @return {Void} None.
     */
    const processTick = (data) => {
      const {
        coinraySymbol,
        resolution: candleResolution,
        candle: { time, open, low, high, close, baseVolume },
      } = data;
      if (coinraySymbol === symbolForCoinray && resolution === candleResolution) {
        onTick({
          time: time.getTime(),
          open: open.toNumber(),
          low: low.toNumber(),
          high: high.toNumber(),
          close: close.toNumber(),
          volume: baseVolume.toNumber(),
        });
      }
    };

    try {
      this.coinray.subscribeCandles({ coinraySymbol: symbolForCoinray, resolution }, processTick);

      this.candleSubscription = {
        channel: { coinraySymbol: symbolForCoinray, resolution: resolution },
        callback: processTick,
      };
    } catch (error) {
      alert(`ERROR: CoinRay symbol data subscription failure: ${error.message}`);
    }
  }

  /**
   * Unsubscribe from CoinRay symbol real time websocket.
   *
   * @returns {Void} None.
   * @memberof CoinRayDataFeed
   */
  unsubscribeBars() {
    if (this.candleSubscription) {
      this.coinray.unsubscribeCandles(
        this.candleSubscription.channel,
        this.candleSubscription.callback,
      );
    }
  }

  /**
   * Get symbols data.
   *
   * @returns {MarketSymbolsCollection} Market symbols collection.
   * @memberof CoinRayDataFeed
   */
  getSymbolsData() {
    return this.symbolsData || [];
  }

  /**
   * Get last price candle.
   *
   * @returns {CoinRayCandle|null} Price candle.
   * @memberof CoinRayDataFeed
   */
  getLastCandle() {
    if (isEmpty(this.allCandles)) {
      return null;
    }

    return last(this.allCandles);
  }
}

export default CoinRayDataFeed;

import Coinray from "coinrayjs";
import tradeApi from "./tradeApiClient";

/**
 * @typedef {Object} DataFeedOptions
 * @property {String} symbol symbol key to get data for.
 * @property {String} tradeApiToken Trade API access token.
 * @property {String} coinRayToken Coinray access token.
 * @property {function(): Promise<string>} regenerateAccessToken Callback to regenerate access token when expires.
 * @property {String} exchange Exchange name.
 * @property {String} exchangeKey CoinRay exchange ID.
 */

/**
 * Prices data feed from CoinRay provider.
 *
 * @class CoinRayDataFeed
 * @property {TradeApiClient} tradeApi API client.
 */
class CoinRayDataFeed {
  /**
   * Creates an instance of CoinRayDataFeed.
   * @param {DataFeedOptions} options Construct options.
   * @memberof CoinRayDataFeed
   */
  constructor(options) {
    this.symbol = options.symbol || "BINANCE:ETHBTC";
    this.symbolsData = options.symbolsData || null;
    this.coinRayToken = options.coinRayToken;
    this.tradeApiToken = options.tradeApiToken;
    this.exchange = options.exchange || "BINANCE";
    this.coinray = new Coinray(this.coinRayToken);
    this.coinray.onTokenExpired(options.regenerateAccessToken);
    this.exchangeKey = options.exchangeKey || "BINA";
    this.baseUrl = "https://coinray.io/api/v1";
  }
  onReady(callback) {
    setTimeout(() => {
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

      callback({
        supports_marks: false,
        supports_timescale_marks: false,
        supports_time: true,
        supported_resolutions: resolutions,
      });
    }, 0);
  }

  getServerTime(callback) {
    tradeApi
      .coinRayTokenGet({
        token: this.coinRayToken,
      })
      .then((time) => {
        callback(Math.floor(time / 1000));
      })
      .catch(() => {
        callback(Math.floor(+new Date() / 1000));
      });
  }

  searchSymbols(userInput, exchange, symbolType, onResultReadyCallback) {
    userInput = userInput.toUpperCase();
    onResultReadyCallback(
      this.symbolsData
        .filter((symbol) => {
          const symbolBaseQuote = symbol.base + symbol.quote;
          return symbolBaseQuote.indexOf(userInput) >= 0;
        })
        .map((symbol) => {
          const symbolBaseQuote = symbol.base + symbol.quote;

          return {
            symbol: symbolBaseQuote,
            full_name: symbolBaseQuote,
            description: symbol.base + " / " + symbol.quote,
            ticker: symbolBaseQuote,
          };
        }),
    );
  }

  resolveSymbol(symbolName, onSymbolResolvedCallback, onResolveErrorCallback) {
    const comps = symbolName.split(":");
    symbolName = (comps.length > 1 ? comps[1] : symbolName).toUpperCase();

    if (this.symbolsData !== null) {
      for (let symbol of this.symbolsData) {
        const symbolBaseQuote = symbol.base + symbol.quote;

        const symbolQuoteBase = symbol.quote + symbol.base;

        const pricescale = Math.round(1 / parseFloat(symbol.limits.price.min));

        if (symbolBaseQuote === symbolName || symbolQuoteBase === symbolName) {
          // since it's the same
          setTimeout(() => {
            onSymbolResolvedCallback({
              name: symbolBaseQuote,
              altName: symbol.base + "/" + symbol.quote,

              base: symbol.base,
              quote: symbol.quote,
              coinrayBase: symbol.coinrayBase,
              coinrayQuote: symbol.coinrayQuote,

              description: symbol.base + " / " + symbol.quote,
              ticker: symbolBaseQuote,
              exchange: this.exchange,
              session: "24x7",
              minmov: 1,
              pricescale: pricescale,
              timezone: "UTC",
              has_intraday: true,
              has_daily: true,
              has_weekly_and_monthly: true,
              currency_code: symbol.quote,
              data_status: "streaming",
            });
          }, 0);
          return;
        }
      }
    }

    onResolveErrorCallback("not found");
  }

  getCandlesData(base, quote, resolution, startTime, endTime, limit) {
    const exchangeCode = this.exchangeKey;
    const endpointPath = `/candles?symbol=${exchangeCode}_${quote}_${base}&start_time=${startTime}&end_time=${endTime}&resolution=${resolution}`;
    const requestUrl = this.baseUrl + endpointPath;
    const options = {
      headers: { Authorization: `Bearer ${this.coinRayToken}` },
    };

    return fetch(requestUrl, options)
      .then((res) => {
        return res.json();
      })
      .catch((error) => {
        alert(`Get candles data error: ${error.message}`);
      });
  }

  getBars(symbolInfo, resolution, from, to, onHistoryCallback, onErrorCallback, firstDataRequest) {
    let totalCandles = [];

    const processCandles = () => {
      if (totalCandles.length === 0) {
        onHistoryCallback([], { noData: true });
      } else {
        const formattedCandles = totalCandles.map((candle) => {
          const formattedKline = {
            time: candle[0] * 1000,
            open: parseFloat(candle[1]),
            high: parseFloat(candle[2]),
            low: parseFloat(candle[3]),
            close: parseFloat(candle[4]),
            volume: parseFloat(candle[5]),
          };

          return formattedKline;
        });

        onHistoryCallback(formattedCandles, {
          noData: false,
        });
      }
    };

    const getCandles = (from, to) => {
      this.getCandlesData(
        symbolInfo.coinrayBase,
        symbolInfo.coinrayQuote,
        resolution,
        from,
        to,
        1440,
      )
        .then((candles) => {
          totalCandles = totalCandles.concat(candles);
          processCandles();
        })
        .catch((err) => {
          onErrorCallback("Error getting candles data");
        });
    };

    getCandles(from, to);
  }

  ///// ----------------- subscribeBars
  subscribeBars(symbolInfo, resolution, onRealtimeCallback, subscriberUID) {
    const exchangeCode = this.exchangeKey;
    const symbolForCoinray = `${exchangeCode}_${symbolInfo.coinrayQuote}_${symbolInfo.coinrayBase}`;

    try {
      const callback = ({
        coinraySymbol,
        resolution: candleResolution,
        candle: { time, open, low, high, close, baseVolume },
      }) => {
        if (coinraySymbol === symbolForCoinray && resolution === candleResolution) {
          onRealtimeCallback({
            time: time.getTime(),
            open: open.toNumber(),
            low: low.toNumber(),
            high: high.toNumber(),
            close: close.toNumber(),
            volume: baseVolume.toNumber(),
          });
        }
      };

      this.coinray.subscribeCandles({ coinraySymbol: symbolForCoinray, resolution }, callback);

      this.candleSubscription = {
        channel: { coinraySymbol: symbolForCoinray, resolution: resolution },
        callback,
      };
    } catch (error) {
      alert(`ERROR: CoinRay symbol data subscription failure: ${error.message}`);
    }
  }

  unsubscribeBars(subscriberUID) {
    if (this.candleSubscription) {
      this.coinray.unsubscribeCandles(
        this.candleSubscription.channel,
        this.candleSubscription.callback,
      );
    }
  }
}

export default CoinRayDataFeed;

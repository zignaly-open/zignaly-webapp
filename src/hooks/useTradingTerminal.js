import { useState } from "react";
import { isNumber, isString, isObject } from "lodash";
import { formatPrice } from "../utils/formatters";
import { widget as PrivateTradingViewWidget } from "../../static/charting_library/charting_library";
import datafeed from "tradingView/datafeed.vcce";
import { createChart } from "lightweight-charts";

/**
 * @typedef {Object} TradingTerminalHook
 * @property {function} instantiateWidget
 * @property {function} setTradingViewWidget
 * @property {any} tradingViewWidget
 */

/**
 * @typedef {any} TVWidget
 */

/**
 * Trading terminal handlers and state control hook.
 *
 * We skip the definition of Trading View types due to the typedefs are part of
 * private repository that have publication restrictions incompatible with open
 * source.
 *
 * @param {function} setLastPrice Update last price callback.
 * @returns {TradingTerminalHook} Trading View hook object.
 */
const useTradingTerminal = (setLastPrice) => {
  const [tradingViewWidget, setTradingViewWidget] = useState(/** @type {TVWidget} */ null);
  // const TradingViewWidget = true ? PrivateTradingViewWidget : window.TradingView.widget;
  // const dataFeed = useCoinRayDataFeedFactory(selectedSymbol);
  // const dataFeed = useCoinRayDataFeedFactory(selectedSymbol);

  /**
   * Instantiate trading view widget and initialize price.
   *
   * @param {any} widgetOptions Trading view widget options.
   * @return {Function} Widget cleanup function.
   */
  const instantiateWidget = (widgetOptions) => {
    // @ts-ignore
    // eslint-disable-next-line new-cap
    // const externalWidget = new TradingViewWidget(widgetOptions);
    // console.log(TradingViewWidget, externalWidget);
    let eventSymbol = "";

    const chartProperties = {
      width: 1500,
      height: 600,
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
      },
    };

    const domElement = document.getElementById("trading_view_chart");
    const chart = createChart(domElement, chartProperties);
    const candleSeries = chart.addCandlestickSeries();

    fetch(
      `https://api.allorigins.win/get?url=${encodeURIComponent(
        "https://api.vcc.exchange/v3/chart/bars?lang=en&coin=btc&currency=usdt&resolution=60000&from=1605692765&to=1605779225",
      )}`,
    )
      .then((res) => res.json())
      .then((data) => {
        const cdata = JSON.parse(data.contents).map((d) => {
          return {
            time: d.closing_time / 1000,
            open: d.open,
            high: d.high,
            low: d.low,
            close: d.close,
          };
        });
        console.log(cdata);
        candleSeries.setData(cdata);
      })
      .catch((err) => console.log(err));

    // @ts-ignore
    const handleWidgetReady = (event) => {
      console.log(event);
      if (isString(event.data)) {
        try {
          const dataRaw = /** @type {Object<string, any>} */ event.data;
          const dataParsed = JSON.parse(dataRaw);

          // @ts-ignore
          if (dataParsed.name === "widgetReady" && externalWidget.postMessage) {
            setTradingViewWidget(externalWidget);
          }

          if (dataParsed.name === "quoteUpdate" && dataParsed.data) {
            if (eventSymbol !== dataParsed.data.original_name) {
              const receivedPrice = isNumber(dataParsed.data.last_price)
                ? formatPrice(dataParsed.data.last_price, "", "")
                : dataParsed.data.last_price;
              setLastPrice(receivedPrice);
              eventSymbol = dataParsed.data.original_name;
            }
          }
        } catch (e) {
          // Not a valid JSON, skip event.
          return;
        }
      }

      // Symbol data not found by Trading View widget.
      if (isObject(event.data) && event.data.name === "tv-widget-no-data") {
        setTradingViewWidget(externalWidget);
        setLastPrice(null);
      }
    };

    window.addEventListener("message", handleWidgetReady);

    const cleanupWidget = () => {
      if (tradingViewWidget) {
        tradingViewWidget.remove();
        setTradingViewWidget(null);
        window.removeEventListener("message", handleWidgetReady);
      }
    };

    return cleanupWidget;
  };

  return {
    instantiateWidget,
    setTradingViewWidget,
    tradingViewWidget,
  };
};

export default useTradingTerminal;

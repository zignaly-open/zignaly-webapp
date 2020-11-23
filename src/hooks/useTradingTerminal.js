import { useState, useEffect } from "react";
import { isNumber, isString, isObject } from "lodash";
import { formatPrice } from "../utils/formatters";
import { widget as PrivateTradingViewWidget } from "../../static/charting_library/charting_library/";
import { getTradingViewExchangeSymbol } from "tradingView/tradingViewOptions";
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
  const [dataFeed, setDataFeed] = useState(/** @type {TVWidget} */ null);
  const TradingViewWidget = true ? PrivateTradingViewWidget : window.TradingView.widget;
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
    let eventSymbol = "";

    // @ts-ignore
    // const handleWidgetReady = (event) => {
    //   console.log(event);
    //   if (isString(event.data)) {
    //     try {
    //       const dataRaw = /** @type {Object<string, any>} */ event.data;
    //       const dataParsed = JSON.parse(dataRaw);

    //       // @ts-ignore
    //       if (dataParsed.name === "widgetReady" && externalWidget.postMessage) {
    //         setTradingViewWidget(externalWidget);
    //       }

    //       if (dataParsed.name === "quoteUpdate" && dataParsed.data) {
    //         if (eventSymbol !== dataParsed.data.original_name) {
    //           const receivedPrice = isNumber(dataParsed.data.last_price)
    //             ? formatPrice(dataParsed.data.last_price, "", "")
    //             : dataParsed.data.last_price;
    //           setLastPrice(receivedPrice);
    //           eventSymbol = dataParsed.data.original_name;
    //         }
    //       }
    //     } catch (e) {
    //       // Not a valid JSON, skip event.
    //       return;
    //     }
    //   }

    //   // Symbol data not found by Trading View widget.
    //   if (isObject(event.data) && event.data.name === "tv-widget-no-data") {
    //     setTradingViewWidget(externalWidget);
    //     setLastPrice(null);
    //   }
    // };

    if (true) {
      const widgetInstance = new PrivateTradingViewWidget(widgetOptions);
      window.externalWidget = widgetInstance;
      // Store to state only when chart is ready so prices are resolved.
      widgetInstance.onChartReady(() => {
        setTradingViewWidget(widgetInstance);
        setDataFeed(widgetOptions.datafeed);
        // todo: update price
        // @ts-ignore
        // const priceCandle = dataFeed.getLastCandle();
        // setLastPrice(priceCandle);
      });
    }
    // window.addEventListener("message", handleWidgetReady);
  };

  const changeSymbol = (newSymbol) => {
    if (tradingViewWidget) {
      if (tradingViewWidget.iframe) {
        const symbolTV = getTradingViewExchangeSymbol(
          newSymbol.tradeViewSymbol,
          storeSettings.selectedExchange,
        );
        tradingViewWidget.iframe.contentWindow.postMessage(
          { name: "set-symbol", data: { symbol: symbolTV } },
          "*",
        );
      } else {
        const chart = tradingViewWidget.chart();
        chart.setSymbol(newSymbol.tradeViewSymbol, () => {
          // @ts-ignore
          const price = dataFeed.getLastPrice();
          setLastPrice(price);
        });
      }
    }
  };

  useEffect(() => {
    const cleanupWidget = () => {
      if (tradingViewWidget) {
        tradingViewWidget.remove();
        setTradingViewWidget(null);
        window.removeEventListener("message", handleWidgetReady);
      }
    };
    return cleanupWidget;
  }, []);

  return {
    instantiateWidget,
    setTradingViewWidget,
    tradingViewWidget,
    changeSymbol,
  };
};

export default useTradingTerminal;

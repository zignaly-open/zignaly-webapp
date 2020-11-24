import { useState, useEffect, useRef } from "react";
import { isNumber, isString, isObject } from "lodash";
import { formatPrice } from "../utils/formatters";
import { widget as PrivateTradingViewWidget } from "../../static/charting_library/charting_library/";
import { getTradingViewExchangeSymbol } from "tradingView/tradingViewOptions";
import useStoreSettingsSelector from "hooks/useStoreSettingsSelector";
// import { widget as PrivateTradingViewWidget } from "tradingView/charting_library/charting_library.min";

/**
 *
 * @typedef {import("tradingView/charting_library/charting_library.min").IBasicDataFeed} IBasicDataFeed
 * @typedef {import("tradingView/charting_library/charting_library.min").ChartingLibraryWidgetOptions} ChartingLibraryWidgetOptions
 * @typedef {import("../services/tradeApiClient.types").ExchangeConnectionEntity} ExchangeConnectionEntity
 */

/**
 * @typedef {Object} TradingTerminalHook
 * @property {function} instantiateWidget
 * @property {function} changeSymbol
 * @property {function} removeWidget
 * @property {any} tradingViewWidget
 * @property {boolean} isSelfHosted
 */

/**
 * @typedef {any} TVWidget
 */

/**
 * Trading terminal handlers and state control hook.
 *
 * @param {function} setLastPrice Update last price callback.
 * @returns {TradingTerminalHook} Trading View hook object.
 */
const useTradingTerminal = (setLastPrice) => {
  // const [tradingViewWidget, setTradingViewWidget] = useState(/** @type {TVWidget} */ null);
  // const [dataFeed, setDataFeed] = useState(/** @type {IBasicDataFeed} */ null);
  const storeSettings = useStoreSettingsSelector();
  const [tradingView, setTradingView] = useState({
    widget: null,
    // /** @type {IBasicDataFeed} */ dataFeed: null,
    options: null,
    isSelfHosted: false,
  });
  const readyCallback = useRef(null);

  /**
   * Instantiate trading view widget and initialize price.
   *
   * @param {ChartingLibraryWidgetOptions} widgetOptions Trading view widget options.
   * @return {void}
   */
  const instantiateWidget = (widgetOptions) => {
    const isSelfHosted = Boolean(widgetOptions.datafeed);

    if (isSelfHosted) {
      // @ts-ignore
      const widgetInstance = new PrivateTradingViewWidget(widgetOptions);
      // window.externalWidget = widgetInstance;
      widgetInstance.onChartReady(() => {
        setTradingView({
          widget: widgetInstance,
          options: widgetOptions,
          isSelfHosted: true,
        });
        // Update price
        // @ts-ignore
        const price = widgetOptions.datafeed.getLastPrice();
        setLastPrice(price);
      });
    } else {
      // @ts-ignore
      // eslint-disable-next-line new-cap
      const externalWidget = new window.TradingView.widget(widgetOptions);

      let eventSymbol = "";
      // @ts-ignore
      const handleWidgetReady = (event) => {
        if (isString(event.data)) {
          try {
            const dataParsed = JSON.parse(event.data);
            // @ts-ignore
            if (dataParsed.name === "widgetReady") {
              setTradingView({
                widget: externalWidget,
                options: widgetOptions,
                isSelfHosted: false,
              });
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
          setTradingView({
            widget: externalWidget,
            options: widgetOptions,
            isSelfHosted: false,
          });
          setLastPrice(null);
        }
      };
      readyCallback.current = handleWidgetReady;
      window.addEventListener("message", handleWidgetReady);
    }
  };

  /**
   * Update TradingView selected symbol
   * @param {string} symbol .
   * @param {ExchangeConnectionEntity} exchange Exchange connection entity.
   * @returns {void}
   */
  const changeSymbol = (symbol, exchange) => {
    if (!tradingView.widget || (!tradingView.isSelfHosted && !tradingView.widget.iframe)) {
      // eslint-disable-next-line no-console
      return console.error("LOG: tradingViewWidget wasn't initialized before symbol change");
    }

    if (tradingView.widget.iframe) {
      const symbolTV = getTradingViewExchangeSymbol(symbol, exchange);
      tradingView.widget.iframe.contentWindow.postMessage(
        { name: "set-symbol", data: { symbol: symbolTV } },
        "*",
      );
    } else {
      const chart = tradingView.widget.chart();
      chart.setSymbol(symbol, () => {
        // @ts-ignore
        const price = tradingView.options.datafeed.getLastPrice();
        setLastPrice(price);
      });
    }
  };

  useEffect(() => {
    const cleanupWidget = () => {
      if (readyCallback.current) {
        window.removeEventListener("message", readyCallback.current);
      }
      if (tradingView.widget) {
        removeWidget();
      }
    };
    return cleanupWidget;
  }, []);

  const removeWidget = () => {
    tradingView.widget.remove();
    setTradingView((tv) => ({ ...tv, widget: null }));
  };

  return {
    instantiateWidget,
    tradingViewWidget: tradingView.widget,
    changeSymbol,
    removeWidget,
    isSelfHosted: tradingView.isSelfHosted,
  };
};

export default useTradingTerminal;

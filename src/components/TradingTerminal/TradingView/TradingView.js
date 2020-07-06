import React, { useEffect, useState } from "react";
import { FormContext, useForm } from "react-hook-form";
import { widget as TradingViewWidget } from "../../../tradingView/charting_library.min";
import { createWidgetOptions } from "../../../tradingView/dataFeedOptions";
import StrategyForm from "../StrategyForm/StrategyForm";
import { Box, CircularProgress } from "@material-ui/core";
import useCoinRayDataFeedFactory from "../../../hooks/useCoinRayDataFeedFactory";
import useStoreSettingsSelector from "../../../hooks/useStoreSettingsSelector";
import "./TradingView.scss";
import TradingViewHeader from "./TradingViewHeader";

/**
 * @typedef {import("../../../tradingView/charting_library.min").IChartingLibraryWidget} TVWidget
 */

/**
 * @type {Object<string, string>}
 */
const defaultExchangeSymbol = {
  KuCoin: "BTC/USDT",
  Binance: "BTC/USDT",
  Zignaly: "BTC/USDT",
  fallback: "BTC/USDT",
};

/**
 * Trading terminal component.
 *
 * @returns {JSX.Element} Trading terminal element.
 */
const TradingView = () => {
  const [tradingViewWidget, setTradingViewWidget] = useState(/** @type {TVWidget} */ null);
  const [externalTradingViewWidget, setExternalTradingViewWidget] = useState(
    /** @type {TVWidget} */ null,
  );
  const [lastPrice, setLastPrice] = useState(null);
  const storeSettings = useStoreSettingsSelector();

  /**
   * Resolve exchange name from selected exchange.
   *
   * @returns {string} Exchange name.
   */
  const resolveExchangeName = () => {
    return storeSettings.selectedExchange.exchangeName || storeSettings.selectedExchange.name;
  };

  /**
   * Resolve default symbol for selected exchange.
   *
   * In case of not default symbol for the exchange resolves BTCUSDT.
   *
   * @returns {string} Symbol ID.
   */
  const resolveDefaultSymbol = () => {
    return defaultExchangeSymbol[exchangeName] || defaultExchangeSymbol.fallback;
  };

  const exchangeName = resolveExchangeName();
  const defaultSymbol = resolveDefaultSymbol();
  const [selectedSymbol, setSelectedSymbol] = useState(defaultSymbol);
  const dataFeed = useCoinRayDataFeedFactory(selectedSymbol);
  const isLoading = tradingViewWidget === null;
  const isLastPriceLoading = lastPrice === null;

  const onExchangeChange = () => {
    const newExchangeName =
      storeSettings.selectedExchange.exchangeName || storeSettings.selectedExchange.name;
    const newDefaultSymbol =
      defaultExchangeSymbol[newExchangeName] || defaultExchangeSymbol.fallback;
    if (tradingViewWidget) {
      tradingViewWidget.remove();
      setTradingViewWidget(null);
      setLastPrice(null);
      setSelectedSymbol(newDefaultSymbol);
    }
  };

  useEffect(onExchangeChange, [storeSettings.selectedExchange.internalId]);

  const bootstrapWidget = () => {
    if (dataFeed) {
      const widgetOptions = createWidgetOptions(dataFeed, selectedSymbol);
      const widgetInstance = new TradingViewWidget(widgetOptions);
      // Store to state only when chart is ready so prices are resolved.
      widgetInstance.onChartReady(() => {
        setTradingViewWidget(widgetInstance);
        // @ts-ignore
        const priceCandle = dataFeed.getLastCandle();
        setLastPrice(priceCandle);
      });
    }

    return () => {
      if (tradingViewWidget) {
        tradingViewWidget.remove();
        setTradingViewWidget(null);
      }
    };
  };

  // Create Trading View widget when data feed token is ready.
  useEffect(bootstrapWidget, [dataFeed]);

  useEffect(() => {
    const checkExist = setInterval(function () {
      console.log("widgetLoad: ", window.TradingView);
      if (window.TradingView && window.TradingView.widget) {
        const externalWidget = new window.TradingView.widget({
          container_id: "technical_analysis",
          width: 998,
          height: 610,
          symbol: "BINANCE:BNBUSDTPERP",
          interval: "D",
          timezone: "exchange",
          theme: "light",
          style: "1",
          toolbar_bg: "#f1f3f6",
          withdateranges: true,
          hide_side_toolbar: false,
          allow_symbol_change: true,
          save_image: false,
          studies: [
            "ROC@tv-basicstudies",
            "StochasticRSI@tv-basicstudies",
            "MASimple@tv-basicstudies",
          ],
          show_popup_button: true,
          popup_width: "1000",
          popup_height: "650",
          locale: "en",
        });

        window.addEventListener("message", function (event) {
          var data = event.data;
          console.log("widgetData: ", data);
        });

        window.externalWidget = externalWidget;
        clearInterval(checkExist);
      }
    }, 100);
  }, []);

  // @ts-ignore
  const symbolsList = dataFeed ? dataFeed.getSymbolsData() : [];

  /**
   * @typedef {Object} OptionValue
   * @property {string} label
   * @property {string} value
   */

  /**
   * Change selected symbol.
   *
   * @param {string} selectedOption Selected symbol option object.
   * @returns {Void} None.
   */
  const handleSymbolChange = (selectedOption) => {
    setSelectedSymbol(selectedOption);

    if (window.externalWidget && window.externalWidget.iframe) {
      window.externalWidget.iframe.contentWindow.postMessage(
        { name: "set-symbol", data: { symbol: "ETH-BTC" } },
        "*",
      );
    }

    // Change chart data to the new selected symbol.
    if (tradingViewWidget) {
      const chart = tradingViewWidget.chart();
      chart.setSymbol(selectedOption, () => {
        // @ts-ignore
        const priceCandle = dataFeed.getLastCandle();
        setLastPrice(priceCandle);
      });
    }
  };

  const currentPrice = lastPrice ? parseFloat(lastPrice[1]).toFixed(8) : "";
  const methods = useForm({
    mode: "onChange",
    defaultValues: {
      entryType: "LONG",
      leverage: 1,
      positionSize: "",
      price: currentPrice,
      realInvestment: "",
      stopLossPrice: "",
      trailingStopPrice: "",
      units: "",
      dcaTargetPricePercentage1: "",
    },
  });

  return (
    <FormContext {...methods}>
      <Box className="tradingTerminal" display="flex" flexDirection="column" width={1}>
        {!isLoading && (
          <TradingViewHeader
            handleSymbolChange={handleSymbolChange}
            selectedSymbol={selectedSymbol}
            symbolsList={symbolsList}
          />
        )}
        <Box
          bgcolor="grid.content"
          className="tradingViewContainer"
          display="flex"
          flexDirection="row"
          flexWrap="wrap"
          width={1}
        >
          {isLoading && (
            <Box
              className="loadProgress"
              display="flex"
              flexDirection="row"
              justifyContent="center"
            >
              <CircularProgress disableShrink />
            </Box>
          )}
          <Box className="tradingViewChart" id="technical_analysis" />
          <Box className="tradingViewChart" id="trading_view_chart" />
          {!isLoading && !isLastPriceLoading && (
            <StrategyForm
              dataFeed={dataFeed}
              lastPriceCandle={lastPrice}
              selectedSymbol={selectedSymbol}
              tradingViewWidget={tradingViewWidget}
            />
          )}
        </Box>
      </Box>
    </FormContext>
  );
};

export default React.memo(TradingView);

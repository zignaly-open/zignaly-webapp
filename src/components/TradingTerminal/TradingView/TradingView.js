import React, { useEffect, useState } from "react";
import { FormContext, useForm } from "react-hook-form";
import tradeApi from "../../../services/tradeApiClient";
import { createWidgetOptions } from "../../../tradingView/dataFeedOptions";
import StrategyForm from "../StrategyForm/StrategyForm";
import { Box, CircularProgress } from "@material-ui/core";
import TradingViewHeader from "./TradingViewHeader";
import useStoreSettingsSelector from "../../../hooks/useStoreSettingsSelector";
import useStoreSessionSelector from "../../../hooks/useStoreSessionSelector";
import "./TradingView.scss";

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
  const [lastPrice, setLastPrice] = useState(null);
  const storeSession = useStoreSessionSelector();
  const storeSettings = useStoreSettingsSelector();
  const [marketData, setMarketData] = useState(null);

  const getMarketData = async () => {
    const marketDataPayload = {
      token: storeSession.tradeApi.accessToken,
      exchangeInternalId: storeSettings.selectedExchange.internalId,
    };

    try {
      const data = await tradeApi.exchangeConnectionMarketDataGet(marketDataPayload);
      setMarketData(data);
    } catch (error) {
      alert(`ERROR: ${error.message}`);
    }

    return [];
  };

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
  // const dataFeed = useCoinRayDataFeedFactory(selectedSymbol);
  const isLoading = tradingViewWidget === null || marketData === null;
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
    getMarketData();

    const checkExist = setInterval(() => {
      if (window.TradingView && window.TradingView.widget) {
        const widgetOptions = createWidgetOptions(exchangeName, selectedSymbol);
        const externalWidget = new window.TradingView.widget(widgetOptions);

        window.addEventListener("message", (event) => {
          var data = event.data;
          console.log("widgetData: ", data);
        });

        window.externalWidget = externalWidget;
        setTradingViewWidget(externalWidget);
        clearInterval(checkExist);
      }
    }, 100);

    return () => {
      if (window.externalWidget) {
        window.externalWidget.remove();
        setTradingViewWidget(null);
      }
    };
  };

  // Create Trading View widget when data feed token is ready.
  useEffect(bootstrapWidget, []);

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
        { name: "set-symbol", data: { symbol: selectedOption.replace("/", "-") } },
        "*",
      );

      window.externalWidget.iframe.contentWindow.postMessage(
        { name: "set-theme", data: { symbol: "dark" } },
        "*",
      );
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
            symbolsList={marketData}
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
          <Box className="tradingViewChart" id="trading_view_chart" />
          {!isLoading && !isLastPriceLoading && (
            <StrategyForm
              lastPriceCandle={lastPrice}
              selectedSymbol={selectedSymbol}
              symbolsData={marketData}
              tradingViewWidget={tradingViewWidget}
            />
          )}
        </Box>
      </Box>
    </FormContext>
  );
};

export default React.memo(TradingView);

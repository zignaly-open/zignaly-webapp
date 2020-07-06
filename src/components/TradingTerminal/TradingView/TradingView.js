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
  const [libraryReady, setLibraryReady] = useState(false);
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
      bootstrapWidget();
    }
  };

  useEffect(onExchangeChange, [storeSettings.selectedExchange.internalId]);

  const loadDependencies = () => {
    getMarketData();
    const checkExist = setInterval(() => {
      if (window.TradingView && window.TradingView.widget) {
        setLibraryReady(true);
        clearInterval(checkExist);
      }
    }, 100);
  };

  useEffect(loadDependencies, []);

  const bootstrapWidget = () => {
    // Skip if TV widget already exists or TV library is not ready.
    if (!libraryReady) {
      return () => {};
    }

    const widgetOptions = createWidgetOptions(
      exchangeName,
      selectedSymbol,
      storeSettings.darkStyle,
    );

    // @ts-ignore
    // eslint-disable-next-line new-cap
    const externalWidget = new window.TradingView.widget(widgetOptions);
    // @ts-ignore
    const handleWidgetReady = (event) => {
      const dataRaw = /** @type {Object<string, any>} */ event.data;
      if (typeof dataRaw === "string") {
        const data = JSON.parse(dataRaw);
        // @ts-ignore
        if (data.name === "widgetReady" && externalWidget.postMessage) {
          setTradingViewWidget(externalWidget);
        }

        if (data.name === "quoteUpdate" && !lastPrice) {
          setLastPrice(data.last_price);
        }
      }
    };

    window.addEventListener("message", handleWidgetReady);

    return () => {
      if (tradingViewWidget) {
        tradingViewWidget.remove();
        setTradingViewWidget(null);
      }

      window.removeEventListener("message", handleWidgetReady);
    };
  };

  // Create Trading View widget when TV external library is ready.
  useEffect(bootstrapWidget, [libraryReady]);

  const changeTheme = () => {
    if (tradingViewWidget) {
      const options = tradingViewWidget.options;
      if (storeSettings.darkStyle && options.theme !== "dark") {
        tradingViewWidget.remove();
        setTradingViewWidget(null);
        bootstrapWidget();
      }

      if (!storeSettings.darkStyle && options.theme !== "light") {
        tradingViewWidget.remove();
        setTradingViewWidget(null);
        bootstrapWidget();
      }
    }
  };
  useEffect(changeTheme, [storeSettings.darkStyle]);

  // Force initial price notification.
  const initDataFeedSymbol = () => {
    const checkExist = setInterval(() => {
      if (tradingViewWidget && tradingViewWidget.iframe && tradingViewWidget.iframe.contentWindow) {
        handleSymbolChange(defaultSymbol);
        clearInterval(checkExist);
      }
    }, 100);
  };
  useEffect(initDataFeedSymbol, [tradingViewWidget]);

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
    const symbolSuffix =
      storeSettings.selectedExchange.exchangeType.toLocaleLowerCase() === "futures" ? "PERP" : "";
    const symbolCode = selectedOption.replace("/", "") + symbolSuffix;

    if (tradingViewWidget && tradingViewWidget.iframe) {
      tradingViewWidget.iframe.contentWindow.postMessage(
        { name: "set-symbol", data: { symbol: symbolCode } },
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
              lastPrice={lastPrice}
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

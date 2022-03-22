import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { FormProvider, useForm } from "react-hook-form";
import tradeApi from "../../../services/tradeApiClient";
import { createWidgetOptions } from "../../../tradingView/tradingViewOptions";
import StrategyForm from "../StrategyForm/StrategyForm";
import { Box, CircularProgress, Typography } from "@mui/material";
import TradingViewHeader from "./TradingViewHeader";
import useStoreSettingsSelector from "../../../hooks/useStoreSettingsSelector";
import { useStoreUserSelector } from "../../../hooks/useStoreUserSelector";
import { showErrorAlert } from "../../../store/actions/ui";
import ConnectExchange from "../../Modal/ConnectExchange";
import useTradingTerminal from "../../../hooks/useTradingTerminal";
import "./TradingView.scss";
import TradingViewContext from "./TradingViewContext";
import useTradingViewContext from "hooks/useTradingViewContext";
import useSelectedExchange from "hooks/useSelectedExchange";

/**
 * @typedef {any} TVWidget
 * @typedef {import('../../../services/tradeApiClient.types').MarketSymbol} MarketSymbol
 * @typedef {import('../../../services/tradeApiClient.types').MarketSymbolsCollection} MarketSymbolsCollection
 */

/**
 * @type {Object<string, string>}
 */
const defaultExchangeSymbol = {
  kucoin: "BTC/USDT",
  binance: "BTC/USDT",
  zignaly: "BTC/USDT",
  bitmex: "XBTUSD",
  fallback: "BTC/USDT",
};

/**
 * Trading terminal component.
 *
 * @returns {JSX.Element} Trading terminal element.
 */
const TradingView = () => {
  const tradingViewContext = useTradingViewContext();
  const { lastPrice, setLastPrice } = tradingViewContext;
  const { instantiateWidget, tradingViewWidget, changeSymbol, removeWidget, isSelfHosted } =
    useTradingTerminal(setLastPrice);
  const storeSettings = useStoreSettingsSelector();
  const [symbols, setSymbols] = useState(/** @type {MarketSymbolsCollection} */ (null));
  const dispatch = useDispatch();
  const selectedExchange = useSelectedExchange();

  const getMarketData = async () => {
    const marketDataPayload = {
      exchangeInternalId: selectedExchange.internalId,
    };

    try {
      const data = await tradeApi.exchangeConnectionMarketDataGet(marketDataPayload);
      setSymbols(data);
    } catch (e) {
      dispatch(showErrorAlert(e));
    }
  };

  /**
   * Resolve exchange name from selected exchange.
   *
   * @returns {string} Exchange name.
   */
  const resolveExchangeName = () => {
    return selectedExchange.exchangeName || selectedExchange.name;
  };

  const exchangeName = resolveExchangeName();

  /**
   * Get symbol data
   * @param {string} symbol Symbol
   * @returns {MarketSymbol} Symbol data
   */
  const resolveSymbolData = (symbol) =>
    symbol && symbols ? symbols.find((d) => d.short === symbol) : null;

  /**
   * Resolve last selected or default symbol for selected exchange.
   *
   * In case of not default symbol for the exchange resolves BTCUSDT.
   *
   * @returns {MarketSymbol} Symbol ID.
   */
  const defaultSelectedSymbol = () => {
    const symbolOptions = [
      storeSettings.tradingTerminal.pair[selectedExchange.exchangeId],
      defaultExchangeSymbol[exchangeName.toLowerCase()],
      defaultExchangeSymbol.fallback,
    ];
    for (const s of symbolOptions) {
      if (s) {
        const symbolData = resolveSymbolData(s);
        if (symbolData) {
          return symbolData;
        }
      }
    }
    return null;
  };
  const [selectedSymbol, setSelectedSymbol] = useState(/** @type {MarketSymbol} */ (null));
  useEffect(() => {
    // Load default symbol when symbols are ready
    if (symbols) {
      setSelectedSymbol(defaultSelectedSymbol());
    }
  }, [symbols]);

  const [selectedExchangeId, setSelectedExchangeId] = useState(selectedExchange.internalId);
  const isLoading = tradingViewWidget === null || selectedSymbol === null;
  const isLastPriceLoading = lastPrice === null;

  const onExchangeChange = () => {
    // Load dependencies
    setSymbols(null);
    setSelectedSymbol(null);
    getMarketData();

    // Reload widget on exchange change
    if (selectedExchangeId !== selectedExchange.internalId) {
      setLastPrice(null);
      removeWidget();
      setSelectedExchangeId(selectedExchangeId);
    }
  };
  useEffect(onExchangeChange, [selectedExchangeId]);

  useEffect(() => {
    // Reload widget on theme change
    removeWidget();
    bootstrapWidget();
  }, [storeSettings.darkStyle]);

  const bootstrapWidget = () => {
    // Initialize widget when symbols loaded or when instance removed
    if (!selectedSymbol || tradingViewWidget) {
      return;
    }

    const options = {
      exchange: selectedExchange,
      symbolsData: symbols,
      symbol: selectedSymbol.tradeViewSymbol,
      darkStyle: storeSettings.darkStyle,
    };

    const widgetOptions = createWidgetOptions(options);
    instantiateWidget(widgetOptions);
  };

  // Create Trading View widget when TV external library is ready.
  useEffect(bootstrapWidget, [tradingViewWidget, selectedSymbol]);

  useEffect(() => {
    if (isSelfHosted || !tradingViewWidget) return;

    // Force initial price notification.
    const checkExist = setInterval(() => {
      if (
        tradingViewWidget &&
        tradingViewWidget.iframe &&
        tradingViewWidget.iframe.contentWindow &&
        selectedSymbol
      ) {
        changeSymbol(selectedSymbol.tradeViewSymbol, selectedExchange);
        clearInterval(checkExist);
      }
    }, 100);
  }, [tradingViewWidget]);

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
    const newSymbol = resolveSymbolData(selectedOption);
    setSelectedSymbol(newSymbol);
    changeSymbol(newSymbol.tradeViewSymbol, selectedExchange);
  };

  const methods = useForm({
    mode: "onChange",
    defaultValues: {
      entryType: "LONG",
      leverage: 1,
      positionSize: "",
      realInvestment: "",
      stopLossPrice: "",
      trailingStopPrice: "",
      units: "",
      dcaTargetPricePercentage1: "",
    },
  });

  return (
    <TradingViewContext.Provider value={tradingViewContext}>
      <FormProvider {...methods}>
        <Box className="tradingTerminal" display="flex" flexDirection="column" width={1}>
          {!isLoading && (
            <TradingViewHeader
              handleSymbolChange={handleSymbolChange}
              selectedSymbol={selectedSymbol.short}
              symbolsList={symbols}
            />
          )}
          <Box
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
            <Box className="tradingViewChart">
              <div id="trading_view_chart" />
              {!isLoading && (
                <Typography color="textSecondary">
                  <a
                    href={`https://www.tradingview.com/symbols/${selectedSymbol.tradeViewSymbol}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {selectedSymbol.symbol} by TradingView
                  </a>
                </Typography>
              )}
            </Box>
            {!isLoading && !isLastPriceLoading && lastPrice && (
              <StrategyForm
                lastPrice={lastPrice}
                selectedSymbol={selectedSymbol}
                tradingViewWidget={tradingViewWidget}
              />
            )}
          </Box>
        </Box>
      </FormProvider>
    </TradingViewContext.Provider>
  );
};

const TradingViewWrapper = () => {
  const selectedExchange = useSelectedExchange();
  const storeUser = useStoreUserSelector();

  if (!storeUser.loaded) {
    return (
      <Box
        alignItems="center"
        className="loadingBox"
        display="flex"
        flexDirection="row"
        justifyContent="center"
      >
        <CircularProgress size={50} />
      </Box>
    );
  }

  if (!selectedExchange.internalId) {
    return <ConnectExchange />;
  }

  return <TradingView />;
};

export default React.memo(TradingViewWrapper);

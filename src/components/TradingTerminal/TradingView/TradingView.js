import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { FormProvider, useForm } from "react-hook-form";
import tradeApi from "../../../services/tradeApiClient";
import {
  createWidgetOptions,
  getTradingViewExchangeSymbol,
} from "../../../tradingView/tradingViewOptions";
import StrategyForm from "../StrategyForm/StrategyForm";
import { Box, CircularProgress } from "@material-ui/core";
import TradingViewHeader from "./TradingViewHeader";
import useStoreSettingsSelector from "../../../hooks/useStoreSettingsSelector";
import useStoreSessionSelector from "../../../hooks/useStoreSessionSelector";
import { useStoreUserSelector } from "../../../hooks/useStoreUserSelector";
import { showErrorAlert } from "../../../store/actions/ui";
import ConnectExchange from "../../Modal/ConnectExchange";
import useTradingTerminal from "../../../hooks/useTradingTerminal";
import "./TradingView.scss";
import TradingViewContext from "./TradingViewContext";
import useTradingViewContext from "hooks/useTradingViewContext";
import VcceDataFeed from "services/vcceDataFeed";

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
  const [libraryReady, setLibraryReady] = useState(false);
  const { instantiateWidget, setTradingViewWidget, tradingViewWidget } = useTradingTerminal(
    setLastPrice,
  );
  const storeSession = useStoreSessionSelector();
  const storeSettings = useStoreSettingsSelector();
  const [symbols, setSymbols] = useState(/** @type {MarketSymbolsCollection} */ (null));
  const dispatch = useDispatch();

  const getMarketData = async () => {
    const marketDataPayload = {
      token: storeSession.tradeApi.accessToken,
      exchangeInternalId: storeSettings.selectedExchange.internalId,
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
    return storeSettings.selectedExchange.exchangeName || storeSettings.selectedExchange.name;
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
      storeSettings.tradingTerminal.pair[storeSettings.selectedExchange.exchangeId],
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
    if (symbols) {
      setSelectedSymbol(defaultSelectedSymbol());
    }
  }, [symbols]);

  const [selectedExchangeId, setSelectedExchangeId] = useState(
    storeSettings.selectedExchange.internalId,
  );
  // const dataFeed = useCoinRayDataFeedFactory(selectedSymbol);
  const isLoading = tradingViewWidget === null || selectedSymbol === null;
  const isLastPriceLoading = lastPrice === null;

  const onExchangeChange = () => {
    if (selectedExchangeId !== storeSettings.selectedExchange.internalId) {
      if (tradingViewWidget) {
        tradingViewWidget.remove();
        setTradingViewWidget(null);
        setLastPrice(null);
        setSelectedSymbol(defaultSelectedSymbol());
        bootstrapWidget();
      }

      setSelectedExchangeId(storeSettings.selectedExchange.internalId);
    }
  };

  useEffect(onExchangeChange, [storeSettings.selectedExchange.internalId]);

  const loadDependencies = () => {
    setSymbols(null);
    setSelectedSymbol(null);
    getMarketData();

    const checkExist = setInterval(() => {
      // @ts-ignore
      if (window.TradingView && window.TradingView.widget) {
        setLibraryReady(true);
        clearInterval(checkExist);
      }
    }, 100);
  };

  useEffect(loadDependencies, [storeSettings.selectedExchange.internalId]);

  const bootstrapWidget = () => {
    // Skip if TV widget already exists or TV library/symbol not ready.
    if (tradingViewWidget || !selectedSymbol) {
      return () => {};
    }

    const options = {
      exchange: exchangeName,
      // exchangeKey,
      // internalExchangeId: storeSettings.selectedExchange.internalId,
      symbol: selectedSymbol,
      symbolsData: symbols,
      tradeApiToken: storeSession.tradeApi.accessToken,
      // coinRayToken: coinRayToken,
      // regenerateAccessToken: getCoinrayToken,
    };
    const dataFeed = new VcceDataFeed(options);

    const widgetOptions = createWidgetOptions(
      dataFeed,
      selectedSymbol.tradeViewSymbol,
      storeSettings.darkStyle,
    );

    const cleanupWidget = instantiateWidget(widgetOptions);

    return () => {
      cleanupWidget();
    };
  };

  // Create Trading View widget when TV external library is ready.
  useEffect(bootstrapWidget, [libraryReady, tradingViewWidget, selectedSymbol]);

  const changeTheme = () => {
    const reloadWidget = () => {
      tradingViewWidget.remove();
      setTradingViewWidget(null);
      bootstrapWidget();
    };

    if (tradingViewWidget) {
      const options = tradingViewWidget.options;
      if (storeSettings.darkStyle && options.theme !== "dark") {
        reloadWidget();
      }

      if (!storeSettings.darkStyle && options.theme !== "light") {
        reloadWidget();
      }
    }
  };
  useEffect(changeTheme, [storeSettings.darkStyle]);

  // Force initial price notification.
  const initDataFeedSymbol = () => {
    const checkExist = setInterval(() => {
      if (
        tradingViewWidget &&
        tradingViewWidget.iframe &&
        tradingViewWidget.iframe.contentWindow &&
        selectedSymbol
      ) {
        handleSymbolChange(selectedSymbol.short);
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
    const newSymbol = resolveSymbolData(selectedOption);
    setSelectedSymbol(newSymbol);

    if (tradingViewWidget && tradingViewWidget.iframe) {
      const symbolTV = getTradingViewExchangeSymbol(
        newSymbol.tradeViewSymbol,
        storeSettings.selectedExchange,
      );
      tradingViewWidget.iframe.contentWindow.postMessage(
        { name: "set-symbol", data: { symbol: symbolTV } },
        "*",
      );
    }
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
            <div className="tradingViewChart" id="trading_view_chart" />
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
  const storeSettings = useStoreSettingsSelector();
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

  if (!storeSettings.selectedExchange.internalId) {
    return <ConnectExchange />;
  }

  return <TradingView />;
};

export default React.memo(TradingViewWrapper);

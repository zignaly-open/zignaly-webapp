import React, { useEffect, useState } from "react";
import { isNumber } from "lodash";
import { useDispatch } from "react-redux";
import { FormProvider, useForm } from "react-hook-form";
import tradeApi from "../../../services/tradeApiClient";
import {
  createWidgetOptions,
  mapExchangeConnectionToTradingViewId,
} from "../../../tradingView/dataFeedOptions";
import { formatPrice } from "../../../utils/formatters";
import StrategyForm from "../StrategyForm/StrategyForm";
import { Box, CircularProgress } from "@material-ui/core";
import TradingViewHeader from "./TradingViewHeader";
import useStoreSettingsSelector from "../../../hooks/useStoreSettingsSelector";
import useStoreSessionSelector from "../../../hooks/useStoreSessionSelector";
import { showErrorAlert } from "../../../store/actions/ui";
import "./TradingView.scss";
import ConnectExchange from "../../Modal/ConnectExchange";
import { setTerminalPair } from "../../../store/actions/settings";
import useEffectSkipFirst from "../../../hooks/useEffectSkipFirst";

/**
 * @typedef {any} TVWidget
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
  const dispatch = useDispatch();

  const getMarketData = async () => {
    const marketDataPayload = {
      token: storeSession.tradeApi.accessToken,
      exchangeInternalId: storeSettings.selectedExchange.internalId,
    };

    try {
      const data = await tradeApi.exchangeConnectionMarketDataGet(marketDataPayload);
      setMarketData(data);
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

  /**
   * Resolve last selected or default symbol for selected exchange.
   *
   * In case of not default symbol for the exchange resolves BTCUSDT.
   *
   * @returns {string} Symbol ID.
   */
  const resolveDefaultSymbol = () => {
    return (
      storeSettings.tradingTerminal.pair[storeSettings.selectedExchange.exchangeId] ||
      defaultExchangeSymbol[exchangeName] ||
      defaultExchangeSymbol.fallback
    );
  };

  const exchangeName = resolveExchangeName();
  const defaultSymbol = resolveDefaultSymbol();
  const [selectedSymbol, setSelectedSymbol] = useState(defaultSymbol);
  const [selectedExchangeId, setSelectedExchangeId] = useState(
    storeSettings.selectedExchange.internalId,
  );
  // const dataFeed = useCoinRayDataFeedFactory(selectedSymbol);
  const isLoading = tradingViewWidget === null || marketData === null;
  const isLastPriceLoading = lastPrice === null;

  const onExchangeChange = () => {
    if (selectedExchangeId !== storeSettings.selectedExchange.internalId) {
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

      setSelectedExchangeId(storeSettings.selectedExchange.internalId);
    }
  };

  useEffect(onExchangeChange, [storeSettings.selectedExchange.internalId]);

  const loadDependencies = () => {
    getMarketData();
    const checkExist = setInterval(() => {
      // @ts-ignore
      if (window.TradingView && window.TradingView.widget) {
        setLibraryReady(true);
        clearInterval(checkExist);
      }
    }, 100);
  };

  useEffect(loadDependencies, []);

  const bootstrapWidget = () => {
    // Skip if TV widget already exists or TV library is not ready.
    if (!libraryReady || tradingViewWidget) {
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
    let eventSymbol = "";
    // @ts-ignore
    const handleWidgetReady = (event) => {
      const dataRaw = /** @type {Object<string, any>} */ event.data;
      if (typeof dataRaw === "string") {
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
      }
    };

    window.addEventListener("message", handleWidgetReady);

    return () => {
      if (tradingViewWidget) {
        tradingViewWidget.remove();
        setTradingViewWidget(null);
        window.removeEventListener("message", handleWidgetReady);
      }
    };
  };

  // Create Trading View widget when TV external library is ready.
  useEffect(bootstrapWidget, [libraryReady, tradingViewWidget]);

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
    // setTerminalPair(selectedOption);
    const symbolSuffix =
      storeSettings.selectedExchange.exchangeType.toLocaleLowerCase() === "futures" ? "PERP" : "";
    const symbolCode = selectedOption.replace("/", "") + symbolSuffix;
    const exchangeId = mapExchangeConnectionToTradingViewId(exchangeName);

    if (tradingViewWidget && tradingViewWidget.iframe) {
      tradingViewWidget.iframe.contentWindow.postMessage(
        { name: "set-symbol", data: { symbol: `${exchangeId}:${symbolCode}` } },
        "*",
      );
    }
  };

  // Save symbol when changed
  const saveSelectedSymbol = () => {
    dispatch(
      setTerminalPair({
        exchangeId: storeSettings.selectedExchange.exchangeId,
        pair: selectedSymbol,
      }),
    );
  };
  useEffectSkipFirst(saveSelectedSymbol, [selectedSymbol]);

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
    <>
      <FormProvider {...methods}>
        <Box className="tradingTerminal" display="flex" flexDirection="column" width={1}>
          {!isLoading && (
            <TradingViewHeader
              handleSymbolChange={handleSymbolChange}
              selectedSymbol={selectedSymbol}
              symbolsList={marketData}
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
      </FormProvider>
    </>
  );
};

const TradingViewWrapper = () => {
  const storeSettings = useStoreSettingsSelector();
  if (!storeSettings.selectedExchange.internalId) {
    return <ConnectExchange />;
  }

  return <TradingView />;
};

export default React.memo(TradingViewWrapper);

import React, { useEffect, useState } from "react";
import { size } from "lodash";
import { widget as TradingViewWidget } from "../../../tradingView/charting_library.min";
import CustomSelect from "../../CustomSelect/CustomSelect";
import { createWidgetOptions } from "../../../tradingView/dataFeedOptions";
import { FormattedMessage } from "react-intl";
import tradeApi from "../../../services/tradeApiClient";
import StrategyForm from "../StrategyForm/StrategyForm";
import { Box, CircularProgress } from "@material-ui/core";
import useCoinRayDataFeedFactory from "../../../hooks/useCoinRayDataFeedFactory";
import useStoreSessionSelector from "../../../hooks/useStoreSessionSelector";
import useStoreSettingsSelector from "../../../hooks/useStoreSettingsSelector";
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
  const [tradingViewWidget, setTradingViewWidget] = useState(null);
  const [ownCopyTradersProviders, setOwnCopyTradersProviders] = useState([]);
  const [lastPrice, setLastPrice] = useState(null);
  const storeSession = useStoreSessionSelector();
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

  /*
   * @type {TVWidget} tradingViewWidgetPointer
   */
  const tradingViewWidgetTyped = tradingViewWidget;
  const isLoading = tradingViewWidget === null;
  const isLastPriceLoading = lastPrice === null;
  const loadOwnCopyTradersProviders = () => {
    const payload = {
      token: storeSession.tradeApi.accessToken,
      internalExchangeId: storeSettings.selectedExchange.internalId,
    };

    tradeApi.userOwnCopyTradersProvidersOptions(payload).then((copyTradersProvidersOptions) => {
      const digestedOptions = copyTradersProvidersOptions.map((copyTradersProvidersOption) => {
        return {
          label: copyTradersProvidersOption.providerName,
          val: copyTradersProvidersOption.providerId,
        };
      });

      setOwnCopyTradersProviders(digestedOptions);
    });
  };

  useEffect(loadOwnCopyTradersProviders, [storeSettings.selectedExchange.internalId]);

  const onExchangeChange = () => {
    const newExchangeName =
      storeSettings.selectedExchange.exchangeName || storeSettings.selectedExchange.name;
    const newDefaultSymbol =
      defaultExchangeSymbol[newExchangeName] || defaultExchangeSymbol.fallback;
    if (tradingViewWidget) {
      console.log("exchange changed.");
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

  // @ts-ignore
  const symbolsList = dataFeed ? dataFeed.getSymbolsData() : [];
  // @ts-ignore
  const symbolsOptions = symbolsList.map((symbolItem) => {
    return {
      label: symbolItem.symbol,
      value: symbolItem.id,
    };
  });

  /**
   * @typedef {Object} OptionValue
   * @property {string} label
   * @property {string} value
   */

  /**
   * Change selected symbol.
   *
   * @param {OptionValue} selectedOption Selected symbol option object.
   * @returns {Void} None.
   */
  const handleSymbolChange = (selectedOption) => {
    setSelectedSymbol(/** @type {string} */ (selectedOption.label));

    // Change chart data to the new selected symbol.
    if (tradingViewWidget) {
      const chart = tradingViewWidgetTyped.chart();
      chart.setSymbol(selectedOption.label, () => {
        // @ts-ignore
        const priceCandle = dataFeed.getLastCandle();
        setLastPrice(priceCandle);
      });
    }
  };

  const selectedProviderValue = ownCopyTradersProviders[0] ? ownCopyTradersProviders[0].label : "";

  return (
    <Box className="tradingTerminal" display="flex" flexDirection="column" width={1}>
      {!isLoading && (
        <Box bgcolor="grid.content" className="controlsBar" display="flex" flexDirection="row">
          <Box
            alignContent="left"
            className="symbolsSelector"
            display="flex"
            flexDirection="column"
          >
            <FormattedMessage id="terminal.browsecoins" />
            <CustomSelect
              label=""
              onChange={handleSymbolChange}
              options={symbolsOptions}
              search={true}
              value={selectedSymbol}
            />
          </Box>
          {size(ownCopyTradersProviders) > 1 && (
            <Box
              alignContent="left"
              className="providersSelector"
              display="flex"
              flexDirection="column"
            >
              <FormattedMessage id="terminal.providers" />
              <CustomSelect
                label=""
                onChange={() => {}}
                options={ownCopyTradersProviders}
                search={true}
                value={selectedProviderValue}
              />
            </Box>
          )}
        </Box>
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
          <Box className="loadProgress" display="flex" flexDirection="row" justifyContent="center">
            <CircularProgress disableShrink />
          </Box>
        )}
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
  );
};

export default React.memo(TradingView);

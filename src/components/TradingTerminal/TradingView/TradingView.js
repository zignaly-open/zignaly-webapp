import React, { useEffect, useState } from "react";
import { Box } from "@material-ui/core";
import { widget as TradingViewWidget } from "../../../tradingView/charting_library.min";
import "./TradingView.scss";
import { createWidgetOptions } from "../../../tradingView/dataFeedOptions";
import useCoinRayDataFeedFactory from "../../../hooks/useCoinRayDataFeedFactory";
import CustomSelect from "../../CustomSelect/CustomSelect";
import { FormattedMessage } from "react-intl";
import tradeApi from "../../../services/tradeApiClient";
import useStoreSessionSelector from "../../../hooks/useStoreSessionSelector";
import useStoreSettingsSelector from "../../../hooks/useStoreSettingsSelector";

const TradingView = () => {
  const [selectedSymbol, setSelectedSymbol] = useState("BTCUSDT");
  const [tradingViewWidget, setTradingViewWidget] = useState(null);
  const [ownCopyTradersProviders, setOwnCopyTradersProviders] = useState([]);
  const dataFeed = useCoinRayDataFeedFactory(selectedSymbol);
  const storeSession = useStoreSessionSelector();
  const storeSettings = useStoreSettingsSelector();

  const drawLine = () => {
    const orderPrice = 9600;
    const chart = tradingViewWidget.chart();
    const coloring3 = "rgb(117, 16, 197)";
    chart
      .createPositionLine({})
      .setPrice(orderPrice)
      .setQuantity(`${orderPrice}`)
      .setText("Price")
      // horizontal line
      .setLineColor(coloring3)
      // content text
      .setBodyTextColor(coloring3)
      // content text border
      .setBodyBorderColor(coloring3)
      // accompanying number
      .setQuantityBackgroundColor(coloring3)
      // accompanying number border
      .setQuantityBorderColor(coloring3);
  };

  const customizeChart = () => {
    if (tradingViewWidget !== null) {
      drawLine();
    }
  };

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

  const bootstrapWidget = () => {
    if (dataFeed) {
      const widgetOptions = createWidgetOptions(dataFeed, selectedSymbol);
      const widgetInstance = new TradingViewWidget(widgetOptions);
      widgetInstance.onChartReady(customizeChart);
      setTradingViewWidget(widgetInstance);
    }

    return () => {
      if (tradingViewWidget) {
        tradingViewWidget.remove();
      }
    };
  };

  // Create Trading View widget when data feed token is ready.
  useEffect(bootstrapWidget, [dataFeed]);

  const symbolsList = dataFeed ? dataFeed.getSymbolsData() : [];
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
    setSelectedSymbol(/** @type {string} */ (selectedOption.value));

    // Change chart data to the new selected symbol.
    if (tradingViewWidget) {
      const chart = tradingViewWidget.chart();
      chart.setSymbol(selectedOption.value, () => {});
    }
  };

  const selectedProviderValue = ownCopyTradersProviders[0] ? ownCopyTradersProviders[0].label : "";

  return (
    <Box className="tradingTerminal" display="flex" flexDirection="column" width={1}>
      <Box bgcolor="grid.content" className="controlsBar">
        <Box
          alignContent="left"
          className="providersSelector"
          display="flex"
          flexDirection="column"
        >
          <FormattedMessage id="terminal.providers" />
          <CustomSelect
            label=""
            onChange={handleSymbolChange}
            options={ownCopyTradersProviders}
            search={true}
            value={selectedProviderValue}
          />
        </Box>
        <Box alignContent="left" className="symbolsSelector" display="flex" flexDirection="column">
          <FormattedMessage id="terminal.browsecoins" />
          <CustomSelect
            label=""
            onChange={handleSymbolChange}
            options={symbolsOptions}
            search={true}
            value={selectedSymbol}
          />
        </Box>
      </Box>
      <Box
        bgcolor="grid.content"
        className="tradingViewContainer"
        display="flex"
        flexDirection="row"
        width={1}
      >
        <Box className="tradingViewChart" id="trading_view_chart" />
        <Box className="strategyPanels" textAlign="center">
          <FormattedMessage id="terminal.strategy" />
        </Box>
      </Box>
    </Box>
  );
};

export default TradingView;

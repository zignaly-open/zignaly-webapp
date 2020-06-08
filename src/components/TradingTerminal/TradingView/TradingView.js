import React, { useEffect, useState } from "react";
import { Box } from "@material-ui/core";
import { widget as TradingViewWidget } from "../../../tradingView/charting_library.min";
import "./TradingView.scss";
import { createWidgetOptions } from "../../../tradingView/dataFeedOptions";
import useCoinRayDataFeedFactory from "../../../hooks/useCoinRayDataFeedFactory";
import CustomSelect from "../../CustomSelect/CustomSelect";

const TradingView = () => {
  const [selectedSymbol, setSelectedSymbol] = useState("BTCUSDT");
  const dataFeed = useCoinRayDataFeedFactory(selectedSymbol);

  /**
   * @typedef {import("../../../tradingView/charting_library.min.js").IChartingLibraryWidget} Widget
   * @type {Widget|null} tvInstacne
   */
  let tvInstance = null;

  const drawLine = () => {
    const orderPrice = 9600;
    const chart = tvInstance.chart();
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
    if (tvInstance) {
      drawLine();
    }
  };

  const bootstrapWidget = () => {
    if (dataFeed) {
      const widgetOptions = createWidgetOptions(dataFeed, selectedSymbol);
      tvInstance = new TradingViewWidget(widgetOptions);
      tvInstance.onChartReady(customizeChart);
    }

    return () => {
      if (tvInstance) {
        tvInstance.remove();
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
  };

  return (
    <Box className="positionsTable" display="flex" flexDirection="column" width={1}>
      <CustomSelect onChange={handleSymbolChange} options={symbolsOptions} search={true} />
      <div className="tradingView" id="trading_view_chart" />
    </Box>
  );
};

export default TradingView;

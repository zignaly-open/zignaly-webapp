import React, { useEffect } from "react";
import { Box, Button } from "@material-ui/core";
import { useForm, FormContext } from "react-hook-form";
import "./StrategyForm.scss";
import StrategyPanel from "../StrategyPanel/StrategyPanel";
import TakeProfitPanel from "../TakeProfitPanel/TakeProfitPanel";
import DCAPanel from "../DCAPanel/DCAPanel";
import StopLossPanel from "../StopLossPanel/StopLossPanel";
import TrailingStopPanel from "../TrailingStopPanel/TrailingStopPanel";

/**
 * @typedef {import("../../../services/coinRayDataFeed").MarketSymbol} MarketSymbol
 * @typedef {import("../../../services/coinRayDataFeed").CoinRayCandle} CoinRayCandle
 */

/**
 * @typedef {Object} StrategyFormProps
 * @property {Object} dataFeed
 * @property {CoinRayCandle} lastPriceCandle
 * @property {number} leverage
 * @property {string} selectedSymbol
 */

/**
 * Manual trading strategy form component.
 *
 * @param {StrategyFormProps} props Component props.
 * @returns {JSX.Element} Strategy form element.
 */
const StrategyForm = (props) => {
  const { dataFeed, lastPriceCandle, leverage, selectedSymbol } = props;
  const currentPrice = parseFloat(lastPriceCandle[1]).toFixed(8);
  const methods = useForm({
    mode: "onChange",
    defaultValues: {
      price: currentPrice,
      realInvestment: "",
      positionSize: "",
      units: "",
      entryType: "LONG",
    },
  });
  // Receives submitted data.
  const onSubmit = () => {};
  // @ts-ignore
  const symbolsData = dataFeed.getSymbolsData();
  const updatePriceField = () => {
    methods.setValue("price", currentPrice);
  };

  useEffect(updatePriceField, [currentPrice]);

  /**
   * Match current symbol against market symbols collection item.
   *
   * @param {MarketSymbol} item Market symbol item.
   * @returns {boolean} TRUE when ID matches, FALSE otherwise.
   */
  const matchCurrentSymbol = (item) => item.id === selectedSymbol;
  const currentSymbolData = symbolsData.find(matchCurrentSymbol);

  return (
    <FormContext {...methods}>
      <Box className="strategyForm" textAlign="center">
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <StrategyPanel
            disableExpand={true}
            lastPriceCandle={lastPriceCandle}
            leverage={leverage}
            symbolData={currentSymbolData}
          />
          <TakeProfitPanel lastPriceCandle={lastPriceCandle} symbolData={currentSymbolData} />
          <DCAPanel symbolData={currentSymbolData} />
          <StopLossPanel symbolData={currentSymbolData} />
          <TrailingStopPanel symbolData={currentSymbolData} />
          <Button type="submit">Open Position</Button>
        </form>
      </Box>
    </FormContext>
  );
};

export default StrategyForm;

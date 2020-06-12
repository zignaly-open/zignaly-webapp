import React from "react";
import { Box, Button } from "@material-ui/core";
import { useForm, FormContext } from "react-hook-form";
import "./StrategyForm.scss";
import StrategyPanel from "../StrategyPanel/StrategyPanel";

/**
 * @typedef {import("../../../services/coinRayDataFeed").MarketSymbol} MarketSymbol
 */

const StrategyForm = (props) => {
  const { dataFeed, selectedSymbol } = props;
  const methods = useForm({
    mode: "onChange",
  });
  // Receives submitted data.
  const onSubmit = () => {};
  const symbolsData = dataFeed.getSymbolsData();

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
          <StrategyPanel disableExpand={true} symbolData={currentSymbolData} />
          <Button type="submit">Open Position</Button>
        </form>
      </Box>
    </FormContext>
  );
};

export default StrategyForm;

import React, { useEffect } from "react";
import { Box, Button } from "@material-ui/core";
import { useForm, FormContext, useFormContext } from "react-hook-form";
import "./StrategyForm.scss";
import StrategyPanel from "../StrategyPanel/StrategyPanel";

const StrategyForm = (props) => {
  const { dataFeed, selectedSymbol } = props;
  const methods = useForm({
    mode: "onChange",
  });
  const onSubmit = (data) => console.log(data);
  const symbolsData = dataFeed.getSymbolsData();
  const currentSymbolData = symbolsData.find((item) => item.id === selectedSymbol);

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

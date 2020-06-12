import React from "react";
import { Box, Button } from "@material-ui/core";
import { useForm, FormContext, useFormContext } from "react-hook-form";
import "./StrategyForm.scss";
import StrategyPanel from "../StrategyPanel/StrategyPanel";

const StrategyForm = () => {
  const methods = useForm({
    mode: "onChange",
  });
  const onSubmit = (data) => console.log(data);

  return (
    <FormContext {...methods}>
      <Box className="strategyForm" textAlign="center">
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <StrategyPanel disableExpand={true} />
          <Button type="submit">Open Position</Button>
        </form>
      </Box>
    </FormContext>
  );
};

export default StrategyForm;

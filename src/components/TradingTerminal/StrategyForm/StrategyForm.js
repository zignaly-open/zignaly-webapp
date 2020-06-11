import React from "react";
import { Box } from "@material-ui/core";
import "./StrategyForm.scss";
import StrategyPanel from "../StrategyPanel/StrategyPanel";

const StrategyForm = () => {
  return (
    <Box className="strategyForm" textAlign="center">
      <StrategyPanel disableExpand={true} />
      <StrategyPanel />
    </Box>
  );
};

export default StrategyForm;

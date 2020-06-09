import React from "react";
import { Box } from "@material-ui/core";
import { Helmet } from "react-helmet";
import { TradingView } from "../../components/TradingTerminal";

const TradingTerminal = () => {
  return (
    <>
      <Helmet>
        <title>Trading Terminal</title>
      </Helmet>
      <TradingView />
    </>
  );
};

export default TradingTerminal;

import React from "react";
import { Box } from "@material-ui/core";
import { Helmet } from "react-helmet";

const TradingTerminal = () => {
  return (
    <>
      <Helmet>
        <title>Trading Terminal</title>
      </Helmet>
      <Box className="dashboard" display="flex" flexDirection="row" justifyContent="center">
        <h1>I will be the Trading Terminal</h1>
      </Box>
    </>
  );
};

export default TradingTerminal;

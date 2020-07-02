import React from "react";
import { Box } from "@material-ui/core";
import { Helmet } from "react-helmet";
import { PositionsTabs } from "../../../components/Dashboard/PositionsTabs";

const CopyTradersPositions = () => {
  return (
    <>
      <Helmet>
        <title>CopyTrader | Positions</title>
      </Helmet>
      <Box className="positionsPage" display="flex" flexDirection="row" justifyContent="center">
        <PositionsTabs isProfile={true} />
      </Box>
    </>
  );
};

export default CopyTradersPositions;

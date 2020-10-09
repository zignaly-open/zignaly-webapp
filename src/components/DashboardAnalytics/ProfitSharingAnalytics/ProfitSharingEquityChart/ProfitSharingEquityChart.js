import React, { useState } from "react";
import { Box, Typography, CircularProgress } from "@material-ui/core";
import TotalEquityGraph from "../../../Balance/TotalEquity/TotalEquityGraph";
import TitleBar from "../../../Balance/TotalEquity//TitleBar";
import EquityFilter from "../../../Balance/TotalEquity//EquityFilter";
import EquityGraphLabels from "../../../Balance/TotalEquity//GraphLabels";

const ProfitSharingEquityChart = () => {
  const balance = {
    totalUSDT: 100,
    totalBTC: 0.01,
    pnlBTC: 0,
    pnlUSDT: 0,
    totalFreeBTC: 0,
    totalFreeUSDT: 0,
    totalLockedBTC: 0,
    totalLockedUSDT: 0,
  };

  const balancesTest = [
    {
      totalUSDT: 100,
      totalBTC: 0.01,
      date: "2020-10-08",
    },
    {
      totalUSDT: 60,
      totalBTC: 0.006,
      date: "2020-10-07",
    },
    {
      totalUSDT: 50,
      totalBTC: 0.005,
      date: "2020-10-06",
    },
  ];
  const [balances, setBalances] = useState(balancesTest);

  return (
    <Box
      alignItems="flex-start"
      className="totalEquity"
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
    >
      <Box
        alignItems="flex-start"
        className="equityHeader"
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
        width="100%"
      >
        <TitleBar balance={balance} />
        <EquityFilter list={balances} onChange={(b) => setBalances(b)} />
      </Box>
      <Box width={1}>
        <TotalEquityGraph list={balances} modal={false} />
        <EquityGraphLabels list={balances} />
      </Box>
    </Box>
  );
};

export default ProfitSharingEquityChart;

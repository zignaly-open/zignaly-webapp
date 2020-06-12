import React, { useEffect, useState } from "react";
import "./balance.scss";
import { Box } from "@material-ui/core";
import { compose } from "recompose";
import withDashboardLayout from "../../../layouts/dashboardLayout";
import { Helmet } from "react-helmet";
import TotalEquity from "../../../components/Balance/TotalEquity";
import CryptoComposition from "../../../components/Balance/CryptoComposition";
import AvailableBalance from "../../../components/Balance/AvailableBalance";
import History from "../../../components/Balance/History";
import useStoreUserSelector from "../../../hooks/useStoreUserSelector";

const Balance = () => {
  const storeUser = useStoreUserSelector();

  console.log(storeUser.dailyBalance);

  return (
    <>
      <Helmet>
        <title>Balance</title>
      </Helmet>
      <Box
        className="balancePage"
        display="flex"
        flexDirection="row"
        flexWrap="wrap"
        justifyContent="center"
      >
        <Box className="equityBox">
          <TotalEquity balances={storeUser.dailyBalance.balances} />
        </Box>
        <Box className="cryptoBox">
          <CryptoComposition
            balances={storeUser.dailyBalance.balances}
            quotes={storeUser.dailyBalance.quotes}
          />
        </Box>
        <Box className="balanceBox">
          <AvailableBalance balance={storeUser.balance} />
        </Box>
        <Box className="historyBox">
          <History
            balances={storeUser.dailyBalance.balances}
            quotes={storeUser.dailyBalance.quotes}
          />
        </Box>
      </Box>
    </>
  );
};

export default compose(withDashboardLayout)(Balance);

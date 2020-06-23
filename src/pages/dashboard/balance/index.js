import React from "react";
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
import useBalance from "../../../hooks/useBalance";
import useStoreSettingsSelector from "../../../hooks/useStoreSettingsSelector";

const Balance = () => {
  const storeUser = useStoreUserSelector();
  const storeSettings = useStoreSettingsSelector();
  const balance = useBalance(storeSettings.selectedExchange.internalId);

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
          <TotalEquity dailyBalance={storeUser.dailyBalance} />
        </Box>
        <Box className="cryptoBox">
          <CryptoComposition dailyBalance={storeUser.dailyBalance} />
        </Box>
        <Box className="balanceBox">
          <AvailableBalance balance={balance} />
        </Box>
        <Box className="historyBox">
          <History dailyBalance={storeUser.dailyBalance} />
        </Box>
      </Box>
    </>
  );
};

export default compose(withDashboardLayout)(Balance);

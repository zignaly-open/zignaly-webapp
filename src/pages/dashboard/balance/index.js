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

const Balance = () => {
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
          <TotalEquity />
        </Box>
        <Box className="cryptoBox">
          <CryptoComposition />
        </Box>
        <Box className="balanceBox">
          <AvailableBalance />
        </Box>
        <Box className="historyBox">
          <History />
        </Box>
      </Box>
    </>
  );
};

export default compose(withDashboardLayout)(Balance);

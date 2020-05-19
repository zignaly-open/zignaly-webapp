import React from "react";
import "./balance.scss";
import { Box } from "@material-ui/core";
import { compose } from "recompose";
import withAppLayout from "../../../layouts/appLayout";
import withDashboardLayout from "../../../layouts/dashboardLayout";
import withPageContext from "../../../pageContext";
import Helmet from "react-helmet";
import TotalEquity from "../../../components/Balance/TotalEquity";
import CryptoComposition from "../../../components/Balance/CryptoComposition";
import AvailableBalance from "../../../components/Balance/AvailableBalance";
import History from "../../../components/Balance/History";

const Balance = () => {
  const balance = {
    total: "",
    available: "",
    profit: "",
    invested: "",
  };

  const crypto = {
    BTC: "",
    ETH: "",
  };

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
          <CryptoComposition crypto={crypto} />
        </Box>
        <Box className="balanceBox">
          <AvailableBalance balance={balance} />
        </Box>
        <Box className="historyBox">
          <History />
        </Box>
      </Box>
    </>
  );
};

export default compose(withPageContext, withAppLayout, withDashboardLayout)(Balance);

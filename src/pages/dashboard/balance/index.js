import React, { Fragment } from "react";
import "./balance.scss";
import { Box } from "@material-ui/core";
import { compose } from "recompose";
import withDashboardLayout from "../../../layouts/dashboardLayout";
import { Helmet } from "react-helmet";
import TotalEquity from "../../../components/Balance/TotalEquity";
import CryptoComposition from "../../../components/Balance/CryptoComposition";
import AvailableBalance from "../../../components/Balance/AvailableBalance";
import History from "../../../components/Balance/History";
import { useStoreUserDailyBalance } from "../../../hooks/useStoreUserSelector";
import useBalance from "../../../hooks/useBalance";
import useStoreSettingsSelector from "../../../hooks/useStoreSettingsSelector";
import { useIntl } from "react-intl";

const Balance = () => {
  const dailyBalance = useStoreUserDailyBalance();
  const storeSettings = useStoreSettingsSelector();
  const balance = useBalance(storeSettings.selectedExchange.internalId);
  const intl = useIntl();

  return (
    <>
      <Helmet>
        <title>
          {`${intl.formatMessage({ id: "product" })} | ${intl.formatMessage({
            id: "dashboard",
          })} | ${intl.formatMessage({
            id: "dashboard.balance",
          })}`}
        </title>
      </Helmet>
      <Box
        className="balancePage"
        display="flex"
        flexDirection="row"
        flexWrap="wrap"
        justifyContent="center"
      >
        <Box className="equityBox">
          <TotalEquity dailyBalance={dailyBalance} />
        </Box>
        <Box className="cryptoBox">
          <CryptoComposition dailyBalance={dailyBalance} />
        </Box>
        <Box className="balanceBox">
          <AvailableBalance balance={balance} />
        </Box>
        <Box className="historyBox">
          <History dailyBalance={dailyBalance} />
        </Box>
      </Box>
    </>
  );
};

export default compose(withDashboardLayout)(Balance);

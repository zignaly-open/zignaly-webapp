import React, { useEffect } from "react";
import "./PrivateAreaLayout.scss";
import { Box, Hidden } from "@material-ui/core";
import Header from "../../components/Navigation/Header";
import MobileHeader from "../../components/Navigation/MobileHeader";
import MobileAppbar from "../../components/Navigation/MobileAppbar";
import Sidebar from "../../components/Navigation/Sidebar";
import GlobalModal from "../../components/GlobalModal";
import ConnectExchangeView from "../../components/ConnectExchangeView";
import SettingsView from "../../components/SettingsView";
import WalletView from "../../components/WalletView";
import { useDispatch } from "react-redux";
import { refreshSessionData } from "../../store/actions/session";
import { minToMillisec } from "../../utils/timeConvert";
import { ConfirmDialog } from "../../components/Dialogs";
import useInterval from "../../hooks/useInterval";
import useAppUpdatesCheck from "../../hooks/useAppUpdatesCheck";
import usePrivateAreaContext from "hooks/usePrivateAreaContext";
import PrivateAreaContext from "context/PrivateAreaContext";
import useUpdatedBalance from "hooks/useUpdatedBalance";
import tradeApi from "services/tradeApiClient";

/**
 * @typedef {Object} PrivateAreaLayoutProps
 * @property {Object} children
 */

/**
 * Default component props.
 *
 * @param {PrivateAreaLayoutProps} props Default component props.
 * @returns {JSX.Element} Component.
 */
const PrivateAreaLayout = (props) => {
  const { children } = props;
  const dispatch = useDispatch();
  const privateAreaContext = usePrivateAreaContext();
  const { setUserProviders } = privateAreaContext;

  // Load balance in the context to show in the header, and to show the "Add Fund" button
  useUpdatedBalance(privateAreaContext);

  useEffect(() => {
    // Get connected signal provider to know if we need to display "Connected Providers" tab in the dashboard.
    // Also get connected profit sharing to know if we should display "Start with PS" button
    tradeApi.providersUserGet().then((response) => {
      setUserProviders(response);
    });
  }, []);

  const updateSession = () => {
    dispatch(refreshSessionData());
  };

  useInterval(updateSession, minToMillisec(60), true);

  const { confirmConfig, setConfirmConfig, executeRefresh, postponeRefresh } = useAppUpdatesCheck();

  return (
    <PrivateAreaContext.Provider value={privateAreaContext}>
      <ConfirmDialog
        confirmConfig={confirmConfig}
        executeActionCallback={executeRefresh}
        executeCancelCallback={postponeRefresh}
        setConfirmConfig={setConfirmConfig}
      />
      <GlobalModal content={ConnectExchangeView} hash="exchangeAccounts" />
      <GlobalModal content={SettingsView} hash="settings" />
      <GlobalModal content={WalletView} hash="wallet" />
      {/* <GlobalModal content={WalletDepositView} hash="deposit" /> */}
      <Box bgcolor="background.default" className={"app"}>
        <Hidden xsDown>
          <Header />
        </Hidden>
        <Hidden smUp>
          <MobileHeader />
          <MobileAppbar />
        </Hidden>
        <Box className={"body"} display="flex" flexDirection="row" flexWrap="nowrap">
          <Hidden xsDown>
            <Box className={"side"}>
              <Sidebar />
            </Box>
          </Hidden>
          <Box className={"appContent"}>{children}</Box>
        </Box>
      </Box>
    </PrivateAreaContext.Provider>
  );
};

export default PrivateAreaLayout;

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
import { useDispatch } from "react-redux";
import { refreshSessionData } from "../../store/actions/session";
import { minToMillisec } from "../../utils/timeConvert";
import { ConfirmDialog } from "../../components/Dialogs";
import useInterval from "../../hooks/useInterval";
import useAppUpdatesCheck from "../../hooks/useAppUpdatesCheck";
import usePrivateAreaContext from "hooks/usePrivateAreaContext";
import PrivateAreaContext from "context/PrivateAreaContext";
import useSelectedExchange from "hooks/useSelectedExchange";
import useConnectedProvidersList from "hooks/useConnectedProvidersList";
import useUpdatedBalance from "hooks/useUpdatedBalance";

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
  const selectedExchange = useSelectedExchange();
  const dispatch = useDispatch();
  const privateAreaContext = usePrivateAreaContext();
  const { setProviderCount, setProfitSharingCount, setBalance } = privateAreaContext;
  // Get connected signal provider to know if we need to display "Connected Providers" tab in the dashboard.
  // Also get connected profit sharing to know if we should display "Start with PS" button
  const { providers } = useConnectedProvidersList(
    selectedExchange.internalId,
    ["signalProvider", "profitSharing"],
    true,
  );

  // Balance to show in the header, and to show the "Add Fund" button
  const balance = useUpdatedBalance();

  useEffect(() => {
    if (!providers) return;

    const providersCount = providers.filter((item) => item.type === "signalProvider").length;
    const profitSharingCount = providers.filter((item) => item.type === "profitSharing").length;
    setProviderCount(providersCount);
    setProfitSharingCount(profitSharingCount);
  }, [providers]);

  useEffect(() => {
    setBalance(balance);
  }, [balance]);

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

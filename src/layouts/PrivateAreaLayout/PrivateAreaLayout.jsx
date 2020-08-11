import React from "react";
import { compose } from "recompose";
import "./PrivateAreaLayout.scss";
import { Box, Hidden } from "@material-ui/core";
import Header from "../../components/Navigation/Header";
import MobileHeader from "../../components/Navigation/MobileHeader";
import MobileAppbar from "../../components/Navigation/MobileAppbar";
import Sidebar from "../../components/Navigation/Sidebar";
import GlobalModal from "../../components/GlobalModal";
import ConnectExchangeView from "../../components/ConnectExchangeView";
import withPageContext from "../../pageContext/withPageContext";
import SettingsView from "../../components/SettingsView";
import useScript from "../../hooks/useScript";
import { withPrefix } from "gatsby";
import { useDispatch } from "react-redux";
import useStoreSessionSelector from "../../hooks/useStoreSessionSelector";
import { refreshSessionData } from "../../store/actions/session";
import useInterval from "../../hooks/useInterval";
import { minToMillisec } from "../../utils/timeConvert";
import { showErrorAlert } from "../../../types/store/actions/ui";

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
  const storeSession = useStoreSessionSelector();
  const dispatch = useDispatch();
  useScript(withPrefix("widgets/customerSupportWidget.js"));

  const updateSession = () => {
    dispatch(refreshSessionData(storeSession.tradeApi.accessToken));
  };

  useInterval(updateSession, minToMillisec(60), true);

  const appUpdatesCheck = () => {
    try {
      fetch(withPrefix("version.json")).then(async (response) => {
        const version = await response.json();
        console.log("version: ", version);
      });
    } catch (e) {
      showErrorAlert(e);
    }
  };

  useInterval(appUpdatesCheck, minToMillisec(0.3), true);

  return (
    <>
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
    </>
  );
};

export default compose(withPageContext)(PrivateAreaLayout);

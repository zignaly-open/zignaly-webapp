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

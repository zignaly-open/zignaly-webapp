import React, { useMemo } from "react";
import { compose } from "recompose";
import "./PrivateAreaLayout.scss";
import { ThemeProvider, createMuiTheme, StylesProvider } from "@material-ui/core/styles";
import { CssBaseline, Box, Hidden } from "@material-ui/core";
import themeData from "../../services/theme";
import { useDispatch } from "react-redux";
import Header from "../../components/Navigation/Header";
import MobileHeader from "../../components/Navigation/MobileHeader";
import MobileAppbar from "../../components/Navigation/MobileAppbar";
import Sidebar from "../../components/Navigation/Sidebar";
import ErrorAlert from "../../components/Alerts/ErrorAlert";
import SuccessAlert from "../../components/Alerts/SuccessAlert";
import Modal from "../../components/Modal";
import ConnectExchangeView from "../../components/ConnectExchangeView";
import useStoreSettingsSelector from "../../hooks/useStoreSettingsSelector";
import userStoreUIModalSelector from "../../hooks/useStoreUIModalSelector";
import { openExchangeConnectionView, openSettingsView } from "../../store/actions/ui";
import withPageContext from "../../pageContext/withPageContext";
import SettingsView from "../../components/SettingsView";
import Loader from "../../components/Loader";
import useStoreUILoaderSelector from "../../hooks/useStoreUILoaderSelector";

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
  const storeSettings = useStoreSettingsSelector();
  const storeModal = userStoreUIModalSelector();
  const storeLoader = useStoreUILoaderSelector();
  const dispatch = useDispatch();
  const options = themeData(storeSettings.darkStyle);
  const theme = useMemo(() => createMuiTheme(options), [options]);

  return (
    <StylesProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ErrorAlert />
        <SuccessAlert />
        {storeLoader && <Loader />}
        <Modal
          onClose={() => dispatch(openExchangeConnectionView(false))}
          persist={false}
          size="large"
          state={storeModal.exchangeConnectionView}
        >
          <ConnectExchangeView onClose={() => dispatch(openExchangeConnectionView(false))} />
        </Modal>
        <Modal
          onClose={() => dispatch(openSettingsView(false))}
          persist={false}
          size="large"
          state={storeModal.settingsView}
        >
          <SettingsView onClose={() => dispatch(openSettingsView(false))} />
        </Modal>
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
      </ThemeProvider>
    </StylesProvider>
  );
};

export default compose(withPageContext)(PrivateAreaLayout);

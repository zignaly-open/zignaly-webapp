import React, { useMemo } from "react";
import "./appLayout.scss";
import { getDisplayName } from "../../utils";
import { ThemeProvider, createMuiTheme, StylesProvider } from "@material-ui/core/styles";
import { CssBaseline, Box, Hidden } from "@material-ui/core";
import themeData from "../../services/theme";
import { useDispatch } from "react-redux";
import Header from "../../components/Navigation/Header";
import MobileHeader from "../../components/Navigation/MobileHeader";
import MobileAppbar from "../../components/Navigation/MobileAppbar";
import Sidebar from "../../components/Navigation/Sidebar";
import Alert from "../../components/Alert";
import Modal from "../../components/Modal";
import ConnectExchangeView from "../../components/ConnectExchangeView";
import useStoreSettingsSelector from "../../hooks/useStoreSettingsSelector";
import userStoreUIModalSelector from "../../hooks/useStoreUIModalSelector";
import { openExchangeConnectionView } from "../../store/actions/ui";

/**
 *  App layout is defined here, the placement of header, sidebar, mobile appbar.
 *
 * @param {React.ComponentType<any>} Component The component to wrap.
 *
 * @returns {Function} Wrapper component function.
 */
const withAppLayout = (Component) => {
  /**
   * Default component props.
   *
   * @param {Object} props Default component props.
   * @returns {Object} Component.
   */
  const WrapperComponent = (props) => {
    const storeSettings = useStoreSettingsSelector();
    const storeModal = userStoreUIModalSelector();
    const dispatch = useDispatch();
    const options = themeData(storeSettings.darkStyle);
    const theme = useMemo(() => createMuiTheme(options), [options]);

    return (
      <StylesProvider injectFirst>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Alert />
          <Modal
            onClose={() => dispatch(openExchangeConnectionView(false))}
            persist={false}
            size="large"
            state={storeModal.exchangeConnectionView}
          >
            <ConnectExchangeView onClose={() => dispatch(openExchangeConnectionView(false))} />
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
              <Box className={"appContent"}>
                <Component {...props} />
              </Box>
            </Box>
          </Box>
        </ThemeProvider>
      </StylesProvider>
    );
  };

  WrapperComponent.displayName = `Layout(${getDisplayName(Component)})`;

  return WrapperComponent;
};

export default withAppLayout;

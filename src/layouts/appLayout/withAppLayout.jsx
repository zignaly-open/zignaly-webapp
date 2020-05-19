import React, { useMemo } from "react";
import "./appLayout.scss";
import { getDisplayName } from "../../utils";
import { ThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import { CssBaseline, Box, Hidden } from "@material-ui/core";
import themeData from "../../services/theme";
import { useSelector } from "react-redux";
import Header from "../../components/Navigation/Header";
import MobileHeader from "../../components/Navigation/MobileHeader";
import MobileAppbar from "../../components/Navigation/MobileAppbar";
import Sidebar from "../../components/Navigation/Sidebar";
import Alert from "../../components/Alert";

/**
 * @typedef {import('../../store/initialState').DefaultState} DefaultState
 */

/**
 *  App layout is defined here, the placement of header, sidebar, mobile appbar.
 *
 * @param {Object} Component
 * @returns {Object} Component
 */

const withAppLayout = (Component) => {
  /**
   *
   *
   * @param {Object} props
   */
  const WrapperComponent = (props) => {
    /**
     * Settings darkStyle selector.
     *
     * @param {DefaultState} state Redux store state data.
     * @return {boolean} Flag that indicates if darkStyle is enabled.
     */

    const selector = (state) => state.settings.darkStyle;
    const darkStyle = useSelector(selector);
    const options = themeData(darkStyle);
    const theme = useMemo(() => createMuiTheme(options), [darkStyle]);

    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Alert />
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
    );
  };
  WrapperComponent.displayName = `Layout(${getDisplayName(Component)})`;
  return WrapperComponent;
};

export default withAppLayout;

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

const withAppLayout = Component => {
  const WrapperComponent = props => {
    const darkStyle = useSelector(state => state.settings.darkStyle);
    const theme = useMemo(() => createMuiTheme(themeData(darkStyle)), [darkStyle]);

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
            {/* <MobileAppbar /> */}
          </Hidden>
          <Box display="flex" flexDirection="row" flexWrap="nowrap" className={"body"}>
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

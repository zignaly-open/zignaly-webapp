import React, { useMemo, useEffect, useRef, useLayoutEffect } from "react";
import { ThemeProvider, createMuiTheme, StylesProvider } from "@material-ui/core/styles";
import { CssBaseline } from "@material-ui/core";
import themeData from "../../services/theme";
import ErrorAlert from "../../components/Alerts/ErrorAlert";
import SuccessAlert from "../../components/Alerts/SuccessAlert";
import useStoreSettingsSelector from "../../hooks/useStoreSettingsSelector";
import withPageContext from "../../pageContext/withPageContext";
import Loader from "../../components/Loader";
import useStoreUILoaderSelector from "../../hooks/useStoreUILoaderSelector";
import { triggerTz } from "../../services/tz";
import { withPrefix } from "gatsby";
import useScript from "../../hooks/useScript";

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
const AppLayout = (props) => {
  const { children } = props;
  const storeSettings = useStoreSettingsSelector();
  const storeLoader = useStoreUILoaderSelector();
  const options = themeData(storeSettings.darkStyle);
  const createTheme = () => createMuiTheme(options);
  const theme = useMemo(createTheme, [storeSettings.darkStyle]);
  const ref = useRef(null);
  useScript(withPrefix("widgets/customerSupportWidget.js"));
  useScript(withPrefix("widgets/zendeskCustomDataScript.js"));

  useLayoutEffect(() => {
    document.documentElement.setAttribute("data-theme", storeSettings.darkStyle ? "dark" : "light");
    // Avoid Chrome translation, this complements meta tag translation see:
    // https://github.com/facebook/react/issues/11538
    document.documentElement.setAttribute("class", "notranslate");
    document.documentElement.setAttribute("translate", "no");
  }, [storeSettings.darkStyle]);

  useLayoutEffect(() => {
    if (window.navigator.userAgent.includes("Windows")) {
      // Custom scrollbar on Windows
      document.documentElement.setAttribute("data-os", "win");
    }
  }, []);

  const hash = typeof window !== "undefined" ? window.location.hash : "";
  useEffect(() => {
    // Internal tracking for hash navigation
    const location = typeof window !== "undefined" ? window.location : null;
    if (hash && location) {
      triggerTz(location, ref.current);
      // Save prev location
      ref.current = location;
    }
  }, [hash]);

  return (
    <StylesProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ErrorAlert />
        <SuccessAlert />
        {storeLoader && <Loader />}
        {children}
      </ThemeProvider>
    </StylesProvider>
  );
};

export default withPageContext(AppLayout);

import React, { useMemo, useEffect, useRef, useLayoutEffect } from "react";
import { ThemeProvider, createMuiTheme, StylesProvider } from "@material-ui/core/styles";
import { CssBaseline } from "@material-ui/core";
import themeData from "../../services/theme";
import ErrorAlert from "../../components/Alerts/ErrorAlert";
import SuccessAlert from "../../components/Alerts/SuccessAlert";
import useStoreSettingsSelector from "../../hooks/useStoreSettingsSelector";
import Loader from "../../components/Loader";
import useStoreUILoaderSelector from "../../hooks/useStoreUILoaderSelector";
import { useStoreUserData } from "../../hooks/useStoreUserSelector";
import { triggerTz } from "../../services/tz";
import { withPrefix } from "gatsby";
import useScript from "../../hooks/useScript";
import { IntlProvider } from "react-intl";
import translations from "../../i18n/translations";
import { mixpanelPageView } from "utils/mixpanelApi";
import { analyticsPageView } from "utils/analyticsJsApi";

/**
 * @typedef {Object} PrivateAreaLayoutProps
 * @property {Object} children
 * @property {Boolean} [forceLightTheme]
 */

/**
 * Default component props.
 *
 * @param {PrivateAreaLayoutProps} props Default component props.
 * @returns {JSX.Element} Component.
 */
const AppLayout = (props) => {
  const { children, forceLightTheme } = props;
  const storeSettings = useStoreSettingsSelector();
  const storeUserData = useStoreUserData();
  const storeLoader = useStoreUILoaderSelector();
  const darkStyle = !forceLightTheme && storeSettings.darkStyle;
  const options = themeData(darkStyle);
  const createTheme = () => createMuiTheme(options);
  const theme = useMemo(createTheme, [darkStyle]);
  const ref = useRef(null);
  useScript(process.env.NODE_ENV !== "development" ? withPrefix("widgets/externalWidgets.js") : "");

  // Merged english messages with selected by user locale messages
  // In this case all english data would be overridden to user selected locale, but untranslated
  // (missed in object keys) just stay in english
  const mergedMessages = Object.assign(
    {},
    translations.en,
    translations[storeSettings.languageCode],
  );

  useLayoutEffect(() => {
    document.documentElement.setAttribute("data-theme", darkStyle ? "dark" : "light");
    // Avoid Chrome translation, this complements meta tag translation see:
    // https://github.com/facebook/react/issues/11538
    document.documentElement.setAttribute("class", "notranslate");
    document.documentElement.setAttribute("translate", "no");
  }, [darkStyle]);

  useLayoutEffect(() => {
    if (window.navigator.userAgent.includes("Windows")) {
      // Custom scrollbar on Windows
      document.documentElement.setAttribute("data-os", "win");
    }
  }, []);

  const href = typeof window !== "undefined" ? window.location.href : "";
  useEffect(() => {
    // Internal tracking for navigation
    if (href !== ref.current) {
      // userId can be undefined at login
      if (storeUserData.userId) {
        const location = typeof window !== "undefined" ? window.location : null;
        triggerTz(location, ref.current);
        // Save prev location
        ref.current = href;
      }
    }
  }, [href, storeUserData.userId]);

  useEffect(() => {
    if (href) {
      mixpanelPageView(href);
      analyticsPageView(href);
    }
  }, [href]);

  return (
    <IntlProvider locale={storeSettings.languageCode} messages={mergedMessages}>
      <StylesProvider injectFirst>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <ErrorAlert />
          <SuccessAlert />
          {storeLoader && <Loader />}
          {children}
        </ThemeProvider>
      </StylesProvider>
    </IntlProvider>
  );
};

export default AppLayout;

import React, { useMemo, useEffect, useRef, useLayoutEffect, useState } from "react";
import {
  ThemeProvider as MuiThemeProvider,
  createTheme,
  StylesProvider,
} from "@material-ui/core/styles";
import { ThemeProvider, StyleSheetManager } from "styled-components";
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
import { analyticsPageView } from "utils/analyticsJsApi";
import ENMessages from "../../i18n/translations/en.yml";
import { getLanguageCodefromLocale } from "i18n";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";

/**
 *
 * @typedef {Record<string, string>} MessageRecord
 */

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
  const [messages, setMessages] = useState(null);
  const { darkStyle, locale } = useStoreSettingsSelector();
  const storeUserData = useStoreUserData();
  const storeLoader = useStoreUILoaderSelector();
  const darkTheme = !forceLightTheme && darkStyle;
  const options = themeData(darkTheme);
  const theme = useMemo(() => createTheme(options), [darkTheme]);
  const ref = useRef(null);
  useScript(process.env.NODE_ENV !== "development" ? withPrefix("widgets/externalWidgets.js") : "");

  // Merged english messages with selected by user locale messages
  // In this case all english data would be overridden to user selected locale, but untranslated
  // (missed in object keys) just stay in english
  useEffect(() => {
    getMessages(locale).then((selectedLanguageMessages) => {
      const mergedMessages = Object.assign({}, ENMessages, selectedLanguageMessages);
      setMessages(mergedMessages);
    });
  }, [locale]);

  /**
   *
   * @param {string} localeValue locale code
   * @returns {Promise<MessageRecord>} returns a record
   */
  const getMessages = async (localeValue) => {
    const lang = getLanguageCodefromLocale(localeValue);
    return await translations[lang]();
  };

  useLayoutEffect(() => {
    document.documentElement.setAttribute("data-theme", darkTheme ? "dark" : "light");
    // Avoid Chrome translation, this complements meta tag translation see:
    // https://github.com/facebook/react/issues/11538
    document.documentElement.setAttribute("class", "notranslate");
    document.documentElement.setAttribute("translate", "no");
  }, [darkTheme]);

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
      triggerTz(window.location, ref.current);
      // Save prev location
      ref.current = href;
    }
  }, [href, storeUserData.userId]);

  useEffect(() => {
    if (href) {
      analyticsPageView(storeUserData.userId);
    }
  }, [href]);

  return (
    <IntlProvider locale={getLanguageCodefromLocale(locale)} messages={messages || ENMessages}>
      <GoogleReCaptchaProvider
        language="en"
        reCaptchaKey={process.env.GATSBY_RECAPTCHA_KEY}
        scriptProps={{
          async: false, // optional, default to false,
          defer: false, // optional, default to false
          appendTo: "head", // optional, default to "head", can be "head" or "body",
          nonce: undefined, // optional, default undefined
        }}
        useEnterprise={false}
        useRecaptchaNet={true}
      >
        <StylesProvider injectFirst>
          <MuiThemeProvider theme={theme}>
            <StyleSheetManager disableVendorPrefixes={process.env.NODE_ENV === "development"}>
              <ThemeProvider theme={theme}>
                <CssBaseline />
                <ErrorAlert />
                <SuccessAlert />
                {storeLoader && <Loader />}
                {children}
              </ThemeProvider>
            </StyleSheetManager>
          </MuiThemeProvider>
        </StylesProvider>
      </GoogleReCaptchaProvider>
    </IntlProvider>
  );
};

export default AppLayout;

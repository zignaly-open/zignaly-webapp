// import '../styles/globals.css'
import React, { useEffect, useMemo, useState } from "react";
// import {  } from "@mui/material";
import { createTheme, ThemeProvider, StyledEngineProvider } from "@mui/material/styles";
import type { AppProps } from "next/app";
import { createGlobalStyle } from "styled-components";
// import { dark, light, ThemeProvider as ThemeProviderUI, Typography } from "zignaly-ui";
import { dark, light, ThemeProvider as ThemeProviderUI } from "zignaly-ui-test";
import CssBaseline from "@mui/material/CssBaseline";
import getTheme from "../lib/theme";
import { IntlProvider } from "react-intl";
import ENMessages from "../src/i18n/translations/en.yml";
import translations from "../src/i18n/translations";
import { getLanguageCodefromLocale } from "i18n";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import useStoreSettingsSelector from "../src/hooks/useStoreSettingsSelector";
import useStoreSessionSelector from "../src/hooks/useStoreSessionSelector";
import { Provider } from "react-redux";
import { store } from "../src/store/store.js";
import "./legacy.scss";
import { useRouter } from "next/router";
import { setToken } from "../lib/useRequest";

// const GlobalStyle = createGlobalStyle`
//   ${({ theme }) => `
//     body {
//       background: url(${theme.background.image.src}) no-repeat center center fixed;
//       background-size: cover;
//     }
//   `}
// `;

const WithReduxProvider = (Component) => (props) =>
  (
    <Provider store={store}>
      <Component {...props} />
    </Provider>
  );

function MyApp({ Component, pageProps }: AppProps) {
  const storeSession = useStoreSessionSelector();
  const { darkStyle, locale } = useStoreSettingsSelector();
  const router = useRouter();
  const darkTheme = router.pathname !== "/" && true;
  const theme = useMemo(() => createTheme(getTheme(darkTheme)), [darkTheme]);
  const [messages, setMessages] = useState(null);
  const token = storeSession.tradeApi.accessToken;
  // useEffect(() => {
  // Init api auth token with persisted value
  setToken(token);
  console.log("set", token);
  // }, [token]);

  /**
   *
   * @param {string} localeValue locale code
   * @returns {Promise<MessageRecord>} returns a record
   */
  const getMessages = async (localeValue) => {
    const lang = getLanguageCodefromLocale(localeValue);
    return await translations[lang]();
  };

  // Merged english messages with selected by user locale messages
  // In this case all english data would be overridden to user selected locale, but untranslated
  // (missed in object keys) just stay in english
  useEffect(() => {
    getMessages(locale).then((selectedLanguageMessages) => {
      const mergedMessages = Object.assign({}, ENMessages, selectedLanguageMessages);
      setMessages(mergedMessages);
    });
  }, [locale]);

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
        <StyledEngineProvider injectFirst>
          <ThemeProvider theme={theme}>
            <ThemeProviderUI theme={dark}>
              {/* <GlobalStyle /> */}
              <CssBaseline />
              <Component {...pageProps} />
            </ThemeProviderUI>
          </ThemeProvider>
        </StyledEngineProvider>
      </GoogleReCaptchaProvider>
    </IntlProvider>
  );
}

MyApp.getInitialProps = async (appContext) => {
  console.log("aaa");
  // const appProps = await App.getInitialProps(appContext);
  // return { ...appProps };
};

export default WithReduxProvider(MyApp);

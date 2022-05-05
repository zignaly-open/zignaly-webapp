import React, { useEffect, useMemo, useState } from "react";
import { createTheme, ThemeProvider, StyledEngineProvider } from "@mui/material/styles";
import { ThemeProvider as ThemeProviderUI, dark } from "zignaly-ui";
import type { AppProps } from "next/app";
import CssBaseline from "@mui/material/CssBaseline";
import getTheme from "../lib/theme";
import { IntlProvider } from "react-intl";
import translationsEN from "i18n/translations/en.yml";
import translations from "i18n/translations";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import { Provider, useSelector } from "react-redux";
import { store } from "lib/store/store";
import { useRouter } from "next/router";
import { getLanguageCodefromLocale } from "../i18n";
import Auth from "../components/Auth";
import SWRAuthConfig from "components/SWRAuthConfig";
import Head from "next/head";
import "./styles.css";
import "../legacy/styles/legacy.scss";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";

// todo: Replace these old components
import ErrorAlert from "legacy/components/Alerts/ErrorAlert";
import SuccessAlert from "legacy/components/Alerts/SuccessAlert";
import getLegacyTheme from "legacy/utils/legacy-theme";

let persistor = persistStore(store);

const WithReduxProvider = (Component) => (props) =>
  (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Component {...props} />
      </PersistGate>
    </Provider>
  );

function MyApp({ Component, pageProps }: AppProps) {
  const { darkStyle, locale } = useSelector((state: any) => state.settings);
  const router = useRouter();
  const isLogin = ["/", "/login", "/signup"].includes(router.pathname);
  const darkTheme = !isLogin && darkStyle;
  const theme = useMemo(
    () => createTheme({ ...dark, ...(isLogin ? getLegacyTheme() : getTheme(darkTheme)) }),
    [darkTheme, isLogin],
  );
  const [messages, setMessages] = useState(null);

  const getMessages = async (localeValue: string): Promise<Record<string, string>> => {
    const lang = getLanguageCodefromLocale(localeValue);
    return await translations[lang]();
  };

  // Merged english messages with selected by user locale messages
  // In this case all english data would be overridden to user selected locale, but untranslated
  // (missed in object keys) just stay in english
  useEffect(() => {
    getMessages(locale).then((selectedLanguageMessages) => {
      const mergedMessages = Object.assign({}, translationsEN, selectedLanguageMessages);
      setMessages(mergedMessages);
    });
  }, [locale]);

  return (
    <IntlProvider locale={getLanguageCodefromLocale(locale)} messages={messages || translationsEN}>
      <GoogleReCaptchaProvider
        language="en"
        reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_KEY}
        useEnterprise={false}
        useRecaptchaNet={true}
      >
        <StyledEngineProvider injectFirst>
          <ThemeProvider theme={theme}>
            <ThemeProviderUI theme={theme}>
              <CssBaseline />
              <SWRAuthConfig>
                <Auth>
                  <Head>
                    {/* Preload fonts */}
                    <link
                      as="font"
                      crossOrigin=""
                      href={`${process.env.NEXT_PUBLIC_BASE_PATH}/fonts/PlexSans/IBMPlexSans-Regular.ttf`}
                      rel="preload"
                    />
                  </Head>
                  <ErrorAlert />
                  <SuccessAlert />
                  <Component {...pageProps} />
                </Auth>
              </SWRAuthConfig>
            </ThemeProviderUI>
          </ThemeProvider>
        </StyledEngineProvider>
      </GoogleReCaptchaProvider>
    </IntlProvider>
  );
}

// MyApp.getInitialProps = async (appContext) => {};

export default WithReduxProvider(MyApp);

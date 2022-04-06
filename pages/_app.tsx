// import '../styles/globals.css'
import React, { useEffect, useMemo, useState } from "react";
// import {  } from "@mui/material";
import { createTheme, ThemeProvider, StyledEngineProvider } from "@mui/material/styles";
import type { AppProps } from "next/app";
import { createGlobalStyle } from "styled-components";
// import { dark, light, ThemeProvider as ThemeProviderUI, Typography } from "zignaly-ui";
import { dark, light, ThemeProvider as ThemeProviderUI, PriceLabel } from "zignaly-ui";
import CssBaseline from "@mui/material/CssBaseline";
import getTheme from "../lib/theme";
import { IntlProvider } from "react-intl";
import ENMessages from "../src/i18n/translations/en.yml";
import translations from "../src/i18n/translations";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import useStoreSettingsSelector from "../src/hooks/useStoreSettingsSelector";
import useStoreSessionSelector from "../src/hooks/useStoreSessionSelector";
import { Provider, useDispatch } from "react-redux";
import { store } from "../src/store/store.js";
import "./legacy.scss";
import { useRouter } from "next/router";
import { getLanguageCodefromLocale } from "../src/i18n";
import { RouteGuard } from "../components/RouteGuard";
import { SWRConfig } from "swr";
import { endTradeApiSession } from "../src/store/actions/session";

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

const ConfigureAuthFetch = ({ children }) => {
  const storeSession = useStoreSessionSelector();
  const token = storeSession.tradeApi.accessToken;
  const dispatch = useDispatch();
  const router = useRouter();
  return (
    <SWRConfig
      value={{
        fetcher: async (url, options) => {
          const o = {
            method: options?.body ? "POST" : "GET",
            ...options,
            ...(options?.body && { body: JSON.stringify(options.body) }),
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
              "X-API-KEY": process.env.NEXT_PUBLIC_KEY || "",
              ...options?.headers,
            },
          };

          // Remove authorization key when not needed
          if (options?.headers?.Authorization === null) {
            delete o.headers.Authorization;
          }

          const res = await fetch(url, o);
          if (!res.ok) {
            if (res.status === 401) {
              dispatch(endTradeApiSession());
              console.log("401 caught, redir to login");
              router.push({
                pathname: "/",
                query: { returnUrl: router.asPath },
              });
            } else {
              throw Error(res.statusText);
            }
          }
          return res.json();
          // res.ok ? res.json() : Promise.reject(res)
        },
        onError: (err) => {
          console.error(err);
        },
      }}
    >
      {children}
    </SWRConfig>
  );
};

function MyApp({ Component, pageProps }: AppProps) {
  const { darkStyle, locale } = useStoreSettingsSelector();
  const router = useRouter();
  const darkTheme = router.pathname !== "/" && true;
  const theme = useMemo(() => createTheme({ ...dark, ...getTheme(darkTheme) }), [darkTheme]);
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
            <ThemeProviderUI theme={theme}>
              {/* <GlobalStyle /> */}
              <CssBaseline />
              <RouteGuard>
                <ConfigureAuthFetch>
                  <Component {...pageProps} />
                </ConfigureAuthFetch>
              </RouteGuard>
            </ThemeProviderUI>
          </ThemeProvider>
        </StyledEngineProvider>
      </GoogleReCaptchaProvider>
    </IntlProvider>
  );
}

// MyApp.getInitialProps = async (appContext) => {};

export default WithReduxProvider(MyApp);

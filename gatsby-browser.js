import React from "react";
import { Provider } from "react-redux";
import { Helmet } from "react-helmet";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./src/store/store.js";
import { navigateLogin } from "./src/services/navigation";
import "./src/styles/styles.scss";
import { verifySessionData } from "./src/utils/auth";
import { navigate } from "gatsby";
import "whatwg-fetch";
import tradeApi from "services/tradeApiClient";
// import { createHistory } from "@reach/router";
// const history = typeof window !== "undefined" ? createHistory(window) : null;

// if (window.Cypress || process.env.MIRAGE === "true") {
//   import("utils/mirage/server").then((server) => {
//     server.setup();
//   });
// }

// Handle Mirage server

export const wrapRootElement = ({ element }) => {
  // Add notranslate meta to prevent Chrome translation tool mutating React virtual DOM.
  // See: https://github.com/facebook/react/issues/11538
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <Helmet>
          <meta content="notranslate" name="google" />
        </Helmet>
        {element}
      </PersistGate>
    </Provider>
  );
};

/**
 * Cleanup process to unregister any SW installed by legacy webapp1.
 *
 * @returns {Void} None.
 */
const serviceWorkerCleanup = () => {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      registrations.forEach((registration) => {
        registration.unregister();
      });

      if (Array.isArray(registrations) && registrations.length > 0) {
        location.reload();
      }
    });
  }
};

export const onClientEntry = () => {
  serviceWorkerCleanup();
  if (process.env.NODE_ENV === "development") {
    // const whyDidYouRender = require("@welldone-software/why-did-you-render");
    // whyDidYouRender(React, {
    //   trackAllPureComponents: true,
    //   trackExtraHooks: [[require("react-redux/lib"), "useSelector"]],
    // });
  }
};

export const onInitialClientRender = () => {
  const state = store.getState();
  // @ts-ignore
  const token = state.session.tradeApi.accessToken;
  // Init api auth token with persisted value
  tradeApi.setToken(token);

  // @ts-ignore
  const sessionData = state.session.sessionData;
  let path = "";
  if (typeof window !== "undefined") {
    path = window.location.pathname;
  }

  // Verify session when app loads.
  const sessionValid = verifySessionData(token, sessionData);
  // Root page handles the correct redirection manually.
  if (path !== "/") {
    const isLoginArea = path.match(/login|signup/g);
    const isRecoverArea = path.match(/recover|disable2fa|changeEmail|deleteAccount/g);
    const isPrivateArea = !isLoginArea && !isRecoverArea;

    if (sessionValid) {
      if (isLoginArea) {
        // Redirect to dashboard when navigating login pages with an active session.
        navigate("/dashboard");
      }
    } else if (isPrivateArea) {
      // Redirect to login when navigating private pages with expired session.
      navigateLogin();
    }
  }

  // TODO: Disable due to weird behaviors caused in login page render and blank page on other pages reload.
  // setInterval(() => {
  //   store.dispatch(showLoader(false));
  // }, 500);
};

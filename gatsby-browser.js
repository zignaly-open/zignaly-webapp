import React from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store } from "./src/store/store.js";
import { persistor } from "./src/store/store.js";
import { triggerTz } from "./src/services/tz";
import { navigateLogin } from "./src/services/navigation";
import "./src/styles/styles.scss";
import { verifySessionData } from "./src/utils/auth";
import { navigate } from "gatsby";
// import { createHistory } from "@reach/router";
// const history = typeof window !== "undefined" ? createHistory(window) : null;

export const wrapRootElement = ({ element }) => {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>{element}</PersistGate>
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
  // @ts-ignore
  const sessionData = state.session.sessionData;
  let path = "";
  if (typeof window !== "undefined") {
    path = window.location.pathname;
  }

  // Verify session when app loads.
  const sessionValid = verifySessionData(token, sessionData);
  // Route page handles the correct redirection manually.
  if (path !== "/") {
    if (!path.match(/404|login|signup|recover/g)) {
      // Redirect to login when navigating private pages with expired session.
      if (!sessionValid) {
        navigateLogin();
      }
    } else if (sessionValid) {
      // Redirect to dashboard when navigating login pages with an active session.
      navigate("/dashboard");
    }
  }

  // TODO: Disable due to weird behaviors caused in login page render and blank page on other pages reload.
  // setInterval(() => {
  //   store.dispatch(showLoader(false));
  // }, 500);
};

export const onRouteUpdate = ({ location, prevLocation }) => {
  // Triger internal tracking event
  triggerTz(location, prevLocation);
};

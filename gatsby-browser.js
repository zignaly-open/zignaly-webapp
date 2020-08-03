import React from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store } from "./src/store/store.js";
import { persistor } from "./src/store/store.js";
import { triggerTz } from "./src/services/tz";
import { navigateLogin } from "./src/services/navigation";
import "./src/styles/styles.scss";
// import { createHistory } from "@reach/router";
// const history = typeof window !== "undefined" ? createHistory(window) : null;

export const wrapRootElement = ({ element }) => {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>{element}</PersistGate>
    </Provider>
  );
};

export const onClientEntry = () => {
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

  if (!path.match(/404|login|signup|recover/g)) {
    verifySessionData(token, sessionData);
  }

  // TODO: Disable due to weird behaviors caused in login page render and blank page on other pages reload.
  // setInterval(() => {
  //   store.dispatch(showLoader(false));
  // }, 500);
};

export const onPreRouteUpdate = ({ location }) => {
  const path = location.pathname;
  const state = store.getState();
  // @ts-ignore
  const token = state.session.tradeApi.accessToken;

  if (!path.match(/404|login|signup|recover/g)) {
    if (!token) {
      navigateLogin();
    }
  }
};

const verifySessionData = async (token, sessionData) => {
  if (!token || !sessionData || !sessionData.validUntil || !isValid(sessionData.validUntil)) {
    navigateLogin();
  }
};

const isValid = (milliseconds) => {
  let currentTime = new Date().getTime();
  if (milliseconds <= currentTime) {
    return false;
  }
  return true;
};

export const onRouteUpdate = ({ location, prevLocation }) => {
  // Triger internal tracking event
  triggerTz(location, prevLocation);
};

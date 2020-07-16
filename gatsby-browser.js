import React from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store } from "./src/store/store.js";
import { persistor } from "./src/store/store.js";
import * as ReactRedux from "react-redux";
import { navigate } from "gatsby";
import tradeApi from "./src/services/tradeApiClient";

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
  /*@ts-ignore */
  const token = state.session.tradeApi.accessToken;
  /*@ts-ignore */
  const sessionData = state.session.sessionData;
  let path = "";
  if (typeof window !== "undefined") {
    path = window.location.pathname;
  }

  if (!path.match(/login|signup|recover/g)) {
    verifySessionData(token, sessionData);
  }
};

export const onPreRouteUpdate = ({ location, prevLocation }) => {
  const path = location.pathname;
  const state = store.getState();
  /*@ts-ignore */
  const token = state.session.tradeApi.accessToken;

  if (!path.match(/login|signup|recover/g)) {
    if (!token) {
      navigate("/login");
    }
  }
};

const verifySessionData = async (token, sessionData) => {
  if (!token) {
    navigate("/login");
  } else {
    if (sessionData && sessionData.validUntil) {
      if (!isValid(sessionData.validUntil)) {
        navigate("/login");
      }
    } else {
      const payload = {
        token: token,
      };
      tradeApi
        .sessionDataGet(payload)
        .then((response) => {
          if (!isValid(response.validUntil)) {
            navigate("/login");
          }
        })
        .catch(() => {
          navigate("/login");
        });
    }
  }
};

const isValid = (milliseconds) => {
  let currentTime = new Date().getTime();
  if (milliseconds > currentTime) {
    return true;
  }
  return false;
};

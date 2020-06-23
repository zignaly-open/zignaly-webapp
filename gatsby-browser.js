import React from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store } from "./src/store/store.js";
import { persistor } from "./src/store/store.js";
import * as ReactRedux from "react-redux";

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

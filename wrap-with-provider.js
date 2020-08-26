import React from "react";
import { Helmet } from "react-helmet";
import { Provider } from "react-redux";
import { store } from "./src/store/store.js";

export default ({ element }) => {
  // Instantiating store in `wrapRootElement` handler ensures:
  //  - there is fresh store for each SSR page
  //  - it will be called only once in browser, when React mounts
  // Add notranslate meta to prevent Chrome translation tool mutating React virtual DOM.
  // See: https://github.com/facebook/react/issues/11538
  return (
    <Provider store={store}>
      <Helmet>
        <meta content="notranslate" name="google" />
      </Helmet>
      {element}
    </Provider>
  );
};

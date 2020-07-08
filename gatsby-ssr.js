import React, { Fragment } from "react";
import wrapWithProvider from "./wrap-with-provider";
export const wrapRootElement = wrapWithProvider;

export const onRenderBody = ({ setPostBodyComponents }) => {
  setPostBodyComponents([
    <Fragment>
      <script type="text/javascript" src="./src/util/freshworksWidget.js"></script>
      <script
        type="text/javascript"
        src="https://widget.freshworks.com/widgets/48000001413.js"
        async
        defer
      ></script>
    </Fragment>,
  ]);
};

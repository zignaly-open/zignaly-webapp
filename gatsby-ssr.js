import { withPrefix } from "gatsby-link";
import React from "react";
import wrapWithProvider from "./wrap-with-provider";

export const wrapRootElement = wrapWithProvider;

export const onRenderBody = ({ setHeadComponents, setPostBodyComponents }, pluginOptions) => {
  // setHeadComponents([
  //   <script
  //     key="gatsby-plugin-newrelic"
  //     dangerouslySetInnerHTML={{
  //       __html: newRelic,
  //     }}
  //   />,
  // ]);
  if (process.env.NODE_ENV === "production") {
    setHeadComponents([<script key="newrelic" src={withPrefix("newRelic.js")} />]);
  }
};

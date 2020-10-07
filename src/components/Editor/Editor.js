import React from "react";
import loadable from "@loadable/component";

const LoadableEditor = loadable(() => import("./CustomEditor"));

/**
 * @typedef {import('./CustomEditor').DefaultProps} DefaultProps
 */

/**
 * Render Editor
 * @param {DefaultProps} props props
 * @returns {JSX.Element} JSX
 */
const Editor = (props) => (
  <div style={{ minHeight: "50px" }}>
    <LoadableEditor {...props} />
  </div>
);

export default Editor;

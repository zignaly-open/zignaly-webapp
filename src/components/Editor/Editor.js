import React from "react";
import loadable from "@loadable/component";

const LoadableEditor = loadable(() => import("./CustomEditor"));

export default LoadableEditor;

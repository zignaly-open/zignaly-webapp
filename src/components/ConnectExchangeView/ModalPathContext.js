import React from "react";

const ModalPathContext = React.createContext({
  previousPath: "",
  setPreviousPath: () => {},
  setPathParams: () => {},
  resetPath: () => {},
  setTitle: () => {},
  pathParams: {},
  currentPath: "",
});

export default ModalPathContext;

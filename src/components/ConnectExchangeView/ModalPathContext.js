import React from "react";

const ModalPathContext = React.createContext({
  previousPath: "",
  setPreviousPath: () => {},
  setPathParams: () => {},
  resetPath: () => {},
  pathParams: {},
  currentPath: "",
});

export default ModalPathContext;

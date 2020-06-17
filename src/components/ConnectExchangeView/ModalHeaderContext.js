import React from "react";

const ModalHeaderContext = React.createContext({
  previousPath: "",
  setPreviousPath: () => {},
  setPathParams: () => {},
  resetPath: () => {},
  pathParams: {},
  currentPath: "",
});

export default ModalHeaderContext;

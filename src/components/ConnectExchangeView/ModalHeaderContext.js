import React from "react";

const ModalHeaderContext = React.createContext({
  previousPath: "",
  setPreviousPath: () => {},
  setPathParams: () => {},
  pathParams: {},
  currentPath: "",
});

export default ModalHeaderContext;

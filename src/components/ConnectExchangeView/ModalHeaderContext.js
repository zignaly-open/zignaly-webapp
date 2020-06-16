import React from "react";

const ModalHeaderContext = React.createContext({
  previousPath: "",
  setPreviousPath: () => {},
  setPathParams: () => {},
  pathParams: {},
});

export default ModalHeaderContext;

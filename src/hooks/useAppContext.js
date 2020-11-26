import { useState } from "react";

/**
 * @typedef {import("../appContext").AppContextObject} AppContextObject
 */

/**
 * Handle un-persisted state management for the different parts of app using React context.
 *
 * @returns {AppContextObject} App context object.
 */
const usePositionsContext = () => {
  const [emptySettingsAlert, setEmptySettingsAlert] = useState(false);

  return {
    emptySettingsAlert,
    setEmptySettingsAlert,
  };
};

export default usePositionsContext;

import { useState } from "react";

/**
 * @typedef {import("../appContext").AppContextObject} AppContextObject
 */

/**
 * Handle the state management for the modal path data that is shared via context.
 *
 * @returns {AppContextObject} Modal path state object.
 */
const usePositionsContext = () => {
  const [emptySettingsAlert, setEmptySettingsAlert] = useState(false);

  return {
    emptySettingsAlert,
    setEmptySettingsAlert,
  };
};

export default usePositionsContext;

import { useState } from "react";

/**
 * @typedef {import("../context/ProviderContext").ProviderContextObject} ProviderContextObject
 */

/**
 * Handle un-persisted state management for the different parts of app using React context.
 *
 * @returns {ProviderContextObject} App context object.
 */
const useProviderContext = () => {
  const [hasAllocated, setHasAllocated] = useState(true);

  return {
    hasAllocated,
    setHasAllocated,
  };
};

export default useProviderContext;

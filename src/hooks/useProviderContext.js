import { useState } from "react";

/**
 * @typedef {import("../components/Provider/ProviderContext").ProviderContextObject} ProviderContextObject
 */

/**
 * Handle un-persisted state management for the different parts of app using React context.
 *
 * @returns {ProviderContextObject} App context object.
 */
const useProviderContext = () => {
  const [hasAllocated, setHasAllocated] = useState(false);

  return {
    hasAllocated,
    setHasAllocated,
  };
};

export default useProviderContext;

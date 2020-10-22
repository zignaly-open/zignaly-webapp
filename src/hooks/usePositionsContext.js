import { useState } from "react";

/**
 * @typedef {import("../components/Dashboard/PositionsContext").PositionsContextObject} PositionsContextObject
 */

/**
 * Handle the state management for the modal path data that is shared via context.
 *
 * @returns {PositionsContextObject} Modal path state object.
 */
const usePositionsContext = () => {
  const [openCount, setOpenCount] = useState(0);
  const [closeCount, setCloseCount] = useState(0);
  const [logCount, setLogCount] = useState(0);

  return {
    openCount,
    closeCount,
    logCount,
    setOpenCount,
    setCloseCount,
    setLogCount,
  };
};

export default usePositionsContext;

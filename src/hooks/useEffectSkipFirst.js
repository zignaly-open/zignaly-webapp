import { useEffect, useRef } from "react";

/**
 * Run effect on dependencies change, skipping the inital changes
 * @param {function} callback useEffect callback
 * @param {Array<any>} dependencies useEffect dependencies
 * @returns {void}
 */
const useEffectSkipFirst = (callback, dependencies) => {
  const isFirstRun = useRef(true);
  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }

    callback();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);
};

export default useEffectSkipFirst;

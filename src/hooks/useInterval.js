import { useRef, useEffect } from "react";
import useStoreUIModalSelector from "./useStoreUIModalSelector";

/**
 * Interval hook that can pause execution when a fullscreen modal is open.
 *
 * @param {function} callback Callback function
 * @param {number} delay Delay
 * @param {boolean} modalPause Flag to pause execution when modal is open.
 * @returns {void}
 */
const useInterval = (callback, delay, modalPause) => {
  const storeUIModal = useStoreUIModalSelector();

  let savedCallback = useRef(/** @type {function} **/ (() => {}));
  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  });

  // Set up the interval.
  useEffect(() => {
    if (delay === null) return undefined;
    const tick = () => {
      if (!modalPause || !storeUIModal.globalModal) {
        savedCallback.current();
      }
    };
    let id = setInterval(tick, delay);
    return () => {
      return clearInterval(id);
    };
  }, [delay, modalPause, storeUIModal.globalModal]);
};

export default useInterval;

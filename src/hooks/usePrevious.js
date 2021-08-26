import { useEffect, useRef } from "react";

/**
 * Hook to save a reference to the previous value before state change
 * @param {*} value Value
 * @returns {*} value
 */
const usePrevious = (value) => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

export default usePrevious;

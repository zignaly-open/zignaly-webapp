import { useEffect, useRef } from "react";
import { isEqual } from "lodash";

/**
 * @typedef {import('react').EffectCallback} EffectCallback
 */

/**
 * @param {*} value value
 * @returns {*} value
 */
const useDeepCompareMemoize = (value) => {
  const ref = useRef();

  if (!isEqual(value, ref.current)) {
    ref.current = value;
  }

  return ref.current;
};

/**
 * Run effect on dependencies change (deep comparison)
 * @param {EffectCallback} callback useEffect callback
 * @param {Array<any>} dependencies useEffect dependencies
 * @returns {void}
 */
const useDeepCompareEffect = (callback, dependencies) => {
  useEffect(callback, useDeepCompareMemoize(dependencies));
};

export default useDeepCompareEffect;

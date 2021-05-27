import { useState, useRef } from "react";
import { assign, isEqual } from "lodash";
import { setFilters as setFiltersAction } from "../store/actions/settings";
import { useDispatch } from "react-redux";
import { extractVal } from "../components/CustomSelect";

/**
 * @typedef {import("../store/actions/settings").Filter} Filter
 * @typedef {import("../components/CustomSelect/CustomSelect").Option} Option
 */

/**
 * @typedef {Object} UseFiltersOptions
 * @property {Object} defaultValues
 * @property {Object} storeValues
 * @property {Object} optionsFilters
 */

/**
 * @typedef {Object} FiltersData
 * @property {function} clearFilters
 * @property {function} setFilters
 * @property {number} modifiedFilters
 * @property {Filter} filters
 */

/**
 * Hook to handle filters update/saving.
 *
 * @param {Filter} defaultValues Default filter values
 * @param {Filter} [storeValues] Filter store object
 * @param {Object<string, Array<Option>>} [optionsFilters] Object with each available filter options
 * @param {string} [page] Page key
 * @returns {FiltersData} Filters data
 */
const useFilters = (
  defaultValues,
  storeValues,
  optionsFilters,
  page,
  // eslint-disable-next-line max-params
) => {
  /**
   * Initial filters values using the saved values or falling back to default if not in options values
   * @returns {Filter} filters
   */
  const initialValues = () => {
    /**
     * @type {Filter}
     */
    // @ts-ignore
    const values = {};
    Object.keys(defaultValues).forEach((/** @type {keyof Filter} */ key) => {
      values[key] = defaultValues[key];
      if (storeValues && storeValues[key]) {
        // Check that saved value is of correct type
        const typeCorrect = typeof storeValues[key] === typeof defaultValues[key];
        // Check if available options are loaded
        const optionsReady = Boolean(optionsFilters[key] && optionsFilters[key].length);
        // Check that saved value exists in options
        const valueCorrect =
          !optionsReady ||
          optionsFilters[key].find((o) => extractVal(o) === extractVal(storeValues[key]));
        if (typeCorrect && valueCorrect) {
          values[key] = storeValues[key];
        }
      }
    });
    return values;
  };
  const [filters, setFilters] = useState(initialValues());
  const dispatch = useDispatch();

  // If options have changed then check the filters again right away
  const lastOptionsFilters = useRef(optionsFilters);
  let filtersChecked = filters;
  if (!isEqual(lastOptionsFilters.current, optionsFilters)) {
    filtersChecked = initialValues();
    lastOptionsFilters.current = optionsFilters;
    setFilters(filtersChecked);
  }

  const modifiedFilters = () => {
    let count = 0;
    Object.entries(filters).forEach((/** @type {[keyof Filter, string]} */ [key, value]) => {
      if (value !== defaultValues[key]) {
        count++;
      }
    });
    return count;
  };

  /**
   * Save filters to store
   * @param {Filter} newFilters filters
   * @returns {void}
   */
  const persistFilters = (newFilters) => {
    dispatch(
      setFiltersAction({
        filters: newFilters,
        // @ts-ignore
        page,
      }),
    );
  };

  /**
   * Combine external state filters with local state.
   *
   * @param {Filter} values External filter values.
   *
   * @returns {Void} None.
   */
  const combineFilters = (values) => {
    const newFilters = assign({}, filters, values);
    setFilters(newFilters);
    persistFilters(newFilters);
  };

  const clearFilters = () => {
    /**
     * @type {Filter}
     */
    // @ts-ignore
    const newFilters = {};
    Object.keys(filters).forEach((/** @type {keyof Filter} */ key) => {
      newFilters[key] = defaultValues[key];
    });
    setFilters(newFilters);
    persistFilters(newFilters);
  };

  return {
    filters: filtersChecked,
    setFilters: combineFilters,
    clearFilters,
    modifiedFilters: modifiedFilters(),
  };
};

export default useFilters;

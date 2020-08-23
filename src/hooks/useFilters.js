import { useState, useRef } from "react";
import { assign, isEqual } from "lodash";
import {
  setSort as setSortAction,
  setTimeFrame as setTimeFrameAction,
  setFilters as setFiltersAction,
} from "../store/actions/settings";
import { showErrorAlert } from "../store/actions/ui";
import { useDispatch } from "react-redux";
import { extractVal } from "../components/CustomSelect";
import useDeepCompareEffect from "./useDeepCompareEffect";

/**
 * @typedef {import("../store/initialState").DefaultState} DefaultStateType
 * @typedef {import("../store/initialState").DefaultStateSession} StateSessionType
 * @typedef {import("../store/actions/settings").ProviderPageType} ProviderPageType
 * @typedef {import("../store/actions/settings").ConnectedProviderPageType} ConnectedProviderPageType
 * @typedef {import("../services/tradeApiClient.types").ProvidersCollection} ProvidersCollection
 * @typedef {import("../services/tradeApiClient.types").ProviderEntity} ProviderEntity
 * @typedef {import("../services/tradeApiClient.types").ProvidersPayload} ProvidersPayload
 * @typedef {import("../components/CustomSelect/CustomSelect").OptionType} OptionType
 */

/**
 * @typedef {Object} ProvidersOptions
 * @property {boolean} copyTradersOnly
 * @property {boolean} connectedOnly
 */

/**
 * @typedef {Object} Filters
 * @property {string} quote
 * @property {string} exchange
 * @property {string} exchangeType
 * @property {string} fromUser
 */

/**
 * @typedef {Object} ProvidersData
 * @property {ProvidersCollection} providers
 * @property {number} timeFrame
 * @property {function} setTimeFrame
 * @property {Array<OptionType>} quotes
 * @property {Array<OptionType>} exchanges
 * @property {Array<OptionType>} exchangeTypes
 * @property {function} setExchangeType
 * @property {Array<OptionType>} fromUserOptions
 * @property {string} sort
 * @property {function} setSort
 * @property {function} clearFilters
 * @property {function} clearSort
 * @property {function} setFilters
 * @property {Filters} filters
 */

/**
 * Hook to generate the providers data fetching and filtering.
 *
 * @param {ProvidersOptions} options Hook options.
 * @returns {ProvidersData} Providers and filtering objects.
 */
const useFilters = (defaultValues, storeValues = {}, optionsFilters = {}, page) => {
  const initialValues = () => {
    // Initial values of the filters using the saved value or falling back to default
    const values = {};
    Object.entries(defaultValues).forEach(([key, value]) => {
      values[key] = defaultValues[key];
      if (storeValues[key]) {
        // Check that saved value is of correct type
        const typeCorrect = typeof storeValues[key] === typeof defaultValues[key];
        // Check that saved value exists in options
        const valueCorrect =
          !optionsFilters[key] ||
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
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== defaultValues[key]) {
        count++;
      }
    });
    return count;
  };

  /**
   * Combine external state filters with local state.
   *
   * @param {defaultFilters} values External filter values.
   *
   * @returns {Void} None.
   */
  const combineFilters = (values) => {
    const newFilters = assign({}, filters, values);
    setFilters(newFilters);

    dispatch(
      setFiltersAction({
        filters: newFilters,
        // @ts-ignore
        page,
      }),
    );
  };

  const clearFilters = () => {
    const newFilters = {};
    Object.entries(filters).forEach(([key, value]) => {
      newFilters[key] = defaultValues[key];
    });
    setFilters(newFilters);
  };

  return {
    filters: filtersChecked,
    setFilters: combineFilters,
    clearFilters,
    modifiedFilters: modifiedFilters(),
  };
};

export default useFilters;

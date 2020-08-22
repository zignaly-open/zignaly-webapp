import { useState, useEffect } from "react";
import tradeApi from "../services/tradeApiClient";
import useStoreSessionSelector from "./useStoreSessionSelector";
import useStoreSettingsSelector from "./useStoreSettingsSelector";
import useQuoteAssets from "./useQuoteAssets";
import useExchangesOptions from "./useExchangesOptions";
import useEffectSkipFirst from "./useEffectSkipFirst";
import { useIntl } from "react-intl";
import { uniqBy, assign } from "lodash";
import {
  setSort as setSortAction,
  setTimeFrame as setTimeFrameAction,
  setFilters as setFiltersAction,
} from "../store/actions/settings";
import { showErrorAlert } from "../store/actions/ui";
import { useDispatch } from "react-redux";

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
const useFilters = (defaultValues, storeValues = {}, page) => {
  const initialValues = {};
  Object.entries(defaultValues).forEach(([key, value]) => {
    initialValues[key] = storeValues[key] || defaultValues[key];
  });
  const [filters, setFilters] = useState(initialValues);
  const dispatch = useDispatch();

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
    filters,
    setFilters: combineFilters,
    clearFilters,
    modifiedFilters: modifiedFilters(),
  };
};

export default useFilters;

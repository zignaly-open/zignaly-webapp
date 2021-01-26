import { useState, useEffect, useRef } from "react";
import tradeApi from "../services/tradeApiClient";
import useEffectSkipFirst from "./useEffectSkipFirst";
import useStoreSettingsSelector from "./useStoreSettingsSelector";
import useStoreSessionSelector from "./useStoreSessionSelector";
import useBaseAssets from "./useBaseAssets";
import { useIntl } from "react-intl";
import { showErrorAlert } from "../store/actions/ui";
import { useDispatch } from "react-redux";
import useFilters from "./useFilters";
import useTimeFramesOptions from "./useTimeFramesOptions";
import useExchangeQuotes from "./useExchangeQuotes";

/**
 * @typedef {import("../store/initialState").DefaultState} DefaultStateType
 * @typedef {import("../store/initialState").DefaultStateSession} StateSessionType
 * @typedef {import("../store/initialState").TimeframeObject} TimeframeObject
 * @typedef {import("../services/tradeApiClient.types").ProvidersStatsCollection} ProvidersStatsCollection
 * @typedef {import("../components/CustomSelect/CustomSelect").OptionType} OptionType
 * @typedef {import("../store/initialState").Filters} Filters
 */

/**
 * @typedef {Object} ProviderStatsData
 * @property {ProvidersStatsCollection} stats
 * @property {Array<OptionType>} timeFrames
 * @property {Array<string>} quotes
 * @property {Array<OptionType>} bases
 * @property {function} clearFilters
 * @property {function} setFilters
 * @property {number} modifiedFilters
 * @property {Filters['signalpAnalytics'|'copytAnalytics']} filters
 */

/**
 * Hook to generate the providers stats fetching and filtering.
 *
 * @param {Array<'signal'|'copytraders'|'profitsharing'>} provType Type of provider to retreive.
 * @returns {ProviderStatsData} Providers stats and filtering objects.
 */
const useProvidersAnalytics = (provType) => {
  const intl = useIntl();
  const [stats, setStats] = useState([]);
  const dispatch = useDispatch();
  const storeSettings = useStoreSettingsSelector();
  const storeSession = useStoreSessionSelector();

  const copyTraders = provType.includes("copytraders");
  const profitSharing = provType.includes("profitsharing");

  const page = copyTraders || profitSharing ? "copytAnalytics" : "signalpAnalytics";
  const storeFilters = storeSettings.filters[page];

  const defaultFilters = {
    quote: "USDT",
    base: "ALL",
    timeFrame: "30days",
  };

  // quotes
  const { quoteAssets } = useExchangeQuotes({
    exchangeId: storeSettings.selectedExchange.exchangeId,
    exchangeType: storeSettings.selectedExchange.exchangeType,
  });
  const quotes = Object.keys(quoteAssets);

  const timeFrames = useTimeFramesOptions();

  const basesRef = useRef(/** @type {typeof bases}*/ []);
  const optionsFilters = {
    // wait until the options have been retreived before using them for comparison
    ...(quotes.length && { quote: quotes }),
    ...(basesRef.current.length > 1 && { base: basesRef.current }),
    timeFrame: timeFrames,
  };

  const filtersData = useFilters(defaultFilters, storeFilters, optionsFilters, page);
  const { setFilters, clearFilters, modifiedFilters } = filtersData;
  /**
   * @type {Filters[typeof page]}
   */
  // @ts-ignore
  const filters = filtersData.filters;

  // bases
  const baseAssets = useBaseAssets(filters.quote);
  const bases = Object.entries(baseAssets).map(([key, val]) => ({
    val: key,
    label: val.base + "/" + val.quote,
  }));
  bases.unshift({
    val: "ALL",
    label: intl.formatMessage({ id: "fil.pairs" }),
  });
  basesRef.current = bases;

  // Select all bases by default on quote change
  useEffectSkipFirst(() => {
    setFilters({ base: "ALL" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.quote]);

  const loadProvidersStats = () => {
    const payload = {
      token: storeSession.tradeApi.accessToken,
      ro: true,
      quote: filters.quote,
      base: filters.base,
      timeFrame: filters.timeFrame,
      DCAFilter: "anyDCA",
      provType: provType,
    };
    tradeApi
      .providersStatsGet(payload)
      .then((responseData) => {
        setStats(responseData);
      })
      .catch((e) => {
        dispatch(showErrorAlert(e));
      });
  };

  // Load stats at init and on filters change
  useEffect(loadProvidersStats, [filters, storeSession.tradeApi.accessToken, provType]);

  return {
    stats,
    quotes,
    bases,
    timeFrames,
    setFilters,
    filters,
    clearFilters,
    modifiedFilters,
  };
};

export default useProvidersAnalytics;

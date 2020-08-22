import { useState, useEffect } from "react";
import tradeApi from "../services/tradeApiClient";
import useEffectSkipFirst from "./useEffectSkipFirst";
import useStoreSettingsSelector from "./useStoreSettingsSelector";
import useStoreSessionSelector from "./useStoreSessionSelector";
import useQuoteAssets from "./useQuoteAssets";
import useBaseAssets from "./useBaseAssets";
import { useIntl } from "react-intl";
import { showErrorAlert } from "../store/actions/ui";
import { useDispatch } from "react-redux";
import {
  setTimeFrame as setTimeFrameAction,
  setFilters as setFiltersAction,
} from "../store/actions/settings";
import useFilters from "./useFilters";

/**
 * @typedef {import("../store/initialState").DefaultState} DefaultStateType
 * @typedef {import("../store/initialState").DefaultStateSession} StateSessionType
 * @typedef {import("../store/initialState").TimeframeObject} TimeframeObject
 * @typedef {import("../services/tradeApiClient.types").ProvidersStatsCollection} ProvidersStatsCollection
 * @typedef {import("../components/CustomSelect/CustomSelect").OptionType} OptionType
 */

/**
 * @typedef {Object} ProviderStatsData
 * @property {ProvidersStatsCollection} stats
 * @property {string} timeFrame
 * @property {Array<OptionType>} timeFrames
 * @property {function} setTimeFrame
 * @property {string} quote
 * @property {Array<string>} quotes
 * @property {function} setQuote
 * @property {OptionType} base
 * @property {Array<OptionType>} bases
 * @property {function} setBase
 * @property {function} clearFilters
 */

/**
 * Hook to generate the providers stats fetching and filtering.
 *
 * @param {'signalp'|'copyt'} type Type of provider to retreive.
 * @returns {ProviderStatsData} Providers stats and filtering objects.
 */
const useProvidersAnalytics = (type) => {
  const intl = useIntl();
  const [stats, setStats] = useState([]);
  const dispatch = useDispatch();
  const storeSettings = useStoreSettingsSelector();
  const storeSession = useStoreSessionSelector();

  const page = type === "signalp" ? "signalpAnalytics" : "copytAnalytics";
  const storeFilters = storeSettings.filters[page];

  const defaultFilters = {
    quote: "USDT",
    base: "ALL",
    timeFrame: "30days",
  };

  const { filters, setFilters, clearFilters, modifiedFilters } = useFilters(
    defaultFilters,
    storeFilters,
    page,
  );

  // time frames
  //   const timeFrames = useTimeFramesOptions();
  // Save settings to store when changed
  //   const saveTimeFrame = () => {
  //     dispatch(setTimeFrameAction({ timeFrame, page }));
  //   };
  //   useEffectSkipFirst(saveTimeFrame, [timeFrame]);

  // quotes
  const quoteAssets = useQuoteAssets();
  const quotes = Object.keys(quoteAssets);

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
      isCopyTrading: type === "copyt",
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
  useEffect(loadProvidersStats, [filters, storeSession.tradeApi.accessToken, type]);

  return {
    stats,
    quotes,
    bases,
    setFilters,
    filters,
    clearFilters,
    modifiedFilters,
  };
};

export default useProvidersAnalytics;

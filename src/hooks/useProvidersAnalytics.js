import { useState, useEffect } from "react";
import tradeApi from "../services/tradeApiClient";
import useEffectSkipFirst from "./useEffectSkipFirst";
import useStoreSettingsSelector from "./useStoreSettingsSelector";
import useStoreSessionSelector from "./useStoreSessionSelector";
import useQuoteAssets from "./useQuoteAssets";
import useBaseAssets from "./useBaseAssets";
import useTimeFramesOptions from "./useTimeFramesOptions";
import { useIntl } from "react-intl";
import { showErrorAlert } from "../store/actions/ui";
import { useDispatch } from "react-redux";
import {
  setAnayticsBase,
  setAnayticsQuote,
  setTimeFrame as setTimeFrameAction,
} from "../store/actions/settings";

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

  // time frames
  const timeFrames = useTimeFramesOptions();
  const initTimeFrame = storeSettings.timeFrame[page] || "30days";
  const [timeFrame, setTimeFrame] = useState(initTimeFrame);
  // Save settings to store when changed
  const saveTimeFrame = () => {
    dispatch(setTimeFrameAction({ timeFrame, page }));
  };
  useEffectSkipFirst(saveTimeFrame, [timeFrame]);

  // quotes
  const quoteAssets = useQuoteAssets();
  const quotes = Object.keys(quoteAssets);
  let initQuote = storeSettings[type].analytics.quote || "USDT";
  const [quote, setQuote] = useState(initQuote);
  // Save settings to store when changed
  const saveQuote = () => {
    dispatch(setAnayticsQuote({ quote, page: type }));
  };
  useEffectSkipFirst(saveQuote, [quote]);

  // bases
  const baseAssets = useBaseAssets(quote);
  const bases = Object.entries(baseAssets).map(([key, val]) => ({
    val: key,
    label: val.base + "/" + val.quote,
  }));
  bases.unshift({
    val: "ALL",
    label: intl.formatMessage({ id: "fil.pairs" }),
  });

  const savedBase = storeSettings[type].analytics.base;
  let initBase = savedBase ? { val: savedBase, label: savedBase } : bases[0];
  const [base, setBase] = useState(initBase);
  // Save settings to store when changed
  const saveBase = () => {
    dispatch(setAnayticsBase({ base: base.val, page: type }));
  };
  useEffectSkipFirst(saveBase, [base]);

  const clearFilters = () => {
    setQuote("USDT");
    setBase(bases[0]);
    setTimeFrame("30days");
  };

  // Select all bases by default on quote change
  useEffectSkipFirst(() => {
    setBase(bases[0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quote]);

  const loadProvidersStats = () => {
    const payload = {
      token: storeSession.tradeApi.accessToken,
      ro: true,
      quote,
      base: base.val,
      timeFrame,
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
  useEffect(loadProvidersStats, [
    timeFrame,
    quote,
    base.val,
    storeSession.tradeApi.accessToken,
    type,
  ]);

  return {
    stats,
    timeFrames,
    timeFrame,
    setTimeFrame,
    quotes,
    quote,
    setQuote,
    base,
    bases,
    setBase,
    clearFilters,
  };
};

export default useProvidersAnalytics;

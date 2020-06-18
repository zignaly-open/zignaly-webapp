import { useState, useEffect } from "react";
import tradeApi from "../services/tradeApiClient";
import { useSelector } from "react-redux";
import useQuoteAssets from "./useQuoteAssets";
import useBaseAssets from "./useBaseAssets";
import useTimeFramesOptions from "./useTimeFramesOptions";
import { useIntl } from "react-intl";

/**
 * @typedef {import("../store/initialState").DefaultState} DefaultStateType
 * @typedef {import("../store/initialState").DefaultStateSession} StateSessionType
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
 * @param {string} type Type of provider to retreive.
 * @returns {ProviderStatsData} Providers stats and filtering objects.
 */
const useProvidersAnalytics = (type) => {
  /**
   * Select store session data.
   *
   * @param {DefaultStateType} state Application store data.
   * @returns {StateSessionType} Store session data.
   */
  const selectStoreSession = (state) => state.session;
  const storeSession = useSelector(selectStoreSession);
  const intl = useIntl();
  const [stats, setStats] = useState([]);

  // time frames
  const timeFrames = useTimeFramesOptions();
  const [timeFrame, setTimeFrame] = useState("30days");

  // quotes
  const quoteAssets = useQuoteAssets();
  const quotes = Object.keys(quoteAssets);
  const [quote, setQuote] = useState("USDT");

  // bases
  const baseAssets = useBaseAssets(quote);
  const bases = Object.entries(baseAssets).map(([key, val]) => ({
    val: key,
    label: val.base + "/" + val.quote,
  }));
  bases.unshift({ val: "ALL", label: intl.formatMessage({ id: "fil.pairs" }) });
  const [base, setBase] = useState(bases[0]);

  const clearFilters = () => {
    setQuote("USDT");
    setBase(bases[0]);
    setTimeFrame("30days");
  };

  // Select all bases by default on quote change
  useEffect(() => {
    setBase(bases[0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quote]);

  // Load stats at init and on filters change
  useEffect(() => {
    const loadProvidersStats = async () => {
      try {
        const payload = {
          token: storeSession.tradeApi.accessToken,
          ro: true,
          quote,
          base: base.val,
          timeFrame,
          DCAFilter: "anyDCA",
          isCopyTrading: type === "copyt",
        };
        const responseData = await tradeApi.providersStatsGet(payload);
        setStats(responseData);
      } catch (e) {
        // TODO: Display error in alert.
      }
    };

    loadProvidersStats();
  }, [timeFrame, quote, base.val, storeSession.tradeApi.accessToken, type]);

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
